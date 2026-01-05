import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={handleHomeClick}>
          <span className="logo-icon">🐛</span>
          <span className="logo-text">DebugMaster</span>
        </div>
        
        <div className="nav-links">
          {location.pathname === '/dashboard' ? (
            <>
              <button className="nav-link" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="nav-link logout" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : location.pathname === '/debugging' ? (
            <>
              <button className="nav-link" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="nav-link logout" onClick={() => navigate('/')}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => navigate('/')}>
                Home
              </button>
              <button className="nav-link" onClick={() => navigate('/debugging')}>
                Get Debugging
              </button>
              <button className="nav-link login" onClick={() => navigate('/login')}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar