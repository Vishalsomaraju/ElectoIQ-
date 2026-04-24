// ─── Google Service: Gemini AI (Generative Language API) ─────────────────────
// Purpose: Conversational AI assistant for Indian election education
// SDK: @google/generative-ai ^0.24.1
// Docs: https://ai.google.dev/docs
import { GoogleGenerativeAI } from '@google/generative-ai'
import { sanitizeInput } from '../utils/helpers'

const API_KEY = import.meta.env.VITE_GEMINI_KEY

if (!API_KEY || API_KEY === 'your_key_here') {
  console.warn(
    '%c[ElectoIQ] ⚠️ VITE_GEMINI_KEY is not set or is a placeholder. ' +
    'AI features will not work. Add your key to .env file.',
    'color: orange; font-weight: bold'
  )
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

const SYSTEM_PROMPT = `You are ElectoIQ Assistant, an expert guide on Indian elections and the democratic process. 
Your role is to educate Indian voters about:
- The election process (from Model Code of Conduct to result declaration)
- Voter rights and responsibilities
- How to verify voter ID and find polling booths
- Understanding EVM (Electronic Voting Machines)
- Key election terminology (ECI, MCC, NOTA, affidavit, etc.)
- Historic Indian elections and statistics

Keep answers concise, factual, and encouraging for first-time voters.
Always respond in a friendly, accessible tone.
If asked about political parties or candidates, remain strictly neutral.`

/**
 * Get a streaming chat model instance
 * @returns {import('@google/generative-ai').GenerativeModel | null}
 */
export function getChatModel() {
  if (!genAI) return null
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })
}

/**
 * Start a new chat session
 * @param {Array} history - prior message history
 */
export function startChatSession(history = []) {
  const model = getChatModel()
  if (!model) return null
  return model.startChat({ history })
}

/**
 * Send a single message and get full response (non-streaming)
 * @param {string} message
 * @param {Array} history
 */
export async function sendMessage(message, history = []) {
  const model = getChatModel()
  if (!model) throw new Error('Gemini API key not configured')

  const safeMessage = sanitizeInput(message)
  const chat = model.startChat({ history })
  const result = await chat.sendMessage(safeMessage)
  return result.response.text()
}

/**
 * Send a message and stream the response
 * @param {string} message
 * @param {Array} history
 * @param {function} onChunk - callback for each text chunk
 */
export async function sendMessageStream(message, history = [], onChunk) {
  const model = getChatModel()
  if (!model) throw new Error('Gemini API key not configured')

  const safeMessage = sanitizeInput(message)
  const chat = model.startChat({ history })
  const result = await chat.sendMessageStream(safeMessage)

  let fullText = ''
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    fullText += chunkText
    if (onChunk) onChunk(chunkText, fullText)
  }
  return fullText
}
