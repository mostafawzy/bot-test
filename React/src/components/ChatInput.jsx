import React, { useState } from 'react'
import { FiSend, FiMic } from 'react-icons/fi'

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Ask about products, orders, or promotions..."
          className="w-full resize-none rounded-full border border-[#C4DADE]/60 p-3 focus:outline-none focus:ring-2 focus:ring-[#C4DADE] transition placeholder:text-gray-400 bg-white/70"
        />
      </div>
      <button
        className="p-3 rounded-full hover:bg-[#C4DADE]/30 text-[#1F3634] transition"
        aria-label="voice"
      >
        <FiMic />
      </button>
      <button
        onClick={handleSend}
        className="p-3 rounded-full bg-[#C4DADE] hover:bg-[#b3cfd4] text-[#1F3634] shadow-sm transition"
        aria-label="send"
      >
        <FiSend />
      </button>
    </div>
  )
}
