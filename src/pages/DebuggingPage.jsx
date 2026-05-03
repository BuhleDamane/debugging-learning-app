import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import HintSystem from '../components/HintSystem'
import LanguageLevelModal from '../components/modals/LanguageLevelModal'
import '../styles/DebuggingPage.css'

// ── Anthropic API helper ──────────────────────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
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

// ── Language-specific fallback snippets ───────────────────────────────────────
const FALLBACKS = {
  javascript: {
    code: `// Bug: Wrong operator used — should add, not subtract
function calculateSum(a, b) {
  return a - b
}

const result = calculateSum(5, 3)
console.log(result) // Expected: 8, Actual: 2`,
    hints: [
      'There is an arithmetic issue inside calculateSum.',
      'The operator used is not the right one for addition.',
      "Change '-' to '+' inside calculateSum to fix the bug.",
    ],
  },
  react: {
    code: `import React from 'react'

// Bug 1: useState is not imported
// Bug 2: onClick decrements instead of incrementing
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
      'Check whether all required React hooks are imported.',
      "Look at the button label vs what the onClick actually does — do they match?",
      "Add '{ useState }' to the React import and change 'count - 1' to 'count + 1'.",
    ],
  },
  python: {
    code: `# Bug: range() stops before the last number, so the last item is skipped
def sum_list(numbers):
    total = 0
    for i in range(len(numbers) - 1):  # off-by-one error
        total += numbers[i]
    return total

numbers = [1, 2, 3, 4, 5]
print(sum_list(numbers))  # Expected: 15, Actual: 10`,
    hints: [
      'There is an issue with the loop bounds in sum_list.',
      'The range() call does not cover all elements of the list.',
      "Change 'range(len(numbers) - 1)' to 'range(len(numbers))' to iterate over every item.",
    ],
  },
}

