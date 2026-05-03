import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import HintSystem from '../components/HintSystem'
import LanguageLevelModal from '../components/modals/LanguageLevelModal'
import '../styles/DebuggingPage.css'

// ── Randomisation pools ───────────────────────────────────────────────────────
const TOPICS = {
  javascript: [
    'a shopping cart that calculates total price with tax',
    'a function that finds the largest number in an array',
    'a countdown timer that logs seconds remaining',
    'a to-do list that adds and removes items',
    'a grade calculator that returns a letter grade',
    'a string reversal function',
    'a function that checks if a number is prime',
    'a simple bank account with deposit and withdrawal',
    'a function that removes duplicates from an array',
    'a temperature converter between Celsius and Fahrenheit',
    'a function that counts vowels in a string',
    'a simple quiz that checks answers and scores points',
    'a function that flattens a nested array',
    'a password validator that checks length and special chars',
    'a function that groups array items by a property',
  ],
  react: [
    'a counter component with increment and decrement buttons',
    'a toggle component that shows and hides a message',
    'a form component that validates an email input',
    'a list component that renders items and lets you delete them',
    'a timer component that counts up every second',
    'a colour picker that changes background colour on click',
    'a search bar that filters a list of names',
    'a simple accordion that expands and collapses sections',
    'a character counter that warns when near the limit',
    'a star rating component',
    'a tabs component that switches between panels',
    'a progress bar that fills based on a prop value',
  ],
  python: [
    'a function that calculates the factorial of a number',
    'a function that finds all even numbers in a list',
    'a function that merges two sorted lists',
    'a simple stack class with push and pop',
    'a function that counts word frequency in a sentence',
    'a function that checks if a string is a palindrome',
    'a function that returns the nth Fibonacci number',
    'a function that flattens a nested list',
    'a function that converts Roman numerals to integers',
    'a simple queue class with enqueue and dequeue',
    'a function that finds the second largest number in a list',
    'a function that checks if two strings are anagrams',
    'a function that rotates a list by k positions',
    'a function that calculates the GCD of two numbers',
  ],
}

const BUG_TYPES = {
  easy: [
    'wrong arithmetic operator (e.g. subtraction instead of addition)',
    'wrong comparison operator (e.g. > instead of >=)',
    'off-by-one in a loop boundary',
    'misspelled variable name',
    'missing return statement',
  ],
  medium: [
    'mutating the input array instead of working on a copy',
    'wrong initial value for an accumulator variable',
    'incorrect loop condition causing early exit',
    'missing edge case handling for empty input',
    'wrong array/string method used',
  ],
  hard: [
    'subtle operator precedence issue',
    'closure capturing the wrong variable in a loop',
    'off-by-one that only fails on specific inputs',
    'incorrect recursion base case',
    'incorrect condition that fails for negative numbers',
  ],
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Anthropic API helper ──────────────────────────────────────────────────────
async function callClaude(prompt, temperature = 1) {
  // ✅ FIX 1: Guard against missing API key so you get a clear error
  // instead of a silent "Validation unavailable" failure
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'API key is missing. Add VITE_ANTHROPIC_API_KEY to your Netlify environment variables and redeploy.'
    )
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey, // ✅ use the validated variable
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
}

// ── Fallback snippets (used if API is unavailable) ────────────────────────────
const FALLBACKS = {
  javascript: [
    {
      code: `// Supposed to add two numbers and return the result
function calculateSum(a, b) {
  return a - b
}
const result = calculateSum(5, 3)
console.log(result) // Expected: 8, Actual: 2`,
      hints: [
        'Look inside the calculateSum function body.',
        'The arithmetic operator does not match what the function is supposed to do.',
        "Change '-' to '+' inside calculateSum.",
      ],
    },
    {
      code: `// Supposed to find the largest number in an array
function findMax(nums) {
  let max = 0
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) max = nums[i]
  }
  return max
}
console.log(findMax([-5, -2, -8])) // Expected: -2, Actual: 0`,
      hints: [
        'The bug relates to how max is initialised before the loop.',
        'The starting value of max will give wrong results when all numbers are negative.',
        "Change 'let max = 0' to 'let max = nums[0]'.",
      ],
    },
  ],
  react: [
    {
      code: `import React from 'react'

// Supposed to show a counter with an increment button
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count - 1)}>Increment</button>
    </div>
  )
}
export default Counter`,
      hints: [
        'There are two bugs — one in the imports, one in the button logic.',
        'useState is not imported, and the button does the opposite of what it says.',
        "Add '{ useState }' to the React import and change 'count - 1' to 'count + 1'.",
      ],
    },
  ],
  python: [
    {
      code: `# Supposed to sum all numbers in a list
def sum_list(numbers):
    total = 0
    for i in range(len(numbers) - 1):
        total += numbers[i]
    return total

print(sum_list([1, 2, 3, 4, 5]))  # Expected: 15, Actual: 10`,
      hints: [
        'The bug is in the loop that iterates over the list.',
        "The range() call doesn't cover every element.",
        "Change 'range(len(numbers) - 1)' to 'range(len(numbers))'.",
      ],
    },
    {
      code: `# Supposed to check if a word is a palindrome
def is_palindrome(word):
    reversed_word = word[::-1]
    return word == reversed_word

print(is_palindrome('Racecar'))  # Expected: True, Actual: False`,
      hints: [
        'The function almost works — think about edge cases with capitalisation.',
        'The comparison is case-sensitive, so mixed-case inputs fail.',
        "Compare lowercased versions: 'return word.lower() == reversed_word.lower()'.",
      ],
    },
  ],
}

