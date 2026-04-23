import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth'

// Mock the firebase auth module
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signInAnonymously: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}))

// Mock our local firebase service
vi.mock('../services/firebase', () => ({
  auth: { currentUser: null }
}))

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with loading true and sets up listener', () => {
    const mockUnsubscribe = vi.fn()
    onAuthStateChanged.mockImplementation((auth, callback) => {
      // Don't call callback immediately to test initial state
      return mockUnsubscribe
    })

    const { result, unmount } = renderHook(() => useAuth())

    expect(onAuthStateChanged).toHaveBeenCalled()
    expect(result.current.loading).toBe(true)
    
    // Simulate auth state resolved
    act(() => {
      const callback = onAuthStateChanged.mock.calls[0][1]
      callback({ uid: 'user123' })
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual({ uid: 'user123' })

    // Test cleanup
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('handles Google sign in successfully', async () => {
    signInWithPopup.mockResolvedValueOnce({ user: { uid: 'user123' } })
    const { result } = renderHook(() => useAuth())
    
    let user;
    await act(async () => {
      user = await result.current.signInWithGoogle()
    })
    
    expect(signInWithPopup).toHaveBeenCalled()
    expect(user).toEqual({ uid: 'user123' })
    expect(result.current.error).toBeNull()
  })

  it('handles Google sign in error', async () => {
    const error = new Error('Popup closed')
    signInWithPopup.mockRejectedValueOnce(error)
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      try {
        await result.current.signInWithGoogle()
      } catch (e) {
        // Expected
      }
    })
    
    expect(result.current.error).toBe('Popup closed')
  })

  it('handles guest sign in successfully', async () => {
    signInAnonymously.mockResolvedValueOnce({ user: { uid: 'guest123' } })
    const { result } = renderHook(() => useAuth())
    
    let user;
    await act(async () => {
      user = await result.current.signInAsGuest()
    })
    
    expect(signInAnonymously).toHaveBeenCalled()
    expect(user).toEqual({ uid: 'guest123' })
    expect(result.current.error).toBeNull()
  })

  it('handles logout successfully', async () => {
    signOut.mockResolvedValueOnce()
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.logout()
    })
    
    expect(signOut).toHaveBeenCalled()
    expect(result.current.error).toBeNull()
  })
})
