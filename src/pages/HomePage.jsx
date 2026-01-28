import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import '../styles/HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <div className="cta-section">
        <h2>Start Your Debugging Journey</h2>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Get Debugging
          </button>
          <button className="btn-secondary" onClick={() => navigate('/contact')}>
           contact Us
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage