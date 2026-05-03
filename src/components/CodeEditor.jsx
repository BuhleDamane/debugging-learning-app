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
  onPaste,
  placeholder,
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
        placeholder={placeholder || ''}
        style={{
          cursor: readOnly ? 'not-allowed' : 'text',
        }}
      />

      <div className="editor-footer">
        <span className="line-count">
          Lines: {code ? code.split('\n').length : 1}
        </span>
        <span className="char-count">
          Characters: {code ? code.length : 0}
        </span>
      </div>
    </div>
  )
}

export default CodeEditor