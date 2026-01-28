import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCheckCircle,
  FaUser,
  FaUserAlt,
  FaAt,
  FaComment,
  FaExclamationCircle
} from 'react-icons/fa'
import '../styles/Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const subjects = [
    'General Inquiry',
    'Technical Support',
    'Bug Report',
    'Feature Request',
    'Partnership',
    'Other'
  ]

  const socialLinks = [
    { icon: <FaFacebookF />, name: 'Facebook', url: 'https://facebook.com', color: '#1877F2' },
    { icon: <FaTwitter />, name: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com', color: '#E4405F' },
    { icon: <FaLinkedinIn />, name: 'LinkedIn', url: 'https://linkedin.com', color: '#0A66C2' }
  ]

  const contactInfo = [
    { icon: <FaEnvelope />, title: 'Email', info: 'support@debugmaster.com', action: 'mailto:support@debugmaster.com' },
    { icon: <FaPhone />, title: 'Phone', info: '+27 (0)23 123 4567', action: 'tel:+27231234567' },
    { icon: <FaMapMarkerAlt />, title: 'Location', info: 'Gauteng, South Africa', action: 'https://maps.google.com' },
    { icon: <FaClock />, title: 'Hours', info: 'Mon-Fri: 9AM-6PM PST', action: null }
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'message') {
      setCharCount(value.length)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    setIsSubmitting(true)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setCharCount(0)
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 2000)
  }

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="contact-page">
      {}
      <section className="contact-hero">
        <div className="container">
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
              Get In <span className="highlight">Touch</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Have questions about DebugMaster? We're here to help. Reach out to us anytime.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {}
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
              
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      <FaUser className="input-icon" /> First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.firstName}
                      </span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">
                      <FaUserAlt className="input-icon" /> Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">
                    <FaAt className="input-icon" /> Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <span className="error-message">
                      <FaExclamationCircle /> {errors.email}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">
                    <FaPhone className="input-icon" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number (optional)"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? 'error' : ''}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <span className="error-message">
                      <FaExclamationCircle /> {errors.subject}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">
                    <FaComment className="input-icon" /> Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                    placeholder="Tell us how we can help you..."
                    rows="6"
                    maxLength="1000"
                  />
                  <div className="message-footer">
                    <div className="char-count">
                      {charCount}/1000 characters
                    </div>
                    {errors.message && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.message}
                      </span>
                    )}
                  </div>
                </div>
                
                {}
                <div className="social-contact-section">
                  <div className="social-contact-divider">
                    <span>OR</span>
                  </div>
                  <p className="social-contact-text">
                    Prefer not to fill out the form? Contact me directly through social media:
                  </p>
                  <div className="social-icons-container">
                    {socialLinks.map((social, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        className="social-contact-btn"
                        style={{ '--social-color': social.color }}
                        onClick={() => handleSocialClick(social.url)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Contact via ${social.name}`}
                      >
                        {social.icon}
                        <span className="social-tooltip">{social.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
                
                {isSubmitted && (
                  <motion.div 
                    className="success-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaCheckCircle />
                    <div>
                      <h4>Message Sent Successfully!</h4>
                      <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
            
            {}
            <motion.div 
              className="contact-info-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="info-card">
                <h3>Contact Information</h3>
                <p className="info-description">
                  Feel free to reach out to us through any of the following channels. 
                  We're always happy to help with your debugging journey!
                </p>
                
                <div className="info-items">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="info-item">
                      <div className="info-icon-wrapper">
                        {info.icon}
                      </div>
                      <div className="info-content">
                        <h4>{info.title}</h4>
                        {info.action ? (
                          <a 
                            href={info.action} 
                            target={info.action.startsWith('http') ? '_blank' : '_self'}
                            rel={info.action.startsWith('http') ? 'noopener noreferrer' : ''}
                            className="info-link"
                          >
                            {info.info}
                          </a>
                        ) : (
                          <p>{info.info}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="response-time">
                  <h4>Average Response Time</h4>
                  <div className="time-indicators">
                    <div className="time-indicator">
                      <span className="time-label">Email</span>
                      <span className="time-value">24 hours</span>
                    </div>
                    <div className="time-indicator">
                      <span className="time-label">Social Media</span>
                      <span className="time-value">2-4 hours</span>
                    </div>
                  </div>
                </div>
                
                <div className="emergency-note">
                  <FaExclamationCircle />
                  <p>
                    For urgent technical issues, please mention "URGENT" in your message 
                    or contact us through social media for faster response.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="contact-faq">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </motion.div>
          
          <div className="faq-grid">
            {[
              {
                question: "How quickly do you respond to messages?",
                answer: "We typically respond within 24 hours for emails and 2-4 hours for social media messages. Urgent issues marked with 'URGENT' get priority response."
              },
              {
                question: "What information should I include in my message?",
                answer: "Please include your debugging challenge details, code snippets, expected vs actual behavior, and any error messages you're receiving."
              },
              {
                question: "Do you offer debugging support for all programming languages?",
                answer: "We specialize in JavaScript, React, and related web technologies. For other languages, we'll do our best to help or refer you to appropriate resources."
              },
              {
                question: "Is there a fee for debugging assistance?",
                answer: "Basic debugging questions are free. For complex issues requiring extensive time, we may offer paid consultation services with your consent."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
              >
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact