// ─── Google Service: Firebase (Auth + Firestore) ─────────────────────────
// Purpose: Auth (Google OAuth + Anonymous) and real-time Firestore data
// SDK: firebase ^12.12.1
// Docs: https://firebase.google.com/docs
// src/services/firebase.js

import { initializeApp } from 'firebase/app'
import { logger } from '../utils/logger'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getPerformance } from 'firebase/performance'
import { getAnalytics, logEvent } from 'firebase/analytics'

const FIREBASE_CONFIGURED =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key'

let app = null
let auth = null
let db = null
let perf = null
let analytics = null

if (FIREBASE_CONFIGURED) {
  try {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    })
    auth = getAuth(app)
    db = getFirestore(app)
    try {
      enableIndexedDbPersistence(db).catch(err => {
        logger.warn('[ElectoIQ] Persistence unavailable:', err.message)
      })
    } catch (e) {}
    try {
      perf = getPerformance(app)
    } catch (err) {
      logger.warn('[ElectoIQ] Performance monitoring unavailable:', err.message)
    }
    try {
      analytics = getAnalytics(app)
      logEvent(analytics, 'app_open', { platform: 'web' })
    } catch (err) {
      logger.warn('[ElectoIQ] Analytics unavailable:', err.message)
    }
  } catch (err) {
    const msg = err instanceof Error
      ? err.message.replace(/key=[^&\s]*/g, 'key=REDACTED')
      : 'Firebase init failed'
    logger.warn('[ElectoIQ] Firebase init failed:', msg)
  }
}

export function getFirebaseAuth() { return auth }
export function getFirebaseDb() { return db }
export function getFirebasePerformance() { return perf }
export function isFirebaseReady() { return !!app }

export { app, auth, db, perf, analytics }
