import { create } from 'zustand'
import api from '../services/api'

const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId = null, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const params = new URLSearchParams()
      if (projectId) params.append('project_id', projectId)
      if (filters.status) params.append('status', filters.status)
      if (filters.assigned_to) params.append('assigned_to', filters.assigned_to)
      if (filters.priority) params.append('priority', filters.priority)

      const response = await api.get(`/tasks?${params.toString()}`)
      set({ tasks: response.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to fetch tasks', isLoading: false })
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/tasks', taskData)
      set((state) => ({ tasks: [...state.tasks, response.data], isLoading: false }))
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to create task', isLoading: false })
    }
  },

  updateTask: async (taskId, taskData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData)
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t)),
        isLoading: false,
      }))
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to update task', isLoading: false })
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/tasks/${taskId}`)
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        isLoading: false,
      }))
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to delete task', isLoading: false })
      return false
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export default useTaskStore
