import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ROUTE_NAMES = {
  '/': 'Home',
  '/timeline': 'Timeline',
  '/voter-journey': 'Voter Journey',
  '/quiz': 'Quiz',
  '/glossary': 'Glossary',
  '/dashboard': 'Dashboard',
}

export function RouteChangeAnnouncer() {
  const location = useLocation()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const pageName = ROUTE_NAMES[location.pathname] ?? 'Unknown'
    setAnnouncement(`Navigated to ${pageName} page`)
  }, [location])

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  )
}
