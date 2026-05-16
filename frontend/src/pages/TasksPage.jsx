import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import useTaskStore from '../store/taskStore'
import { formatDistanceToNow } from 'date-fns'

export function TasksPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const fetchTasks = useTaskStore((state) => state.fetchTasks)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const isLoading = useTaskStore((state) => state.isLoading)
  
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ status: '', priority: '' })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    project_id: '',
    due_date: '',
  })

  useEffect(() => {
    fetchTasks(null, filters)
  }, [filters])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.project_id) {
      alert('Please select a project')
      return
    }
    
    const taskData = {
      ...formData,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
    }
    
    const result = await useTaskStore.getState().createTask(taskData)
    if (result) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        project_id: '',
        due_date: '',
      })
      setShowForm(false)
      fetchTasks(null, filters)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus })
    fetchTasks(null, filters)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input h-24"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="input"
                  placeholder="Paste project ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create Task</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading && tasks.length === 0 ? (
        <div className="text-center text-gray-600">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No tasks found</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
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
                    {task.due_date && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
