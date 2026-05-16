import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import useProjectStore from '../store/projectStore'

export function ProjectsPage() {
  const projects = useProjectStore((state) => state.projects)
  const fetchProjects = useProjectStore((state) => state.fetchProjects)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const isLoading = useProjectStore((state) => state.isLoading)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchProjects()
  }, [])

  const createProject = useProjectStore((state) => state.createProject)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const project = await createProject(formData.name, formData.description)
    if (project) {
      setFormData({ name: '', description: '' })
      setShowForm(false)
      fetchProjects()
    }
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                className="input h-24"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create</button>
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

      {isLoading && projects.length === 0 ? (
        <div className="text-center text-gray-600">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No projects yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      // Handle edit
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(project.id)
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
