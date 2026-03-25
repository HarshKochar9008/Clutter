import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, logoutUser, registerUser } from '../services/auth.service'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  const persistSession = (sessionData) => {
    // JWT token is stored server-side in an httpOnly cookie; keep only user state client-side.
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
    // Make logout asynchronous to clear cookies best-effort.
    return (async () => {
      try {
        await logoutUser()
      } finally {
        localStorage.removeItem('user')
        setUser(null)
      }
    })()
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
