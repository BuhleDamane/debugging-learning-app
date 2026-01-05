import React, { useState } from 'react'
import '../styles/HintSystem.css'

function HintSystem({ showWarning, onCloseWarning, onAcceptWarning, hints }) {
  const [currentHint, setCurrentHint] = useState(null)

  const availableHint = hints.find(h => !h.used)

  return (
    <>
      {showWarning && (
        <div className="modal-overlay">
          <div className="warning-modal">
            <h3>⚠️ Hint Usage Warning</h3>
            <p>You only receive three hints per challenge. Use them wisely!</p>
            <div className="warning-buttons">
              <button className="btn-cancel" onClick={onCloseWarning}>
                Cancel
              </button>
              <button className="btn-understood" onClick={onAcceptWarning}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
      
      {currentHint && (
        <div className="modal-overlay">
          <div className="hint-modal">
            <h3>Hint {currentHint.id}</h3>
            <div className="hint-content">
              <p>{currentHint.text}</p>
            </div>
            <button 
              className="btn-okay"
              onClick={() => setCurrentHint(null)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default HintSystem