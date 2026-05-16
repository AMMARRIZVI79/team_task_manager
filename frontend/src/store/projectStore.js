import { create } from 'zustand'
import api from '../services/api'

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/projects')
      set({ projects: response.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to fetch projects', isLoading: false })
    }
  },

  createProject: async (name, description) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/projects', { name, description })
      set((state) => ({ projects: [...state.projects, response.data], isLoading: false }))
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to create project', isLoading: false })
    }
  },

  getProject: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/projects/${projectId}`)
      set({ currentProject: response.data, isLoading: false })
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to fetch project', isLoading: false })
    }
  },

  updateProject: async (projectId, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put(`/projects/${projectId}`, data)
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? response.data : p)),
        currentProject: state.currentProject?.id === projectId ? response.data : state.currentProject,
        isLoading: false,
      }))
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to update project', isLoading: false })
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/projects/${projectId}`)
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        isLoading: false,
      }))
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to delete project', isLoading: false })
      return false
    }
  },

  addTeamMember: async (projectId, userId, role = 'member') => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post(`/projects/${projectId}/members`, { user_id: userId, role })
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to add team member', isLoading: false })
    }
  },

  getTeamMembers: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/members`)
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to fetch team members' })
    }
  },

  removeTeamMember: async (projectId, userId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`)
      set({ isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to remove team member', isLoading: false })
      return false
    }
  },
}))

export default useProjectStore
