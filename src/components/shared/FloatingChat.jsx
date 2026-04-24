import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export function FloatingChat() {
  const { state, dispatch } = useAppContext()

  if (state.chatOpen) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open ElectoBot chat assistant"
      onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#FF9933] shadow-lg shadow-[#FF9933]/30 flex items-center justify-center text-white"
    >
      <div className="absolute inset-0 rounded-full animate-ping bg-[#FF9933] opacity-20" />
      <Bot size={28} />
    </motion.button>
  )
}
