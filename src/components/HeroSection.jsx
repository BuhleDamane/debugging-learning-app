import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import '../styles/HeroSection.css'

function Counter({ value, suffix = "", duration = 800 }) { 
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = parseInt(value)
      if (start === end) return

      let startTime = null
      const animationDuration = duration
      
      const animateCount = (currentTime) => {
        if (!startTime) startTime = currentTime
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / animationDuration, 1)
        

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(easeOutQuart * end)
        
        setCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      
      const animationId = requestAnimationFrame(animateCount)
      
      return () => cancelAnimationFrame(animationId)
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="stat-number">
      {count}{suffix}
    </span>
  )
}

function HeroSection() {
  const navigate = useNavigate()
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })

  const handleSignUpClick = () => {
    navigate('/login', { state: { showSignup: true } })
  }

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
              onClick={handleSignUpClick}
            >
              Start Debugging for Free
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </button>
          </motion.div>
          
          <div ref={statsRef} className="hero-stats">
            <motion.div 
              className="stat"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Counter value={1000} suffix="+" duration={800} /> {}
              <span className="stat-label">Challenges</span>
            </motion.div>
            <motion.div 
              className="stat"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Counter value={500} suffix="+" duration={800} /> {}
              <span className="stat-label">Active Users</span>
            </motion.div>
            <motion.div 
              className="stat"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Counter value={95} suffix="%" duration={600} /> {}
              <span className="stat-label">Success Rate</span>
            </motion.div>
          </div>
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