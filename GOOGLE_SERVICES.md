# Google Services — ElectoIQ

ElectoIQ integrates **6 Google Cloud services** to deliver a real-time,
AI-powered Indian civic education platform.

## 1. Firebase Authentication
- **Package**: `firebase/auth`
- **Files**: `src/services/firebase.js`, `src/hooks/useAuth.js`, `src/context/AuthContext.jsx`
- **Usage**: Anonymous sign-in for public users (zero friction), Google OAuth for registered learners with `email` and `profile` scopes. Auth guards on all Firestore write operations.
- **Docs**: https://firebase.google.com/docs/auth

## 2. Cloud Firestore (Real-time)
- **Package**: `firebase/firestore`
- **Files**: `src/hooks/useFirestoreCollection.js`, `src/hooks/useFirestore.js`
- **Usage**: Real-time data synchronization via `onSnapshot` listeners in `useFirestoreCollection`. User progress (quiz scores, journey completion) persisted and synced. Queries use `limit()` on all subscriptions. Composite indexes defined in `firestore.indexes.json`.
- **Docs**: https://firebase.google.com/docs/firestore

## 3. Firebase Hosting
- **Config**: `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc`
- **Usage**: SPA deployment with client-side routing rewrites. Security headers configured: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, CSP. Static asset cache headers set to 1 year.
- **Docs**: https://firebase.google.com/docs/hosting

## 4. Gemini AI (Generative Language API)
- **Package**: `@google/generative-ai ^0.24.1`
- **Files**: `src/services/gemini.js`, `src/hooks/useGemini.js`
- **Model**: `gemini-2.5-flash`
- **Usage**: Multi-turn streaming chat sessions. System prompt restricts responses to Indian election domain. Current page context injected into every prompt so ElectoBot knows what the user is reading. User input sanitized via DOMPurify before any API call. Rate-limited to 500ms cooldown between sends.
- **Docs**: https://ai.google.dev/docs

## 5. Firebase Performance Monitoring
- **Package**: `firebase/performance`
- **Files**: `src/services/firebase.js`
- **Usage**: Automatic page load and API response time tracking in production. Initialized with `getPerformance(app)` on app start.
- **Docs**: https://firebase.google.com/docs/perf-mon

## 6. Firebase Analytics
- **Package**: `firebase/analytics`
- **Files**: `src/services/firebase.js`
- **Usage**: Tracks `app_open` event on load and key civic engagement
  interactions. Helps identify which election topics resonate most with users.
- **Docs**: https://firebase.google.com/docs/analytics

---

## Environment Variables

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_KEY=
