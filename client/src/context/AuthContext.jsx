import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../services/auth.service'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  const persistSession = (sessionData) => {
    localStorage.setItem('token', sessionData.token)
    localStorage.setItem('user', JSON.stringify(sessionData.user))
    setUser(sessionData.user)
  }

  const login = async (credentials) => {
    setLoading(true)
    try {
      const data = await loginUser(credentials)
      persistSession(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const data = await registerUser(payload)
      persistSession(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
