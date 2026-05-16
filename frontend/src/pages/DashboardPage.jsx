import { useEffect, useState } from 'react'
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard/stats')
      setDashboard(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>
  }

  if (!dashboard) {
    return <div className="text-center p-4">No data available</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800">{dashboard.task_stats.total_tasks}</p>
            </div>
            <BarChart3 className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboard.task_stats.pending_tasks}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{dashboard.task_stats.in_progress_tasks}</p>
            </div>
            <BarChart3 className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">{dashboard.task_stats.completed_tasks}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{dashboard.task_stats.overdue_tasks}</p>
            </div>
            <AlertCircle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        {dashboard.my_projects && dashboard.my_projects.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Projects</h2>
            <div className="space-y-3">
              {dashboard.my_projects.map((project) => (
                <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {project.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Tasks */}
        {dashboard.assigned_tasks && dashboard.assigned_tasks.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Assigned Tasks</h2>
            <div className="space-y-3">
              {dashboard.assigned_tasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {task.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