// ── Component ─────────────────────────────────────────────────────────────────
function DebuggingPage() {
  const [brokenCode, setBrokenCode] = useState('')
  const [userCode, setUserCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hints, setHints] = useState([
    { id: 1, text: '', used: false },
    { id: 2, text: '', used: false },
    { id: 3, text: '', used: false },
  ])
  const [showHintWarning, setShowHintWarning] = useState(false)
  const [currentChoice, setCurrentChoice] = useState(null)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [usedTopics, setUsedTopics] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const choice = localStorage.getItem('debuggingChoice')
    if (choice) setCurrentChoice(JSON.parse(choice))
  }, [])

  const languageLabel = (lang) => {
    if (!lang) return ''
    return lang === 'react' ? 'React (JSX)' : lang.charAt(0).toUpperCase() + lang.slice(1)
  }

  // Pick a topic not yet used this session
  const pickFreshTopic = (language) => {
    const pool = TOPICS[language] || TOPICS.javascript
    const unused = pool.filter((t) => !usedTopics.includes(t))
    const available = unused.length > 0 ? unused : pool
    const chosen = pickRandom(available)
    setUsedTopics((prev) => [...prev.filter((t) => pool.includes(t)), chosen])
    return chosen
  }

  // ── AI: generate buggy code ─────────────────────────────────────────────────
  const generateCode = async () => {
    if (!currentChoice) {
      toast.error('Please select a language and level first.')
      return
    }

    setIsGenerating(true)
    setBrokenCode('')
    setUserCode('')
    setValidationResult(null)
    setHints([
      { id: 1, text: '', used: false },
      { id: 2, text: '', used: false },
      { id: 3, text: '', used: false },
    ])

    const { language, level } = currentChoice
    const topic = pickFreshTopic(language)
    const bugPool = BUG_TYPES[level] || BUG_TYPES.easy
    const bug1 = pickRandom(bugPool)
    const bug2 = pickRandom(bugPool.filter((b) => b !== bug1))
    const seed = Math.floor(Math.random() * 999999)

    const codePrompt = `You are a creative coding challenge generator. Random seed: ${seed}.

Write a ${languageLabel(language)} code snippet about this specific topic: "${topic}".

The code must contain EXACTLY 2 hidden bugs:
- Bug 1 type: ${bug1}
- Bug 2 type: ${bug2}

Requirements:
- Return ONLY raw code. No markdown, no backticks, no prose outside of code comments.
- Line 1 must be a comment stating what the working code is supposed to do.
- Do NOT add any comments that hint at or point to the bugs. The bugs should be hidden.
- Keep it 10–20 lines total.
- Make this scenario creative and different — avoid generic "add two numbers" examples.
- Difficulty level: ${level}. ${
      level === 'easy'
        ? 'Bugs are obvious on first read.'
        : level === 'medium'
        ? 'Bugs require understanding the logic flow.'
        : 'Bugs are subtle and require careful analysis.'
    }
${language === 'react' ? '- Use a functional React component with hooks. Include proper JSX.' : ''}
${language === 'python' ? '- Pure Python 3. No external imports.' : ''}
${language === 'javascript' ? '- Modern JS syntax (const/let, arrow functions).' : ''}`

    try {
      const generated = await callClaude(codePrompt, 1)
      setBrokenCode(generated)
      toast.success('Challenge ready! Find and fix the bugs.')
      generateHints(generated, language, level, topic) // run async, don't block
    } catch (error) {
      console.error('Code generation failed:', error)
      toast.error('AI unavailable — loaded a fallback challenge.')
      const pool = FALLBACKS[language] || FALLBACKS.javascript
      const fallback = pickRandom(pool)
      setBrokenCode(fallback.code)
      setHints(fallback.hints.map((text, i) => ({ id: i + 1, text, used: false })))
    } finally {
      setIsGenerating(false)
    }
  }

  // ── AI: generate 3 progressive hints ───────────────────────────────────────
  const generateHints = async (code, language, level, topic) => {
    const hintPrompt = `You are a patient debugging coach for a ${level}-level student.

The student is working on: "${topic}" written in ${languageLabel(language)}.
The code below contains exactly 2 bugs.

\`\`\`
${code}
\`\`\`

Write 3 hints that get progressively more specific:
- Hint 1: Mention only WHERE in the code to look (e.g. "the loop", "the return statement") — not what is wrong.
- Hint 2: Describe the TYPE of bug (e.g. "an operator is incorrect") — still no fix.
- Hint 3: State exactly what to change to fix both bugs.

Reply ONLY in this format, nothing else:
Hint 1: <text>
Hint 2: <text>
Hint 3: <text>`

    try {
      const raw = await callClaude(hintPrompt, 0.3)
      const lines = raw.split('\n').filter((l) => /^Hint \d:/i.test(l.trim()))
      if (lines.length === 3) {
        setHints(
          lines.map((line, i) => ({
            id: i + 1,
            text: line.replace(/^Hint \d:\s*/i, '').trim(),
            used: false,
          }))
        )
      }
    } catch (err) {
      console.error('Hint generation failed:', err)
    }
  }

  // ── Validate user's solution ────────────────────────────────────────────────
  const validateCode = async () => {
    if (!userCode.trim()) {
      toast.error('Please write your solution before validating!')
      return
    }
    if (!brokenCode.trim()) {
      toast.error('Please generate a challenge first!')
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    const { language } = currentChoice

    const validationPrompt = `You are an expert ${languageLabel(language)} developer evaluating a student's debugging attempt.

## Original broken code:
\`\`\`
${brokenCode}
\`\`\`

## Student's submitted fix:
\`\`\`
${userCode}
\`\`\`

## How to evaluate:

1. First, identify every logical bug in the ORIGINAL broken code.
2. Check if the student's code fixes all of those logical bugs.
3. Check the student has not introduced any NEW logical bugs.

## Judging rules (read carefully):
- Judge LOGIC and CORRECTNESS only. Ignore whitespace, comments, variable name style, code formatting.
- A fix is VALID even if the student solved it differently than you would — what matters is whether it works correctly.
- Only mark FAIL when a real logical bug from the original still exists in the student's code, OR the student introduced a new bug that breaks correctness.
- Do NOT fail the student for style, structure, or personal preference differences.
- Be fair and encouraging.

Respond with ONLY one of these two formats — no other text whatsoever:

RESULT: PASS
FEEDBACK: <one friendly sentence confirming which bugs were successfully fixed>

RESULT: FAIL
FEEDBACK: <one specific sentence naming exactly which bug is still present or was newly introduced>`

    try {
      // Use temperature 0 for deterministic, reliable grading
      const raw = await callClaude(validationPrompt, 0)
      const resultMatch = raw.match(/RESULT:\s*(PASS|FAIL)/i)
      const feedbackMatch = raw.match(/FEEDBACK:\s*(.+)/is)

      const passed = resultMatch ? resultMatch[1].toUpperCase() === 'PASS' : false
      const feedback = feedbackMatch
        ? feedbackMatch[1].trim()
        : 'Could not parse feedback — please try again.'

      setValidationResult({ passed, feedback })

      if (passed) {
        toast.success('🎉 All bugs fixed!')
        updateUserProgress()
      }
      // ✅ FIX 2: Removed the toast.error on fail — the result panel below
      // already shows the feedback clearly, no need for a duplicate toast
    } catch (error) {
      console.error('Validation failed:', error)
      // ✅ FIX 3: Show the actual error message so you know what went wrong
      // (e.g. missing API key) instead of always saying "unavailable"
      toast.error(`Validation failed: ${error.message}`)
    } finally {
      setIsValidating(false)
    }
  }

  const updateUserProgress = () => {
    const saved = localStorage.getItem('userProgress')
    const progress = saved ? JSON.parse(saved) : { javascript: 0, react: 0, python: 0 }
    const lang = currentChoice?.language
    if (lang && progress[lang] !== undefined) {
      progress[lang] = Math.min(100, (progress[lang] || 0) + 10)
    }
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }

  // ── UI helpers ──────────────────────────────────────────────────────────────
  const handleBack = () => {
    if (window.confirm('Go back to dashboard? Progress on this challenge will not be saved.')) {
      localStorage.removeItem('debuggingChoice')
      navigate('/dashboard')
    }
  }

  const handleHintClick = () => {
    if (!hints.some((h) => h.used)) {
      setShowHintWarning(true)
    } else {
      useHint()
    }
  }

  const useHint = () => {
    const availableHint = hints.find((h) => !h.used)
    if (availableHint) {
      setHints(hints.map((h) => (h.id === availableHint.id ? { ...h, used: true } : h)))
      toast(`Hint ${availableHint.id}: ${availableHint.text}`, { duration: 6000 })
    } else {
      toast.error('No more hints available!')
    }
  }

  const handleCopy = (e) => {
    e.preventDefault()
    toast.error('Copying is disabled! Please type the code manually.')
  }

  const handlePaste = (e) => {
    e.preventDefault()
    toast.error('Pasting is disabled! Please type the code manually.')
  }

  const handleLanguageSelection = (choice) => {
    setCurrentChoice(choice)
    setUsedTopics([])
    localStorage.setItem('debuggingChoice', JSON.stringify(choice))
    setShowLanguageModal(false)
    toast.success(`Selected ${choice.language.toUpperCase()} — ${choice.level.toUpperCase()}`)
  }

  const hintsUsed = hints.filter((h) => h.used).length

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="debugging-page">
      <Navbar />

      <div className="debugging-container">
        {!currentChoice ? (
          <div className="welcome-section start-screen">
            <h1>Welcome to Debugging Challenge</h1>
            <p className="modal-subtitle">
              Test your debugging skills with AI-generated code problems
            </p>
            <button className="btn-start-debugging" onClick={() => setShowLanguageModal(true)}>
              Start Debugging Challenge
            </button>
            <p className="instruction-text">
              Click above to select your language and difficulty level
            </p>
          </div>
        ) : (
          <>
            <div className="welcome-section">
              <h1>Debugging Challenge</h1>
              <p>Find and fix all the bugs in the generated code!</p>
              <div className="current-selection">
                <span className="badge">{languageLabel(currentChoice?.language)}</span>
                <span className="badge">{currentChoice?.level?.toUpperCase()}</span>
                <button
                  className="btn-change-selection"
                  onClick={() => {
                    localStorage.removeItem('debuggingChoice')
                    setCurrentChoice(null)
                    setBrokenCode('')
                    setUserCode('')
                    setValidationResult(null)
                    setUsedTopics([])
                  }}
                >
                  Change Selection
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-back" onClick={handleBack}>
                Back to Dashboard
              </button>
              <button
                className="btn-hint"
                onClick={handleHintClick}
                disabled={hintsUsed >= 3 || !brokenCode}
              >
                Hint ({3 - hintsUsed} remaining)
              </button>
            </div>

            <HintSystem
              showWarning={showHintWarning}
              onCloseWarning={() => setShowHintWarning(false)}
              onAcceptWarning={() => {
                setShowHintWarning(false)
                useHint()
              }}
              hints={hints}
            />

            <div className="code-editors-container">
              <CodeEditor
                title="🐛 Broken Code"
                code={brokenCode}
                readOnly={true}
                language={currentChoice?.language}
                button={{
                  text: isGenerating
                    ? 'Generating...'
                    : brokenCode
                    ? 'New Challenge'
                    : 'Generate Challenge',
                  onClick: generateCode,
                  color: 'blue',
                  disabled: isGenerating,
                }}
              />

              <CodeEditor
                title="✏️ Your Solution"
                code={userCode}
                onChange={setUserCode}
                readOnly={false}
                language={currentChoice?.language}
                placeholder="Type your fixed code here..."
                button={{
                  text: isValidating ? 'Checking...' : 'Validate Fix',
                  onClick: validateCode,
                  color: 'green',
                  disabled: !userCode.trim() || isValidating || !brokenCode.trim(),
                }}
                onCopy={handleCopy}
                onPaste={handlePaste}
              />
            </div>

            {/* ✅ FIX 4: Spinner is now INSIDE the currentChoice block, directly
                below the editors, so it always renders during validation */}
            {isValidating && (
              <div className="validation-overlay">
                <div className="spinner"></div>
                <p>Checking your fix...</p>
              </div>
            )}

            {/* ── Validation Result Panel ── */}
            {validationResult && (
              <div
                className={`validation-result-panel ${
                  validationResult.passed ? 'result-pass' : 'result-fail'
                }`}
              >
                <div className="result-icon">
                  {validationResult.passed ? '✅' : '❌'}
                </div>
                <div className="result-content">
                  <h3 className="result-title">
                    {validationResult.passed ? 'All Bugs Fixed! 🎉' : 'Not Quite There Yet'}
                  </h3>
                  <p className="result-feedback">{validationResult.feedback}</p>
                  {validationResult.passed ? (
                    <button className="btn-next-challenge" onClick={generateCode}>
                      Next Challenge →
                    </button>
                  ) : (
                    <button
                      className="btn-try-again"
                      onClick={() => setValidationResult(null)}
                    >
                      Keep Trying
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {showLanguageModal && (
          <LanguageLevelModal
            onComplete={handleLanguageSelection}
            onClose={() => setShowLanguageModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default DebuggingPage