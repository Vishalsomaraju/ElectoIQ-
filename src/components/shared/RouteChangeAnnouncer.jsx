import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteChangeAnnouncer() {
  const location = useLocation()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.slice(1).replace('-', ' ')
    setAnnouncement(`Navigated to ${pageName} page`)
  }, [location])

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  )
}
