import api from './api'

export const registerUser = async (payload) => {
  const response = await api.post('/auth/register', payload)
  return response.data.data
}

export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', payload)
  return response.data.data
}

export const logoutUser = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export const clerkLoginUser = async ({ token, email, name } = {}) => {
  const response = await api.post('/auth/clerk', { token, email, name })
  return response.data.data
}
