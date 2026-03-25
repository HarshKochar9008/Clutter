import { useMemo, useState } from 'react'
import { loginUser, logoutUser, registerUser } from '../services/auth.service'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContextStore'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  const persistSession = (sessionData) => {
    localStorage.setItem('user', JSON.stringify(sessionData.user))
    setUser(sessionData.user)
  }

  const login = async (credentials) => {
    setLoading(true)
    try {
      const data = await loginUser(credentials)
      persistSession(data)
      return data
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed'
      toast.error(message)
      throw err
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
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed'
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    return (async () => {
      try {
        await logoutUser()
      } finally {
        localStorage.removeItem('user')
        setUser(null)
      }
    })()
  }

  const authReady = true

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      authReady,
      login,
      register,
      logout,
    }),
    [user, loading, authReady, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
