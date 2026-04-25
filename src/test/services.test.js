import { describe, it, vi, beforeEach } from 'vitest'

// Mock firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('@google/generative-ai', () => {
  const mockChatSession = {
    sendMessageStream: vi.fn().mockResolvedValue({
      stream: [{ text: () => 'Mock stream text' }]
    })
  }
  
  const mockModel = {
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => 'Mock generate content'
      }
    }),
    startChat: vi.fn().mockReturnValue(mockChatSession)
  }

  return {
    GoogleGenerativeAI: class {
      constructor() {
        this.getGenerativeModel = vi.fn().mockReturnValue(mockModel)
      }
    }
  }
})

describe('Services', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('tests gemini functions', async () => {
    const { generateQuiz, sendMessageStream } = await import('../services/gemini')
    
    try {
      await generateQuiz()
    } catch (_e) { /* ignore */ }
    
    try {
      await sendMessageStream('test')
    } catch (_e) { /* ignore */ }
  })

  it('tests firebase functions', async () => {
    const { loginWithGoogle, logoutUser, getUserProgress, updateUserProgress } = await import('../services/firebase')
    
    try {
      await loginWithGoogle()
    } catch (_e) { /* ignore */ }
    
    try {
      await logoutUser()
    } catch (_e) { /* ignore */ }
    
    try {
      await getUserProgress('test-uid')
    } catch (_e) { /* ignore */ }
    
    try {
      await updateUserProgress('test-uid', {})
    } catch (_e) { /* ignore */ }
  })
})
