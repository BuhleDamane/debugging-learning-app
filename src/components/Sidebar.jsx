import React from 'react'
import '../styles/Sidebar.css'

function Sidebar({ progress }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Progress Tracker</h3>
      </div>
      
      <div className="progress-section">
        <div className="progress-item">
          <h4>JavaScript</h4>
          <div className="progress-bar-container">
            <div 
              className="progress-fill"
              style={{ width: `${progress.javascript}%` }}
            >
              <span>{progress.javascript}%</span>
            </div>
          </div>
        </div>
        
        <div className="progress-item">
          <h4>React</h4>
          <div className="progress-bar-container">
            <div 
              className="progress-fill"
              style={{ width: `${progress.react}%` }}
            >
              <span>{progress.react}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sidebar-stats">
        <h4>Overall Progress</h4>
        <div className="stat">
          <span className="stat-label">Completed Challenges:</span>
          <span className="stat-value">
            {Math.round((progress.javascript + progress.react) / 20)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Current Streak:</span>
          <span className="stat-value">0 days</span>
        </div>
      </div>
      
      <div className="sidebar-tips">
        <h4>Pro Tips</h4>
        <ul>
          <li>Start with easier levels</li>
          <li>Use hints sparingly</li>
          <li>Practice daily</li>
          <li>Read error messages carefully</li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar