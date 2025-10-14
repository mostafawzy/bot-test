import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isLogin) {
      // LOGIN
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, // backend expects "username"
          password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      // pass data to App for handling token and user state
      onLoginSuccess(data);
    } else {
      // SIGNUP
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");

      // Option 1: Alert success and switch to login
      alert("Signup successful! Please log in.");
      setIsLogin(true);
      setUsername("");
      setEmail("");
      setPassword("");
    }
  } catch (err) {
    console.error(isLogin ? "Login failed:" : "Signup failed:", err);
    setError(err.message);
    alert(err.message);
  }
};





  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#F8FAF9] w-96 p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#1F3634] hover:text-[#3B5F5C] transition"
        >
          <FiX size={20} />
        </button>

        {/* Tabs */}
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 rounded-t-lg font-medium transition ${
              isLogin ? 'bg-[#C4DADE] text-[#1F3634]' : 'bg-[#E9F0F1] text-gray-600'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-t-lg font-medium transition ${
              !isLogin ? 'bg-[#C4DADE] text-[#1F3634]' : 'bg-[#E9F0F1] text-gray-600'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-3 rounded-lg border border-[#C4DADE]/50 focus:outline-none focus:ring-2 focus:ring-[#C4DADE] transition"
              required
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="p-3 rounded-lg border border-[#C4DADE]/50 focus:outline-none focus:ring-2 focus:ring-[#C4DADE] transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-3 rounded-lg border border-[#C4DADE]/50 focus:outline-none focus:ring-2 focus:ring-[#C4DADE] transition"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-[#C4DADE] text-[#1F3634] p-3 rounded-lg font-medium hover:bg-[#b3cfd4] transition"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By continuing, you agree to our Terms & Conditions.
        </p>
      </div>
    </div>
  )
}
