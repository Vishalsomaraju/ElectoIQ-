// src/hooks/useGemini.js
import { useState, useRef, useCallback } from 'react'
import { sendMessageStream } from '../services/gemini'

/**
 * Hook for interacting with Gemini AI in a conversational manner.
 * Supports streaming responses and maintains chat history.
 */
export function useGemini() {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const historyRef = useRef([])

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || streaming) return

    setError(null)

    const userMsg = { role: 'user', content: userText, id: Date.now() }
    const assistantMsg = { role: 'assistant', content: '', id: Date.now() + 1, streaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    try {
      // Build Gemini-compatible history from previous turns
      const geminiHistory = historyRef.current.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      let fullText = ''
      await sendMessageStream(userText, geminiHistory, (_chunk, accumulated) => {
        fullText = accumulated
        setMessages(prev =>
          prev.map(m => m.id === assistantMsg.id ? { ...m, content: accumulated } : m)
        )
      })

      // Update persistent history
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: userText },
        { role: 'assistant', content: fullText },
      ]

      setMessages(prev =>
        prev.map(m => m.id === assistantMsg.id ? { ...m, streaming: false } : m)
      )
    } catch (err) {
      const msg = err instanceof Error
        ? err.message.replace(/key=[^&\s]*/g, 'key=REDACTED')
        : 'Failed to get response'
      console.warn('[useGemini] Gemini AI error:', msg)
      setError(msg)
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
