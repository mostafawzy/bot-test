import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import AuthModal from './components/AuthModal'

export default function App() {
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState(null) // store logged-in user

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    setChats([])
    setActiveChatId(null)
  }

  // ✅ Restore user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const userId = localStorage.getItem("userId")
    if (token && username && userId) {
      setUser({ username, id: userId, token })
    }
  }, [])

  // Fetch history when user changes
useEffect(() => {
  if (!user) return

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/history", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Failed to fetch chat history")

      const formattedChats = data.map(c => ({
        id: c.chat_id.toString(),
        title: c.messages?.[0]?.text?.slice(0, 30) + "..." || "New Chat",
        messages: c.messages || []
      }))

      // ✅ prepend new chat at the top
      const newChat = {
        id: Date.now().toString(),
        title: 'New chat',
        messages: [{ from: 'bot', text: "Start chatting with me to get personalized product recommendations." }]
      }

      setChats([newChat, ...formattedChats])
      setActiveChatId(newChat.id)

    } catch (err) {
      console.error("Failed to fetch chat history:", err)
      // If fetching history fails, still create a new chat
      const newChat = {
        id: Date.now(),
        title: 'New chat',
        messages: [{ from: 'bot', text: "Hi! I'm your assistant." }]
      }
      setChats([newChat])
      setActiveChatId(newChat.id)
    }
  }

  fetchHistory()
}, [user])


const handleLoginSuccess = (data) => {
  const userData = { username: data.username, id: data.user_id, token: data.access_token }
  setUser(userData)

  // Store token
  localStorage.setItem("token", data.access_token)
  localStorage.setItem("username", data.username)
  localStorage.setItem("userId", data.user_id)

  setShowAuthModal(false)

  // ✅ Create a new chat immediately, like pressing "New Chat"
  addNewChat(userData)
}

const addNewChat = (currentUser = user) => {
  if (!currentUser) {
    setShowAuthModal(true)
    return
  }

   const id = Date.now().toString() 
  const newChat = {
    id,
    title: 'New chat',
    messages: [{ from: 'bot', text: "Start chatting with me to get personalized product recommendations." }]
  }

  setChats(prev => [newChat, ...prev])
  setActiveChatId(id)
}

  const updateChatMessages = (chatId, newMessagesOrFn) => {
    setChats(prevChats => prevChats.map(c => {
      if (c.id !== chatId) return c
      const messages = typeof newMessagesOrFn === 'function'
        ? newMessagesOrFn(c.messages)
        : newMessagesOrFn
      return { ...c, messages }
    }))
  }

 // ✅ Inside App.jsx



  return (
    <div className="h-screen flex bg-[#F8FAF9]">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={addNewChat}
        onSelectChat={setActiveChatId}
        collapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        onLoginClick={() => setShowAuthModal(true)}
        user={user}
        onLogout={handleLogout}
      />

      <ChatWindow
        chats={chats}
        activeChatId={activeChatId}
        updateChatMessages={updateChatMessages}
        user={user}
        setShowAuthModal={setShowAuthModal}
      />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}
