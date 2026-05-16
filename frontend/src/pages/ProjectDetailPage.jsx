import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Trash2, Users } from 'lucide-react'
import useProjectStore from '../store/projectStore'
import useTaskStore from '../store/taskStore'

export function ProjectDetailPage() {
  const { id } = useParams()
  const currentProject = useProjectStore((state) => state.currentProject)
  const getProject = useProjectStore((state) => state.getProject)
  const tasks = useTaskStore((state) => state.tasks)
  const fetchTasks = useTaskStore((state) => state.fetchTasks)
  const createTask = useTaskStore((state) => state.createTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const updateTask = useTaskStore((state) => state.updateTask)

  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  })
  const [memberForm, setMemberForm] = useState({
    user_id: '',
    role: 'member',
  })

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    setIsLoading(true)
    await getProject(id)
    await fetchTasks(id)
    await loadTeamMembers()
    setIsLoading(false)
  }

  const loadTeamMembers = async () => {
    try {
      const members = await useProjectStore.getState().getTeamMembers(id)
      setTeamMembers(members || [])
    } catch (err) {
      console.error('Failed to load team members', err)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    const task = await createTask({
      ...formData,
      project_id: id,
    })
    if (task) {
      setFormData({ title: '', description: '', priority: 'medium' })
      setShowForm(false)
      await fetchTasks(id)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      await deleteTask(taskId)
      await fetchTasks(id)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus })
    await fetchTasks(id)
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    const added = await useProjectStore.getState().addTeamMember(id, memberForm.user_id, memberForm.role)
    if (added) {
      setMemberForm({ user_id: '', role: 'member' })
      setShowMemberForm(false)
      await loadTeamMembers()
    }
  }

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Remove this member?')) {
      const removed = await useProjectStore.getState().removeTeamMember(id, userId)
      if (removed) {
        await loadTeamMembers()
      }
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!currentProject) {
    return <div className="text-center p-4">Project not found</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{currentProject.name}</h1>
        <p className="text-gray-600 mt-2">{currentProject.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {showForm && (
            <div className="card mb-6">
              <form onSubmit={handleCreateTask} className="space-y-4">
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
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input h-20"
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

          {tasks.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="card">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
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
                        onClick={() => handleDeleteTask(task.id)}
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

        {/* Team Members Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={24} />
              Team
            </h2>
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {showMemberForm && (
            <div className="card mb-4">
              <form onSubmit={handleAddMember} className="space-y-3">
                <input
                  type="text"
                  placeholder="User ID"
                  value={memberForm.user_id}
                  onChange={(e) => setMemberForm({ ...memberForm, user_id: e.target.value })}
                  className="input text-sm"
                  required
                />
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="input text-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="btn-primary w-full text-sm">
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowMemberForm(false)}
                  className="btn-ghost w-full text-sm"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="card p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {member.user?.username}
                    </p>
                    <p className="text-xs text-gray-600">{member.user?.email}</p>
                    <p className={`text-xs mt-1 ${
                      member.role === 'admin' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {member.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.user_id)}
                    className="text-red-600 hover:text-red-800 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
