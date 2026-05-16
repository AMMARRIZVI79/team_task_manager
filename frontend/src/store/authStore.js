import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // Initialize from localStorage
  init: () => {
    const user = localStorage.getItem('user')
    if (user) {
      set({ user: JSON.parse(user) })
    }
  },

  signup: async (email, username, fullName, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/auth/signup', {
        email,
        username,
        full_name: fullName,
        password,
      })
      const { access_token, refresh_token, user } = response.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isLoading: false })
      return true
    } catch (err) {
      const message = err.response?.data?.detail || 'Signup failed'
      set({ error: message, isLoading: false })
      return false
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token, refresh_token, user } = response.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isLoading: false })
      return true
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed'
      set({ error: message, isLoading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    set({ user: null })
  },

  setError: (error) => set({ error }),
}))

export default useAuthStore
