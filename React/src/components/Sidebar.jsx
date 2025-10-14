import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiChevronsLeft, FiChevronsRight, FiLogIn } from 'react-icons/fi'

export default function Sidebar({ 
  chats,           // ✅ receive chats from App
  activeChatId, 
  onSelectChat, 
  collapsed, 
  toggleCollapse, 
  onLoginClick, 
  onNewChat, 
  user, 
  onLogout 
}) {
  return (
    <motion.aside
      initial={{ width: collapsed ? 60 : 288 }}
      animate={{ width: collapsed ? 60 : 288 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-[#F8FAF9]/80 backdrop-blur border-r border-[#C4DADE]/40 flex flex-col shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-[#C4DADE]/40 flex items-center justify-between bg-[#F8FAF9]/70 backdrop-blur sticky top-0 z-10">
        {!collapsed ? (
          <>
            <h1 className="font-bold text-lg text-[#3B5F5C]">E-Shop Assistant</h1>
            <div className="flex gap-2">
              <button
                onClick={onNewChat}
                className="p-2 rounded-full bg-[#C4DADE] text-[#1F3634] hover:bg-[#b3cfd4] hover:shadow transition"
              >
                <FiPlus size={18} />
              </button>
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-full bg-[#C4DADE] text-[#1F3634] hover:bg-[#b3cfd4] hover:shadow transition"
              >
                <FiChevronsLeft size={18} />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-full bg-[#C4DADE] text-[#1F3634] hover:bg-[#b3cfd4] hover:shadow transition"
          >
            <FiChevronsRight size={20} />
          </button>
        )}
      </div>

      {/* Chat list */}
      <div className={`flex-1 p-4 space-y-2 overflow-y-auto ${collapsed ? 'hidden' : 'block'}`}>
        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left p-3 rounded-lg transition ${
              chat.id === activeChatId
                ? 'bg-[#C4DADE]/40 text-[#1F3634] font-medium shadow-sm'
                : 'hover:bg-[#C4DADE]/20 text-gray-700'
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>
{/* Footer */}
{!collapsed && (
  <div className="p-5 border-t border-[#C4DADE]/40 flex items-center justify-between bg-[#F8FAF9]/70 backdrop-blur sticky bottom-0 z-10">
    <div className="flex items-center gap-3">
      {/* Circle only if logged in */}
      {user && (
        <div className="w-10 h-10 rounded-full bg-[#C4DADE] flex items-center justify-center text-[#1F3634] font-semibold shadow-sm">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <div className="font-medium text-[#1F3634]">
          {user ? user.username : "Start chatting with me!"}
        </div>
      </div>
    </div>

    {/* Login / Logout button */}
    {user ? (
      <button
        onClick={onLogout}
        className="p-3 rounded-lg bg-[#C4DADE] text-[#1F3634] hover:bg-[#b3cfd4] transition shadow-sm flex items-center justify-center gap-2"
      >
       {/*  <span>Logout</span> */}
        <FiLogIn size={20} className="transform rotate-180" />
      </button>
    ) : (
      <button
        onClick={onLoginClick}
        className="p-3 rounded-lg bg-[#C4DADE] text-[#1F3634] hover:bg-[#b3cfd4] transition shadow-sm flex items-center justify-center"
      >
        Login
      </button>
    )}
  </div>
)}


    </motion.aside>
  )
}
