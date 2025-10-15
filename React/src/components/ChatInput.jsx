import React, { useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

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
    <div className="flex items-center gap-3 max-w-4xl mx-auto mb-6"> {/* wider + bottom margin */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}  
        placeholder="Ask about products, orders, or promotions..."
        className="flex-1 resize-none rounded-2xl border border-[#C4DADE]/60 px-5 py-4 
                   focus:outline-none focus:ring-2 focus:ring-[#C4DADE] 
                   transition placeholder:text-gray-400 bg-white/60 text-base 
                   backdrop-blur-sm shadow-sm leading-relaxed"
      />

      <button
        onClick={handleSend}
        className="p-4 rounded-full bg-[#C4DADE] hover:bg-[#b3cfd4] text-[#1F3634] shadow-md transition"
        aria-label="send"
      >
        <FiArrowUp size={20} />
      </button>
    </div>
  )
}
