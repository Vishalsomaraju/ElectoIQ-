# ElectoIQ — Civic Education Platform

ElectoIQ is a comprehensive civic education web application that empowers Indian voters with the knowledge they need to participate confidently in elections. Built with React + Vite + Firebase + Gemini AI.

## Problem Statement Alignment

ElectoIQ directly addresses the civic education gap in India by solving:

| Voter Pain Point | ElectoIQ Feature | Google Service Used |
|---|---|---|
| Don't know how to register | Voter Journey Wizard | Firebase Auth (saves progress) |
| Don't understand the process | Interactive Election Timeline | Firestore (real-time stage data) |
| Can't find reliable info | ElectoBot AI Assistant | Gemini 2.5 Flash (context-aware) |
| Can't test their knowledge | AI-Generated Civic Quiz | Gemini (adaptive questions) |
| Don't know election terms | Searchable Glossary | Firebase Hosting (fast delivery) |
| No progress tracking | Personal Dashboard | Firestore (persisted progress) |

## Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4
- **Backend**: Firebase Auth, Firestore, Firebase Hosting
- **AI**: Google Gemini 2.5 Flash (via `@google/generative-ai`)
- **Animation**: Framer Motion
- **Testing**: Vitest + React Testing Library (139 passing tests, 80%+ coverage targets)

## Features

- 🗺️ **Interactive Election Timeline** — 8-stage visual walkthrough of India's election process
- 🧭 **Voter Journey Wizard** — Step-by-step registration and voting guide
- 🤖 **ElectoBot AI Assistant** — Context-aware chat powered by Gemini 2.5 Flash
- 🧠 **Civic Quiz** — AI-generated questions with instant feedback
- 📖 **Searchable Glossary** — 55 election terms with category filtering
- 📊 **Personal Dashboard** — Progress tracking, milestones, and achievement badges

## Getting Started

1. Create a `.env` file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

2. Install dependencies and start the development server:
```bash
npm install
npm run dev
```

## Testing

The project has a comprehensive test suite verifying all core pages, hooks, and services with 80% line/function coverage targets and 70% branch coverage.

```bash
npm run test            # run all tests
npm run test -- --coverage # generate coverage report
```

## Build

```bash
npm run build
firebase deploy
```

## Security

- Content Security Policy enforced via `firebase.json` headers
- DOMPurify XSS sanitization on all user inputs
- API rate limiting on AI endpoints (500ms cooldown)
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`

## Google Services

ElectoIQ actively uses all 6 configured Google services:

| Service | Where it is used | What it powers |
|---|---|---|
| Firebase Authentication | Navbar sign-in and `useAuth` | Google sign-in and anonymous sessions |
| Cloud Firestore | `useFirestore`, `useFirestoreCollection`, Dashboard, Voter Journey | Progress persistence and live quiz activity |
| Firebase Hosting | `firebase.json` | SPA rewrites, security headers, cache policy |
| Gemini API | `useGemini`, quiz generation, chat drawer | ElectoBot chat and AI quiz generation |
| Firebase Performance Monitoring | `src/services/firebase.js` | Web performance instrumentation at app startup |
| Firebase Analytics | `src/services/firebase.js`, auth/chat/quiz/timeline/journey flows | Product analytics and key engagement events |
