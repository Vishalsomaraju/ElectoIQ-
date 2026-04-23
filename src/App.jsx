// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import Home from './pages/Home'
import Timeline from './pages/Timeline'
import VoterJourney from './pages/VoterJourney'
import Quiz from './pages/Quiz'
import Glossary from './pages/Glossary'
import Dashboard from './pages/Dashboard'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/voter-journey" element={<VoterJourney />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
