// src/services/firebase.js
// Firebase is lazily initialized. Only bootstraps when real env vars are present.

const FIREBASE_CONFIGURED =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key'

let _app = null
let _auth = null
let _db = null

async function initFirebase() {
  if (!FIREBASE_CONFIGURED) return
  try {
    const { initializeApp } = await import('firebase/app')
    const { getAuth } = await import('firebase/auth')
    const { getFirestore } = await import('firebase/firestore')

    _app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    })
    _auth = getAuth(_app)
    _db = getFirestore(_app)
  } catch (err) {
    console.warn('[ElectoIQ] Firebase init failed:', err.message)
  }
}

// Initialize in background — only if configured
initFirebase()

export function getFirebaseAuth() { return _auth }
export function getFirebaseDb() { return _db }
export function isFirebaseReady() { return !!_app }

export { _app as app, _auth as auth, _db as db }
