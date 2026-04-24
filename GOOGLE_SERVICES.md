# Google Services — ElectoIQ

ElectoIQ integrates multiple Google services to deliver a real-time, AI-powered Indian election education platform.

---

## 1. Firebase Authentication

- **Package**: `firebase/auth`
- **Files**: `src/services/firebase.js`, `src/hooks/useAuth.js`, `src/context/AuthContext.jsx`
- **Usage**: Anonymous sign-in for public users (no friction), Google OAuth for registered learners. OAuth configured with `email` and `profile` scopes, with `prompt: 'select_account'` to force account selection.
- **Docs**: https://firebase.google.com/docs/auth

---

## 2. Cloud Firestore

- **Package**: `firebase/firestore`
- **Files**: `src/services/firebase.js`, `src/hooks/useFirestore.js`
- **Usage**: Stores and syncs user progress data (quiz scores, completed milestones) with auth guards on all write operations. Queries use `limit()` to avoid unbounded fetches. Security rules enforce `deny-all` fallback.
- **Docs**: https://firebase.google.com/docs/firestore

---

## 3. Firebase Hosting

- **Config**: `firebase.json`, `firestore.rules`, `firestore.indexes.json`
- **Usage**: SPA deployment with client-side routing rewrites (`**` → `/index.html`). Firestore rules and indexes co-deployed.
- **Docs**: https://firebase.google.com/docs/hosting

---

## 4. Gemini AI (Generative Language API)

- **Package**: `@google/generative-ai ^0.24.1`
- **Files**: `src/services/gemini.js`, `src/hooks/useGemini.js`
- **Model**: `gemini-1.5-flash`
- **Usage**: Conversational AI assistant for Indian election education. Uses multi-turn streaming chat sessions. System prompt restricts responses to election domain. User input is sanitized via `sanitizeInput()` before any API call.
- **Docs**: https://ai.google.dev/docs

---

## 5. Firebase Performance Monitoring

- **Package**: `firebase/performance`
- **Files**: `src/services/firebase.js`
- **Usage**: Tracks page load and API response times in production, with a guarded fallback when performance monitoring is unavailable in the current runtime.
- **Docs**: https://firebase.google.com/docs/perf-mon

---

## Environment Variables Required

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_KEY=
```
