# Google Services — ElectoIQ

ElectoIQ integrates **6 Google Cloud services** to deliver a real-time,
AI-powered Indian civic education platform.

## 1. Firebase Authentication
- **Package**: `firebase/auth`
- **Files**: `src/services/firebase.js`, `src/hooks/useAuth.js`, `src/context/AuthContext.jsx`
- **Usage**: Anonymous sign-in for public users (zero friction), Google OAuth for registered learners with `email` and `profile` scopes. Auth guards on all Firestore reads and writes that touch user-owned data.
- **Docs**: https://firebase.google.com/docs/auth

## 2. Cloud Firestore (Real-time)
- **Package**: `firebase/firestore`
- **Files**: `src/hooks/useFirestoreCollection.js`, `src/hooks/useFirestore.js`, `src/pages/Dashboard.jsx`, `src/pages/VoterJourney.jsx`
- **Usage**: Real-time data synchronization via `onSnapshot` listeners in `useFirestoreCollection`, surfaced on the Dashboard's live quiz activity panel. User progress (quiz scores, journey completion) is persisted and synced. Queries use `limit()` on subscriptions. Composite indexes are defined in `firestore.indexes.json`.
- **Docs**: https://firebase.google.com/docs/firestore

## 3. Firebase Hosting
- **Config**: `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc`
- **Usage**: SPA deployment with client-side routing rewrites. Security headers configured: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, CSP. Static asset cache headers are long-lived, while `index.html` and `sw.js` are `no-cache` for safe deploy rollouts.
- **Docs**: https://firebase.google.com/docs/hosting

## 4. Gemini AI (Generative Language API)
- **Package**: `@google/generative-ai ^0.24.1`
- **Files**: `src/services/gemini.js`, `src/hooks/useGemini.js`
- **Model**: `gemini-2.5-flash`
- **Usage**: Multi-turn streaming chat sessions and AI quiz generation. System prompt restricts responses to the Indian election domain. Current route context is injected into chat prompts so ElectoBot knows what the user is reading. User input is sanitized via DOMPurify before any API call. Requests are rate-limited with a 500ms cooldown.
- **Docs**: https://ai.google.dev/docs

## 5. Firebase Performance Monitoring
- **Package**: `firebase/performance`
- **Files**: `src/services/firebase.js`
- **Usage**: Automatic page load and API response time tracking in production. Initialized with `getPerformance(app)` on app start.
- **Docs**: https://firebase.google.com/docs/perf-mon

## 6. Firebase Analytics
- **Package**: `firebase/analytics`
- **Files**: `src/services/firebase.js`
- **Usage**: Tracks `app_open` on load plus explicit product events across auth, chat, quiz, timeline, and voter journey flows. Helps identify which election topics resonate most with users.
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
