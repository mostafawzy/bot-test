import React from 'react'
import { motion } from 'framer-motion'

export default function MessageBubble({ message }) {
  const isUser = message.from === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-lg px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-[#C4DADE] text-[#1F3634] rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-[#C4DADE]/40'
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  )
}
