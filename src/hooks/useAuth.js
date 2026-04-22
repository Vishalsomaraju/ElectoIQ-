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

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signInAsGuest = async () => {
    setError(null)
    try {
      const result = await signInAnonymously(auth)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await signOut(auth)
    } catch (err) {
      setError(err.message)
    }
  }

  return { user, loading, error, signInWithGoogle, signInAsGuest, logout }
}
