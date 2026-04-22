// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Vote, Sparkles } from 'lucide-react'
import { cn } from '../../utils/helpers'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/voter-journey', label: 'Voter Journey' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'glass border-b border-white/10 py-3' : 'py-5',
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative size-9 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform">
            <Vote size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Electo<span className="text-gradient">IQ</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.to
                  ? 'bg-blue-600/25 text-blue-300'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* AI Chat button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/quiz"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a56db] hover:bg-[#1e429f] text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-900/30"
          >
            <Sparkles size={14} />
            Ask AI
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.to
                      ? 'bg-blue-600/25 text-blue-300'
                      : 'text-white/70 hover:text-white hover:bg-white/10',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
