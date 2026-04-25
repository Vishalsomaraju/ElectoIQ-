import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock services
vi.mock('../services/gemini', () => ({
  sendMessageStream: vi.fn(async function* () {
    yield { text: 'test response' }
  }),
}))

vi.mock('../services/firebase', () => ({
  loginWithGoogle: vi.fn(),
  logoutUser: vi.fn(),
  auth: {}, // Mock auth object
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: class {
    addScope() {}
    setCustomParameters() {}
  },
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb({ uid: '123', displayName: 'Test User' })
    return () => {}
  }),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  setDoc: vi.fn(),
}))

describe('Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tests useGemini hook', async () => {
    const { useGemini } = await import('../hooks/useGemini')
    const { result } = renderHook(() => useGemini())
    
    expect(result.current.messages).toEqual([])
    expect(result.current.streaming).toBe(false)
    expect(result.current.error).toBe(null)

    await act(async () => {
      await result.current.sendMessage('Hello AI')
    })
    
    expect(result.current.messages.length).toBeGreaterThan(0)

    act(() => {
      result.current.clearChat()
    })

    expect(result.current.messages).toEqual([])
  })

  it('tests useAuth hook', async () => {
    const { useAuth } = await import('../hooks/useAuth')
    const { result } = renderHook(() => useAuth())
    
    // Check initial state
    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeTruthy()
  })
})
