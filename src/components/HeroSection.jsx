import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/HeroSection.css'

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="hero-section">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Master the Art of <span className="highlight">Debugging</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Practice debugging skills with AI-generated challenges. Learn JavaScript and React through hands-on problem solving.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/debugging')}
            >
              Start Debugging Now
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/login')}
            >
              Sign Up Free
            </button>
          </motion.div>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Challenges</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="code-preview">
            <div className="code-header">
              <div className="code-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="code-title">debugging-challenge.js</span>
            </div>
            <div className="code-body">
              <pre>
{`function calculateSum(a, b) {
  return a - b  // 🐛 Bug here!
}

const result = calculateSum(5, 3)
console.log(result) 
// Expected: 8
// Actual: 2

// Can you fix it?`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection