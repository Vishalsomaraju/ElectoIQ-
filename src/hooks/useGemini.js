// src/hooks/useGemini.js
import { useState, useRef, useCallback } from 'react'
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

  const sendMessage = useCallback(async (userText, context = {}) => {
    const trimmed = userText?.trim()
    if (!trimmed || streaming) return

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

      // Build context-aware prompt prefix
      const contextPrefix = context.currentStage
        ? `[User is viewing: ${context.currentStage}] `
        : context.currentPage
        ? `[User is on the ${context.currentPage} page] `
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
      console.warn('[useGemini] Error:', msg)
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
