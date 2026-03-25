import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/react'
import { clerkLoginUser, loginUser, logoutUser, registerUser } from '../services/auth.service'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const hasClerkKey = () => Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim())

  const clerkEnabled = hasClerkKey()
  const { isLoaded: clerkIsLoaded, userId: clerkUserId, getToken } = useClerkAuth()
  const clerk = useClerk()
  const { user: clerkUser } = useUser()

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)
  const [clerkSyncFailed, setClerkSyncFailed] = useState(false)

  const persistSession = (sessionData) => {
    localStorage.setItem('user', JSON.stringify(sessionData.user))
    setUser(sessionData.user)
  }

  useEffect(() => {
    if (!clerkEnabled) return
    if (!clerkIsLoaded) return
    if (!clerkUserId) {

      localStorage.removeItem('user')
      setUser(null)
      setClerkSyncFailed(false)
      return
    }
    if (user) return // already have app session

    setClerkSyncFailed(false)
    setLoading(true)

    const sync = async () => {
      try {
        const email =
          clerkUser?.primaryEmailAddress?.emailAddress ||
          clerkUser?.emailAddresses?.[0]?.emailAddress ||
          clerkUser?.email

        const name =
          clerkUser?.fullName ||
          [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
          (email ? email.split('@')[0] : 'User')

        // Get the active Clerk session JWT to send to the backend for verification.
        const sessionToken = await getToken()
        const data = await clerkLoginUser({ token: sessionToken, email, name })
        persistSession(data)
      } catch (err) {
        setClerkSyncFailed(true)
        localStorage.removeItem('user')
        setUser(null)
        const message = err?.response?.data?.message || err?.message || 'Clerk login sync failed. Please try again.'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    sync()
  }, [clerkEnabled, clerkIsLoaded, clerkUserId, user, clerkUser])

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
        if (clerkEnabled) {
          await clerk.signOut()
        }
      }
    })()
  }

  const authReady = !clerkEnabled
    ? true
    : !clerkIsLoaded
      ? Boolean(user)
      : clerkUserId
        ? Boolean(user) || clerkSyncFailed
        : true

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
    [user, loading, authReady],
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
