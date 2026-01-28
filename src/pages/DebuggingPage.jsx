import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import HintSystem from '../components/HintSystem'
import LanguageLevelModal from '../components/modals/LanguageLevelModal'
import '../styles/DebuggingPage.css'

function DebuggingPage() {
  const [brokenCode, setBrokenCode] = useState('// Code will be generated here...')
  const [userCode, setUserCode] = useState('// Fix the broken code here...')
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hints, setHints] = useState([])
  const [showHintWarning, setShowHintWarning] = useState(false)
  const [currentChoice, setCurrentChoice] = useState(null)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const choice = localStorage.getItem('debuggingChoice')
    if (choice) {
      setCurrentChoice(JSON.parse(choice))
    }
    
    setHints([
      { id: 1, text: '', used: false },
      { id: 2, text: '', used: false },
      { id: 3, text: '', used: false }
    ])
  }, [])

  const handleLanguageSelection = (choice) => {
    setCurrentChoice(choice)
    localStorage.setItem('debuggingChoice', JSON.stringify(choice))
    setShowLanguageModal(false)
    toast.success(`Selected ${choice.language.toUpperCase()} - ${choice.level.toUpperCase()}`)
  }

  const generateCode = async () => {
    if (!currentChoice) {
      toast.error('Please select a language and level first')
      return
    }

    setIsGenerating(true)
    
    try {
      const HF_API_TOKEN = 'YOUR_HUGGING_FACE_TOKEN_HERE'
      
      if (HF_API_TOKEN === 'YOUR_HUGGING_FACE_TOKEN_HERE') {
        toast.error('Please add your Hugging Face token! It\'s FREE - get it at huggingface.co/settings/tokens')
        setIsGenerating(false)
        return
      }

      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/Phi-3.5-mini-instruct',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Generate a ${currentChoice.language || 'JavaScript'} code snippet with 2-3 intentional bugs for ${currentChoice.level || 'beginner'} level debugging practice. Include comments explaining what the code should do. Make the bugs realistic. Only return the code, no explanations. Keep it under 15 lines.`,
            parameters: {
              max_new_tokens: 250,
              temperature: 0.7,
              return_full_text: false
            }
          })
        }
      )
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data && data[0] && data[0].generated_text) {
        const generatedCode = data[0].generated_text.trim()
        setBrokenCode(generatedCode)
        toast.success('Code generated successfully!')
        
        await generateHints(generatedCode)
      } else {
        throw new Error('Unexpected API response format')
      }
    } catch (error) {
      console.error('Error generating code:', error)
      toast.error(`Failed to generate code: ${error.message}`)
      
      const fallbackCode = currentChoice.language === 'react' 
        ? `import React from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count - 1)}>Increment</button>
    </div>
  )
}

export default Counter`
        : `function calculateSum(a, b) {
  return a - b
}

const result = calculateSum(5, 3)
console.log(result) // Expected: 8, Actual: 2`

      setBrokenCode(fallbackCode)
      
      const fallbackHints = currentChoice.language === 'react'
        ? [
            { id: 1, text: "Check if all required React hooks are properly imported", used: false },
            { id: 2, text: "Look at the button's onClick handler - does it match the button label?", used: false },
            { id: 3, text: "Add 'import { useState } from \"react\"' and change count - 1 to count + 1", used: false }
          ]
        : [
            { id: 1, text: "There's an arithmetic operation issue in the calculateSum function", used: false },
            { id: 2, text: "The operator used is incorrect for addition", used: false },
            { id: 3, text: "Change the '-' operator to '+' in the calculateSum function", used: false }
          ]
      
      setHints(fallbackHints)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateHints = async (code) => {
    try {
      const HF_API_TOKEN = 'YOUR_HUGGING_FACE_TOKEN_HERE'
      
      if (HF_API_TOKEN === 'YOUR_HUGGING_FACE_TOKEN_HERE') {
        return
      }

      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/Phi-3.5-mini-instruct',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `For this buggy code:\n${code}\n\nGenerate exactly 3 progressive debugging hints in this format:\nHint 1: [vague hint about general area]\nHint 2: [more specific hint]\nHint 3: [specific solution]\n\nOnly return the hints, nothing else.`,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.5,
              return_full_text: false
            }
          })
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const hintsText = data[0].generated_text
        
        const hintLines = hintsText.split('\n').filter(line => line.trim().startsWith('Hint'))
        const parsedHints = hintLines.slice(0, 3).map((line, index) => ({
          id: index + 1,
          text: line.replace(/^Hint \d+:\s*/, ''),
          used: false
        }))
        
        if (parsedHints.length === 3) {
          setHints(parsedHints)
        }
      }
    } catch (error) {
      console.error('Error generating hints:', error)
    }
  }

  const validateCode = () => {
    setIsValidating(true)
    
    setTimeout(() => {
      if (userCode !== '// Fix the broken code here...') {
        setShowConfetti(true)
        toast.success('Congratulations! Code validated successfully!')
        
        updateUserProgress()
        
        setTimeout(() => {
          setShowConfetti(false)
          const goNext = window.confirm('Great job! Would you like to try another challenge?')
          if (goNext) {
            navigate('/dashboard')
          }
        }, 3000)
      } else {
        toast.error('Please write some code before validating!')
      }
      
      setIsValidating(false)
    }, 1000)
  }

  const updateUserProgress = () => {
    const savedProgress = localStorage.getItem('userProgress')
    const progress = savedProgress ? JSON.parse(savedProgress) : { javascript: 0, react: 0 }
    
    if (currentChoice?.language === 'javascript') {
      progress.javascript = Math.min(100, progress.javascript + 10)
    } else if (currentChoice?.language === 'react') {
      progress.react = Math.min(100, progress.react + 10)
    }
    
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }

  const handleBack = () => {
    if (window.confirm('Are you sure you want to go back? Your current progress will not be saved.')) {
      localStorage.removeItem('debuggingChoice')
      navigate('/dashboard')
    }
  }

  const handleHintClick = () => {
    if (!hints.some(h => h.used)) {
      setShowHintWarning(true)
    } else {
      useHint()
    }
  }

  const useHint = () => {
    const availableHint = hints.find(h => !h.used)
    if (availableHint) {
      const updatedHints = hints.map(h => 
        h.id === availableHint.id ? { ...h, used: true } : h
      )
      setHints(updatedHints)
      toast(`Hint ${availableHint.id}: ${availableHint.text}`, { duration: 6000 })
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

  const handleStartDebugging = () => {
    setShowLanguageModal(true)
  }

  return (
    <div className="debugging-page">
      <Navbar />
      
      <div className="debugging-container">
        {!currentChoice ? (
          <div className="welcome-section start-screen">
            <h1>Welcome to Debugging Challenge</h1>
            <p className="modal-subtitle">Test your debugging skills with real-world code problems</p>
            
          
            
            <button 
              className="btn-start-debugging"
              onClick={handleStartDebugging}
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
              <h1>Welcome User</h1>
              <p>Are you ready to master debugging?</p>
              <div className="current-selection">
                <span className="badge">{currentChoice?.language?.toUpperCase()}</span>
                <span className="badge">{currentChoice?.level?.toUpperCase()}</span>
                <button 
                  className="btn-change-selection"
                  onClick={() => {
                    localStorage.removeItem('debuggingChoice')
                    setCurrentChoice(null)
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
                disabled={hints.filter(h => h.used).length >= 3}
              >
                Hint ({3 - hints.filter(h => h.used).length} remaining)
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
                title="Broken Code"
                code={brokenCode}
                readOnly={true}
                language={currentChoice?.language}
                button={{
                  text: isGenerating ? 'Generating...' : 'Generate Code',
                  onClick: generateCode,
                  color: 'blue',
                  disabled: isGenerating
                }}
              />
              
              <CodeEditor
                title="Your Solution"
                code={userCode}
                onChange={setUserCode}
                readOnly={false}
                language={currentChoice?.language}
                button={{
                  text: isValidating ? 'Validating...' : 'Validate Code',
                  onClick: validateCode,
                  color: 'green',
                  disabled: userCode === '// Fix the broken code here...' || isValidating
                }}
                onCopy={handleCopy}
                onPaste={handlePaste}
              />
            </div>
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