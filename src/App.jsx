// src/App.jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Spinner } from './components/ui/Spinner'
import { ChatDrawer } from './components/shared/ChatDrawer'
import { FloatingChat } from './components/shared/FloatingChat'
import { ErrorBoundary } from './components/shared/ErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const Timeline = lazy(() => import('./pages/Timeline'))
const VoterJourney = lazy(() => import('./pages/VoterJourney'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Glossary = lazy(() => import('./pages/Glossary'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/voter-journey" element={<VoterJourney />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-1 outline-none">
                <AnimatedRoutes />
              </main>
              <Footer />
              <FloatingChat />
              <ChatDrawer />
            </div>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
