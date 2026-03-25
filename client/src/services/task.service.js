import api from './api'

export const getTasks = async (params) => {
  const response = await api.get('/tasks', { params })
  return response.data.data
}

export const createTask = async (payload) => {
  const response = await api.post('/tasks', payload)
  return response.data.data
}

export const updateTask = async (id, payload) => {
  const response = await api.put(`/tasks/${id}`, payload)
  return response.data.data
}

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}

export const getTaskAnalytics = async () => {
  const response = await api.get('/tasks/analytics')
  return response.data.data
}
