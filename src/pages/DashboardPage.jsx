import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import LanguageLevelModal from '../components/modals/LanguageLevelModal'
import '../styles/DashboardPage.css'
import { useAuth } from '../context/AuthContext'

function formatName(rawName) {
  if (!rawName) return 'User'
  
  return rawName
    .replace(/[.,]/g, '')           
    .split(' ')
    .filter(Boolean)
    .map(word => {
     
      return word
        .toLowerCase()
        .replace(/^[a-z']/, (char) => char.toUpperCase())
    })
    .join(' ')
}

function DashboardPage() {
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [userProgress, setUserProgress] = useState({
    javascript: 0,
    react: 0
  })
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const displayName = formatName(currentUser?.displayName)
  const firstName = displayName.split(' ')[0]

  useEffect(() => {
    const hasChosen = localStorage.getItem('debuggingChoice')
    if (!hasChosen) {
      setShowLanguageModal(true)
    }
    
    const savedProgress = localStorage.getItem('userProgress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('debuggingChoice')
    localStorage.removeItem('userProgress')
    navigate('/')
  }

  const handleStartDebugging = () => {
    setShowLanguageModal(true)
  }

  const handleChoiceComplete = (choice) => {
    setShowLanguageModal(false)
    localStorage.setItem('debuggingChoice', JSON.stringify(choice))
    navigate('/debugging')
  }

  const handleCloseModal = () => {
    setShowLanguageModal(false)
  }

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />
      <div className="dashboard-container">
        <Sidebar progress={userProgress} />
        
        <main className="dashboard-main">
          <div className="welcome-section">
            <h1>Welcome, <span className="highlight">{firstName}</span> 👋</h1>
            <p>Are you ready to master debugging?</p>
          </div>
          
          <div className="dashboard-content">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>JavaScript Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${userProgress.javascript}%` }}
                  >
                    {userProgress.javascript}%
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <h3>React Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${userProgress.react}%` }}
                  >
                    {userProgress.react}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="action-section">
              <button 
                className="btn-start"
                onClick={handleStartDebugging}
              >
                Start Debugging Session
              </button>
              
              <div className="quick-stats">
                <h4>Recent Activity</h4>
                <p>Complete challenges to see your activity here</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {showLanguageModal && (
        <LanguageLevelModal 
          onComplete={handleChoiceComplete} 
          onClose={handleCloseModal}  
        />
      )}
    </div>
  )
}

export default DashboardPage