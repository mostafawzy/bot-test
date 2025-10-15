import React, { useRef, useEffect, useState } from 'react'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ chats, activeChatId, updateChatMessages, user, setShowAuthModal }) {
  const scrollRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)
  const [defaultChat, setDefaultChat] = useState({ messages: [], title: "Welcome" })

  //  Default system messages for guests
  const defaultMessages = [
    "Welcome! Start chatting with me to get personalized product recommendations.",
    "I can help you find top products based on your preferences.",
    "Looking for the best deals? Just ask me!"
  ]

  //  Auto-scroll whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [defaultChat.messages, chats, activeChatId])

  // Handle logged-out users with default welcome chat
  useEffect(() => {
    if (user) return // skip if logged in

    // Clear default chat messages and reset typing
    setIsTyping(false)
    setDefaultChat({ messages: [], title: "Welcome" })

    let i = 0
    // show first welcome message immediately
    setDefaultChat(prev => ({
      ...prev,
      messages: [{ from: "bot", text: defaultMessages[0] }]
    }))
    i++

    // show the rest one by one
    const interval = setInterval(() => {
      setDefaultChat(prev => ({
        ...prev,
        messages: [...prev.messages, { from: "bot", text: defaultMessages[i] }]
      }))
      i++
      if (i >= defaultMessages.length) clearInterval(interval)
    }, 1200)

    return () => clearInterval(interval)
  }, [user]) // ← triggers when user logs out

  // Determine what to render
  const activeChat = user
    ? chats.find(c => c.id === activeChatId) || { messages: [] }
    : defaultChat

  // Send message handler
  const sendMessage = async (message) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const currentMessages = activeChat.messages || []
    updateChatMessages(activeChatId, [
      ...currentMessages,
      { from: "user", text: message }
    ])
    setIsTyping(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message, chat_id: activeChatId }),
      })

      if (!res.ok) throw new Error("Failed to send message")
      const data = await res.json()

      updateChatMessages(activeChatId, [
        ...currentMessages,
        { from: "user", text: message },
        { from: "bot", text: data.response }
      ])
    } catch (err) {
      console.error("Send message failed:", err)
      updateChatMessages(activeChatId, [
        ...currentMessages,
        { from: "user", text: message },
        { from: "bot", text: "⚠️ Sorry, something went wrong." }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Handle logout: clear messages visually
  useEffect(() => {
    if (!user) {
      // clear user-specific messages immediately
      updateChatMessages(null, [])
    }
  }, [user])

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#F8FAF9] to-[#E9F0F1] transition-all">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {activeChat.messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-[#C4DADE]/50 px-4 py-2 rounded-full animate-pulse text-[#1F3634] text-sm shadow-sm">
              Typing...
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="p-4">
          <ChatInput onSend={sendMessage} />
        </div>
      )}
    </div>
  )
}
