import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Loader2 } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { useGemini } from '../../hooks/useGemini'

export function ChatDrawer() {
  const { state, dispatch } = useAppContext()
  const { messages, sendMessage, isLoading, error } = useGemini()
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // Optional: Focus input when chat opens
  useEffect(() => {
    if (state.chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300)
    }
  }, [state.chatOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputRef.current?.value.trim() && !isLoading) {
      sendMessage(inputRef.current.value, {
        currentPage: state.currentPage,
        currentStage: state.chatContext?.stageName
      })
      inputRef.current.value = ''
    }
  }

  const handleSuggestionClick = (suggestion) => {
    if (isLoading) return
    sendMessage(suggestion, {
      currentPage: state.currentPage,
      currentStage: state.chatContext?.stageName
    })
  }

  const closeDrawer = () => {
    dispatch({ type: 'TOGGLE_CHAT', payload: false })
  }

  return (
    <AnimatePresence>
      {state.chatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-[#0f172a] border-l border-white/10 z-[100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">ElectoBot</h3>
                  <p className="text-xs text-white/50">Your AI Election Guide</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Context Banner */}
            {state.chatContext && (
              <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2">
                <p className="text-xs text-blue-300">
                  <span className="font-semibold">Context:</span> Viewing "{state.chatContext.stageName}"
                </p>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50 space-y-4">
                  <Bot size={48} className="text-white/20" />
                  <p>Ask me anything about Indian elections, voter rights, or how to register!</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-[#FF9933] to-[#138808]'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white/10 text-white/90 rounded-tl-sm'
                  }`}>
                    {msg.content}
                    {msg.streaming && <span className="ml-1 animate-pulse inline-block w-2 h-4 bg-white/50 align-middle"></span>}
                  </div>
                </div>
              ))}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center">
                  ElectoBot is taking a break. Try again in a moment 🔄
                </div>
              )}
              
              <div ref={bottomRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0f172a] border-t border-white/10">
              {/* Suggested Questions */}
              {state.suggestedQuestions?.length > 0 && messages.length === 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {state.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(q)}
                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-3 py-1.5 rounded-full transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <input
                  ref={inputRef}
                  disabled={isLoading}
                  type="text"
                  placeholder="Ask ElectoBot..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
