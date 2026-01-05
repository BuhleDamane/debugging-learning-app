import React from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaBrain, FaChartLine, FaLightbulb, FaRocket, FaTrophy } from 'react-icons/fa'
import '../styles/FeaturesSection.css'

function FeaturesSection() {
  const features = [
    {
      icon: <FaCode />,
      title: 'AI-Generated Challenges',
      description: 'Practice with dynamically generated broken code tailored to your skill level.',
      color: '#667eea'
    },
    {
      icon: <FaBrain />,
      title: 'Smart Learning Path',
      description: 'Adaptive difficulty system that grows with your debugging expertise.',
      color: '#f59e0b'
    },
    {
      icon: <FaLightbulb />,
      title: 'Intelligent Hints',
      description: 'Get contextual hints when you need them without giving away the solution.',
      color: '#10b981'
    },
    {
      icon: <FaChartLine />,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and completion rates.',
      color: '#3b82f6'
    },
    {
      icon: <FaRocket />,
      title: 'Real-time Validation',
      description: 'Instant feedback on your solutions with detailed error explanations.',
      color: '#8b5cf6'
    },
    {
      icon: <FaTrophy />,
      title: 'Achievement System',
      description: 'Earn badges and unlock new challenges as you master debugging skills.',
      color: '#ec4899'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="features-section">
      <div className="features-container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="features-title">Why Choose DebugMaster?</h2>
          <p className="features-subtitle">
            Everything you need to become a debugging expert
          </p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div 
                className="feature-icon"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="features-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3>Ready to Level Up Your Debugging Skills?</h3>
          <p>Join thousands of developers mastering the art of debugging</p>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection