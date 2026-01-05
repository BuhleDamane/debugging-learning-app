import React from 'react'
import '../styles/CodeEditor.css'

function CodeEditor({ 
  title, 
  code, 
  onChange, 
  readOnly, 
  language, 
  button, 
  onCopy, 
  onPaste 
}) {
  const handleChange = (e) => {
    if (!readOnly && onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="code-editor">
      <div className="editor-header">
        <h4>{title}</h4>
        <div className="editor-actions">
          <span className="language-badge">{language || 'javascript'}</span>
          <button 
            className={`btn-generate ${button.color}`}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.text}
          </button>
        </div>
      </div>
      
      <textarea
        className="code-textarea"
        value={code}
        onChange={handleChange}
        readOnly={readOnly}
        onCopy={onCopy}
        onPaste={onPaste}
        spellCheck="false"
        style={{ 
          cursor: readOnly ? 'not-allowed' : 'text',
          backgroundColor: readOnly ? '#f5f5f5' : 'white'
        }}
      />
      
      <div className="editor-footer">
        <span className="line-count">
          Lines: {code.split('\n').length}
        </span>
        <span className="char-count">
          Characters: {code.length}
        </span>
      </div>
    </div>
  )
}

export default CodeEditor