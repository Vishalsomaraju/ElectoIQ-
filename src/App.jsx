// src/App.jsx
import { lazy, Suspense, useState, useEffect } from 'react'
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
import { RouteChangeAnnouncer } from './components/shared/RouteChangeAnnouncer'
import { RouteStateSync } from './components/shared/RouteStateSync'

const Home = lazy(() => import('./pages/Home'))
const Timeline = lazy(() => import('./pages/Timeline'))
const VoterJourney = lazy(() => import('./pages/VoterJourney'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Glossary = lazy(() => import('./pages/Glossary'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

const pageNames = {
  '/': 'Home — ElectoIQ',
  '/timeline': 'Election Timeline — ElectoIQ',
  '/voter-journey': 'Voter Journey — ElectoIQ',
  '/quiz': 'Civic Quiz — ElectoIQ',
  '/glossary': 'Glossary — ElectoIQ',
  '/dashboard': 'Dashboard — ElectoIQ',
}

function RouteAnnouncer() {
  const { pathname } = useLocation()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const name = pageNames[pathname] ?? 'ElectoIQ'
    setAnnouncement('')
    const t = setTimeout(() => setAnnouncement(`Navigated to ${name}`), 100)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <RouteAnnouncer />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/voter-journey" element={<VoterJourney />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RouteChangeAnnouncer />
        <AuthProvider>
          <AppProvider>
            <RouteStateSync />
            <div className="min-h-screen flex flex-col">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600">
                Skip to main content
              </a>
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