// ── Component ─────────────────────────────────────────────────────────────────
function DebuggingPage() {
  const [brokenCode, setBrokenCode] = useState('')
  const [userCode, setUserCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hints, setHints] = useState([
    { id: 1, text: '', used: false },
    { id: 2, text: '', used: false },
    { id: 3, text: '', used: false },
  ])
  const [showHintWarning, setShowHintWarning] = useState(false)
  const [currentChoice, setCurrentChoice] = useState(null)
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  // Validation result state
  const [validationResult, setValidationResult] = useState(null) // null | { passed: bool, feedback: string }

  const navigate = useNavigate()

  useEffect(() => {
    const choice = localStorage.getItem('debuggingChoice')
    if (choice) setCurrentChoice(JSON.parse(choice))
  }, [])

  // ── Language display label ──────────────────────────────────────────────────
  const languageLabel = (lang) => {
    if (!lang) return ''
    return lang === 'react' ? 'React (JSX)' : lang.charAt(0).toUpperCase() + lang.slice(1)
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

    const codePrompt = `You are a coding challenge generator for a debugging practice app.

Generate a ${languageLabel(language)} code snippet with exactly 2–3 intentional bugs suitable for a ${level} difficulty level.

Rules:
- Return ONLY the raw code — no markdown, no backticks, no explanations.
- Add a short comment at the very top describing what the code is SUPPOSED to do.
- Bugs should be realistic and varied (e.g. wrong operator, missing import, off-by-one, wrong variable name, logic error).
- Keep it under 20 lines.
- For "easy": simple, very obvious bugs like a wrong operator or typo. For "medium": subtler bugs like wrong condition or missing return. For "hard": tricky logic bugs that require careful reading.
${language === 'react' ? '- Use functional components with hooks.' : ''}
${language === 'python' ? '- Use standard Python 3 syntax only.' : ''}`

    try {
      const generated = await callClaude(codePrompt)
      setBrokenCode(generated)
      toast.success('Code generated! Find and fix the bugs.')
      await generateHints(generated, language, level)
    } catch (error) {
      console.error('Code generation failed:', error)
      toast.error('AI unavailable — loaded a fallback challenge.')
      const fallback = FALLBACKS[language] || FALLBACKS.javascript
      setBrokenCode(fallback.code)
      setHints(
        fallback.hints.map((text, i) => ({ id: i + 1, text, used: false }))
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // ── AI: generate 3 progressive hints ───────────────────────────────────────
  const generateHints = async (code, language, level) => {
    const hintPrompt = `You are a debugging coach.

Given this buggy ${languageLabel(language)} code:
\`\`\`
${code}
\`\`\`

Generate exactly 3 progressive hints for a ${level} level student.
- Hint 1: Vague — point to the general area of the problem without naming it.
- Hint 2: More specific — describe the type of bug without giving the fix.
- Hint 3: Direct — explain exactly what to change.

Respond with ONLY this format and nothing else:
Hint 1: <text>
Hint 2: <text>
Hint 3: <text>`

    try {
      const raw = await callClaude(hintPrompt)
      const lines = raw.split('\n').filter((l) => /^Hint \d:/.test(l.trim()))
      if (lines.length === 3) {
        setHints(
          lines.map((line, i) => ({
            id: i + 1,
            text: line.replace(/^Hint \d:\s*/, '').trim(),
            used: false,
          }))
        )
      }
    } catch (error) {
      console.error('Hint generation failed:', error)
    }
  }

  // ── Validate user's solution using Claude ───────────────────────────────────
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

    const { language, level } = currentChoice

    const validationPrompt = `You are a strict code review assistant for a debugging practice app.

The student was given this BROKEN ${languageLabel(language)} code to fix:
\`\`\`
${brokenCode}
\`\`\`

The student submitted this as their fix:
\`\`\`
${userCode}
\`\`\`

Your job:
1. Identify all the bugs in the original broken code.
2. Check if the student's submission actually fixes ALL of those bugs correctly.
3. Ignore cosmetic differences (whitespace, comments, variable naming style) — focus only on whether the logic bugs are fixed.

Respond with ONLY this exact format and nothing else:
RESULT: PASS or FAIL
FEEDBACK: <one or two sentences explaining what was correct, and if FAIL, what bug(s) are still present or were introduced>`

    try {
      const raw = await callClaude(validationPrompt)
      const resultMatch = raw.match(/RESULT:\s*(PASS|FAIL)/i)
      const feedbackMatch = raw.match(/FEEDBACK:\s*(.+)/is)

      const passed = resultMatch ? resultMatch[1].toUpperCase() === 'PASS' : false
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : raw

      setValidationResult({ passed, feedback })

      if (passed) {
        setShowConfetti(true)
        toast.success('🎉 Correct! All bugs fixed!')
        updateUserProgress()
        setTimeout(() => {
          setShowConfetti(false)
        }, 3000)
      } else {
        toast.error('Not quite — check the feedback below.')
      }
    } catch (error) {
      console.error('Validation failed:', error)
      toast.error('Could not validate — AI unavailable. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const updateUserProgress = () => {
    const saved = localStorage.getItem('userProgress')
    const progress = saved
      ? JSON.parse(saved)
      : { javascript: 0, react: 0, python: 0 }

    const lang = currentChoice?.language
    if (lang && progress[lang] !== undefined) {
      progress[lang] = Math.min(100, (progress[lang] || 0) + 10)
    }

    localStorage.setItem('userProgress', JSON.stringify(progress))
  }

  // ── Navigation / UI helpers ─────────────────────────────────────────────────
  const handleBack = () => {
    if (window.confirm('Are you sure you want to go back? Your current progress will not be saved.')) {
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
            <button
              className="btn-start-debugging"
              onClick={() => setShowLanguageModal(true)}
            >
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
                disabled={hintsUsed >= 3}
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
                  text: isGenerating ? 'Generating...' : brokenCode ? 'Regenerate' : 'Generate Code',
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
                  text: isValidating ? 'Validating...' : 'Validate Code',
                  onClick: validateCode,
                  color: 'green',
                  disabled: !userCode.trim() || isValidating || !brokenCode.trim(),
                }}
                onCopy={handleCopy}
                onPaste={handlePaste}
              />
            </div>

            {/* ── Validation Result Panel ── */}
            {validationResult && (
              <div className={`validation-result-panel ${validationResult.passed ? 'result-pass' : 'result-fail'}`}>
                <div className="result-icon">
                  {validationResult.passed ? '✅' : '❌'}
                </div>
                <div className="result-content">
                  <h3 className="result-title">
                    {validationResult.passed ? 'All Bugs Fixed!' : 'Not Quite There Yet'}
                  </h3>
                  <p className="result-feedback">{validationResult.feedback}</p>
                  {validationResult.passed && (
                    <button
                      className="btn-next-challenge"
                      onClick={() => navigate('/dashboard')}
                    >
                      Try Another Challenge →
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {isValidating && (
          <div className="validation-overlay">
            <div className="spinner"></div>
            <p>Validating your code...</p>
          </div>
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