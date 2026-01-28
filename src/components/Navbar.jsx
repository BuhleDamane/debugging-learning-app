import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'
import { 
  FaLaptopCode, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaBug, 
  FaSignOutAlt, 
  FaTachometerAlt,
  FaCode,
  FaTerminal,
  FaCog,
  FaBolt
} from "react-icons/fa";

function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoState, setLogoState] = useState('idle')
  const [rotation, setRotation] = useState(0)
  const [showDebug, setShowDebug] = useState(false)
  const [showMaster, setShowMaster] = useState(false)
  const [isReversed, setIsReversed] = useState(true)
  
  const navMenuRef = useRef(null)
  const hamburgerRef = useRef(null)
  const debugTextRef = useRef(null)
  const masterTextRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoState('spinning')
      
      const spinInterval = setInterval(() => {
        setRotation(prev => {
          const newRotation = prev + 20
          if (newRotation >= 1080) { 
            clearInterval(spinInterval)
            setLogoState('exploding')
            
            setTimeout(() => {
              setShowDebug(true)
              setTimeout(() => {
                setShowMaster(true)
                
                setTimeout(() => {
                  setIsReversed(false)
                  setLogoState('complete')
                }, 800)
              }, 400)
            }, 400)
          }
          return newRotation
        })
      }, 16)
      
      return () => clearInterval(spinInterval)
    }, 1000) 
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          navMenuRef.current && 
          !navMenuRef.current.contains(event.target) &&
          hamburgerRef.current && 
          !hamburgerRef.current.contains(event.target)) {
        closeMobileMenu()
      }
    }

    const handleEscapeKey = (event) => {
      if (isMobileMenuOpen && event.key === 'Escape') {
        closeMobileMenu()
      }
    }

    const handleResize = () => {
      if (isMobileMenuOpen && window.innerWidth > 768) {
        closeMobileMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
    closeMobileMenu()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.classList.toggle('menu-open')
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  const getNavLinks = () => {
    const isAuthenticated = location.pathname === '/dashboard' || location.pathname === '/debugging';
    
    if (isAuthenticated) {
      return (
        <>
          <button 
            className="nav-link" 
            onClick={() => {
              navigate('/dashboard')
              closeMobileMenu()
            }}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button 
            className="nav-link logout" 
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/')
              closeMobileMenu()
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </>
      )
    }

    return (
      <>
        <button 
          className="nav-link" 
          onClick={() => {
            navigate('/')
            closeMobileMenu()
          }}
        >
          <FaHome /> Home
        </button>
        <button 
          className="nav-link login" 
          onClick={() => {
            navigate('/debugging')
            closeMobileMenu()
          }}
        >
          <FaBug /> Get Debugging
        </button>
      </>
    )
  }

  const getLogoClass = () => {
    switch(logoState) {
      case 'spinning': return 'logo-spinning';
      case 'exploding': return 'logo-exploding';
      case 'complete': return 'logo-complete';
      default: return '';
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div 
          className={`nav-logo ${getLogoClass()}`} 
          onClick={handleHomeClick}
          style={{ '--rotation': `${rotation}deg` }}
        >
          <div className="logo-circle">
            <div className="logo-circle-inner">
              <div className="logo-circle-content">
                <div className="laptop-screen">
                  <span className="code-line line-1"><FaCode /></span>
                  <span className="code-line line-2"><FaTerminal /></span>
                  <span className="code-line line-3"><FaCog /></span>
                  <span className="code-line line-4"><FaBolt /></span>
                </div>
                <div className="laptop-base"></div>
                <div className="laptop-keyboard"></div>
              </div>
            </div>
          </div>
          
          <div className="logo-text-container">
            <span 
              ref={masterTextRef}
              className={`logo-text word-master ${showMaster ? 'visible' : ''} ${isReversed ? 'reversed' : 'correct'}`}
            >
              {isReversed ? 'retsaM' : 'Master'}
            </span>
            
            <span 
              ref={debugTextRef}
              className={`logo-text word-debug ${showDebug ? 'visible' : ''} ${isReversed ? 'reversed' : 'correct'}`}
            >
              {isReversed ? 'gubeD' : 'Debug'}
            </span>
          </div>
        </div>
        
        <div 
          ref={navMenuRef}
          className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}
          id="nav-menu"
        >
          {getNavLinks()}
        </div>

        <button 
          ref={hamburgerRef}
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-controls="nav-menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar