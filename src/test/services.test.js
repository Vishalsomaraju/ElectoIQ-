import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockInitializeApp = vi.fn(() => ({ name: 'electoiq-app' }))
const mockGetAuth = vi.fn(() => ({ currentUser: null }))
const mockInitializeFirestore = vi.fn(() => ({ type: 'firestore' }))
const mockPersistentLocalCache = vi.fn(() => ({ type: 'localCache' }))
const mockPersistentMultipleTabManager = vi.fn(() => ({ type: 'tabManager' }))
const mockInitializeAppCheck = vi.fn(() => ({ type: 'appCheck' }))
const mockReCaptchaV3Provider = vi.fn()
const mockGetPerformance = vi.fn(() => ({ type: 'performance' }))
const mockGetAnalytics = vi.fn(() => ({ type: 'analytics' }))
const mockLogEvent = vi.fn()
const mockStartChat = vi.fn()
const mockGenerateContent = vi.fn()
const mockGetGenerativeModel = vi.fn(() => ({
  startChat: mockStartChat,
  generateContent: mockGenerateContent,
}))

vi.mock('firebase/app', () => ({
  initializeApp: mockInitializeApp,
}))

vi.mock('firebase/auth', () => ({
  getAuth: mockGetAuth,
}))

vi.mock('firebase/firestore', () => ({
  initializeFirestore: mockInitializeFirestore,
  persistentLocalCache: mockPersistentLocalCache,
  persistentMultipleTabManager: mockPersistentMultipleTabManager,
}))

vi.mock('firebase/app-check', () => ({
  initializeAppCheck: mockInitializeAppCheck,
  ReCaptchaV3Provider: mockReCaptchaV3Provider,
}))

vi.mock('firebase/performance', () => ({
  getPerformance: mockGetPerformance,
}))

vi.mock('firebase/analytics', () => ({
  getAnalytics: mockGetAnalytics,
  logEvent: mockLogEvent,
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class MockGoogleGenerativeAI {
    getGenerativeModel(...args) {
      return mockGetGenerativeModel(...args)
    }
  },
}))

describe('service modules', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'firebase-api-key')
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'electoiq.firebaseapp.com')
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'electoiq')
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'electoiq.appspot.com')
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '123456789')
    vi.stubEnv('VITE_FIREBASE_APP_ID', '1:123456789:web:abc123')
    vi.stubEnv('VITE_GEMINI_KEY', 'gemini-key')
    vi.stubEnv('VITE_RECAPTCHA_SITE_KEY', 'recaptcha-key')
  })

  it('initializes all Firebase services and logs app_open', async () => {
    const firebaseService = await import('../services/firebase')

    expect(mockInitializeApp).toHaveBeenCalledTimes(1)
    expect(mockGetAuth).toHaveBeenCalled()
    expect(mockInitializeFirestore).toHaveBeenCalled()
    expect(mockPersistentLocalCache).toHaveBeenCalled()
    expect(mockPersistentMultipleTabManager).toHaveBeenCalled()
    expect(mockInitializeAppCheck).toHaveBeenCalled()
    expect(mockReCaptchaV3Provider).toHaveBeenCalledWith('recaptcha-key')
    expect(mockGetPerformance).toHaveBeenCalled()
    expect(mockGetAnalytics).toHaveBeenCalled()
    expect(mockLogEvent).toHaveBeenCalledWith(
      firebaseService.analytics,
      'app_open',
      { platform: 'web' }
    )
    expect(firebaseService.isFirebaseReady()).toBe(true)
  })

  it('sanitizes analytics events before logging', async () => {
    const { trackAnalyticsEvent } = await import('../services/firebase')

    const success = trackAnalyticsEvent('chat-drawer opened!', {
      page: '<b>quiz</b>',
      step: 2,
      nested: { stage: 'Voting' },
    })

    expect(success).toBe(true)
    expect(mockLogEvent).toHaveBeenLastCalledWith(
      { type: 'analytics' },
      'chat_drawer_opened_',
      {
        page: 'quiz',
        step: 2,
        nested: '',
      }
    )
  })

  it('configures the Gemini model with the documented model name', async () => {
    const { getChatModel } = await import('../services/gemini')

    getChatModel()

    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.5-flash' })
    )
  })
})
