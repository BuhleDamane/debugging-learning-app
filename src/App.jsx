import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DebuggingPage from './pages/DebuggingPage'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'  

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />  {}
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/debugging" element={<DebuggingPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App