// src/constants/index.js

export const APP_NAME = 'ElectoIQ'
export const APP_TAGLINE = 'India\'s AI-Powered Civic Education Platform'
export const APP_DESCRIPTION = 'Interactive, AI-powered civic education for every Indian voter — from registration to results, demystified.'

export const ROUTES = {
  HOME: '/',
  TIMELINE: '/timeline',
  VOTER_JOURNEY: '/voter-journey',
  QUIZ: '/quiz',
  GLOSSARY: '/glossary',
  DASHBOARD: '/dashboard',
}

export const COLLECTIONS = {
  USERS: 'users',
  QUIZ_RESULTS: 'quizResults',
}

export const QUERY_LIMITS = {
  QUIZ_HISTORY: 10,
  GLOSSARY: 100,
}

export const SUGGESTED_QUESTIONS = {
  HOME: ['What is the Model Code of Conduct?', 'How do I register to vote?', 'Explain the difference between MLA and MP.'],
  TIMELINE: ['What happens during the nomination phase?', 'When is the next election phase?', 'How are polling dates decided?'],
  VOTER_JOURNEY: ['What documents do I need to vote?', 'How to find my polling booth?', 'Can I vote if I moved to a new city?'],
  QUIZ: ['Help me understand my wrong answers', 'Generate more questions about EVMs', 'Explain the NOTA option in detail'],
  GLOSSARY: ['What is an EPIC card?', 'Explain VVPAT simply', 'What does Delimitation mean?'],
  DASHBOARD: ['How can I improve my Civic Readiness Score?', 'What badges can I earn?', 'Show me a summary of my progress'],
}
