// src/hooks/useGemini.js
import { useState, useRef, useCallback } from 'react'
import { logger } from '../utils/logger'
import { sendMessageStream } from '../services/gemini'
import { sanitizeInput } from '../utils/helpers'

/**
 * Hook for conversational Gemini AI interaction with streaming support.
 * @returns {{ messages: Array, streaming: boolean, error: string|null, sendMessage: Function, clearChat: Function }}
 */
export function useGemini() {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const historyRef = useRef([])
  const lastSendRef = useRef(0)
  const COOLDOWN_MS = 500

  const sendMessage = useCallback(async (userText, context = {}) => {
    const trimmed = userText?.trim()
    if (!trimmed || streaming) return

    // Rate limiting — minimum 500ms between sends to prevent API abuse
    const now = Date.now()
    if (now - lastSendRef.current < COOLDOWN_MS) return
    lastSendRef.current = now

    setError(null)

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }
    const assistantMsg = {
      id: `assistant-${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      streaming: true,
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    try {
      // Build Gemini-compatible history from previous turns
      const geminiHistory = historyRef.current.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      // Build context-aware prompt prefix — sanitize context values to prevent prompt injection
      const safeStage = context.currentStage ? sanitizeInput(String(context.currentStage)).slice(0, 80) : ''
      const safePage = context.currentPage ? sanitizeInput(String(context.currentPage)).slice(0, 40) : ''
      const contextPrefix = safeStage
        ? `[User is viewing: ${safeStage}] `
        : safePage
        ? `[User is on the ${safePage} page] `
        : ''

      const fullMessage = contextPrefix + sanitizeInput(trimmed)

      let fullText = ''
      await sendMessageStream(fullMessage, geminiHistory, (_chunk, accumulated) => {
        fullText = accumulated
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: accumulated } : m
          )
        )
      })

      // Update persistent history with the actual user text (no prefix)
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: trimmed },
        { role: 'assistant', content: fullText },
      ]

      // Mark streaming done
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsg.id ? { ...m, streaming: false } : m
        )
      )
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message.replace(/key=[^&\s]*/g, 'key=REDACTED')
          : 'Failed to get a response. Please try again.'
      logger.warn('[useGemini] Error:', msg)
      setError(msg)
      // Remove the empty assistant bubble on error
      setMessages(prev => prev.filter(m => m.id !== assistantMsg.id))
    } finally {
      setStreaming(false)
    }
  }, [streaming])

  const clearChat = useCallback(() => {
    setMessages([])
    historyRef.current = []
    setError(null)
  }, [])

  return { messages, streaming, error, sendMessage, clearChat }
}
