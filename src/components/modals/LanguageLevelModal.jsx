import React, { useState } from 'react'
import '../../styles/Modals.css'

function LanguageLevelModal({ onComplete }) {
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('')

  const languages = ['javascript', 'react']
  const levels = [
    { value: 'easy', label: 'Easy', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'orange' },
    { value: 'hard', label: 'Hard', color: 'red' }
  ]

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
    setStep(2)
  }

  const handleLevelSelect = (lvl) => {
    setLevel(lvl)
    onComplete({ language, level: lvl })
  }

  return (
    <div className="modal-overlay">
      <div className="language-modal">
        {step === 1 && (
          <>
            <h2>Choose Debugging Language</h2>
            <p className="modal-subtitle">Select your preferred programming language</p>
            <div className="language-options">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className="language-option"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <span className="language-icon">
                    {lang === 'javascript' ? '🟨' : '⚛️'}
                  </span>
                  <span className="language-name">{lang.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Select Difficulty Level</h2>
            <p className="modal-subtitle">Choose a challenge level for {language.toUpperCase()}</p>
            <div className="level-options">
              {levels.map((lvl) => (
                <button
                  key={lvl.value}
                  className={`level-option ${lvl.color}`}
                  onClick={() => handleLevelSelect(lvl.value)}
                >
                  <span className="level-icon">
                    {lvl.value === 'easy' && '😊'}
                    {lvl.value === 'medium' && '🤔'}
                    {lvl.value === 'hard' && '🔥'}
                  </span>
                  <span className="level-name">{lvl.label}</span>
                </button>
              ))}
            </div>
            <button 
              className="btn-back-step"
              onClick={() => setStep(1)}
            >
              Back to Language Selection
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default LanguageLevelModal