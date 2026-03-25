import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

const getCookie = (name) => {
  // Reads non-httpOnly cookies (used for CSRF). The JWT itself is httpOnly.
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase()
  const unsafeMethod = !['get', 'head', 'options'].includes(method)

  if (unsafeMethod) {
    const csrfToken = getCookie('csrfToken')
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      // Best-effort: if a previous build stored a token, remove it too.
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
