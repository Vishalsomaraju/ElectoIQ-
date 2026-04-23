// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
} from 'firebase/auth'
import { auth } from '../services/firebase'

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
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (err) {
      console.warn('[signInWithGoogle] error:', err)
      setError(err.message)
      throw err
    }
  }

  const signInAsGuest = async () => {
    if (!auth) { setError('Firebase not configured'); return }
    setError(null)
    try {
      const result = await signInAnonymously(auth)
      return result.user
    } catch (err) {
      console.warn('[signInAsGuest] error:', err)
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    if (!auth) return
    setError(null)
    try {
      await signOut(auth)
    } catch (err) {
      console.warn('[logout] error:', err)
      setError(err.message)
      throw err
    }
  }

  return { user, loading, error, signInWithGoogle, signInAsGuest, logout }
}
