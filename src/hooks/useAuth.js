// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { logger } from '../utils/logger'
import {
  onAuthStateChanged,
  signInWithRedirect,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
} from 'firebase/auth'
import { auth, trackAnalyticsEvent } from '../services/firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({ prompt: 'select_account' })

/**
 * Custom hook to manage Firebase authentication state.
 * @returns {Object} Authentication state and methods { user, loading, error, signInWithGoogle, signInAsGuest, logout }
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) { setError('Firebase not configured'); return }
    setError(null)
    try {
      trackAnalyticsEvent('auth_google_sign_in_started')
      await signInWithRedirect(auth, googleProvider)
    } catch (err) {
      logger.warn('[signInWithGoogle] error:', err)
      setError(err.message)
      throw err
    }
  }

  const signInAsGuest = async () => {
    if (!auth) { setError('Firebase not configured'); return }
    setError(null)
    try {
      const result = await signInAnonymously(auth)
      trackAnalyticsEvent('auth_guest_sign_in', { provider: 'anonymous' })
      return result.user
    } catch (err) {
      logger.warn('[signInAsGuest] error:', err)
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    if (!auth) return
    setError(null)
    try {
      await signOut(auth)
      trackAnalyticsEvent('auth_sign_out')
    } catch (err) {
      logger.warn('[logout] error:', err)
      setError(err.message)
      throw err
    }
  }

  return { user, loading, error, signInWithGoogle, signInAsGuest, logout }
}
