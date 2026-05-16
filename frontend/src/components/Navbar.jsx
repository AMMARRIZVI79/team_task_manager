import { Link, useNavigate } from 'react-router-dom'
import { Menu, LogOut, User } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { useState } from 'react'

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">📋</span>
            Task Manager
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link to="/projects" className="hover:bg-blue-700 px-3 py-2 rounded">
              Projects
            </Link>
            <Link to="/tasks" className="hover:bg-blue-700 px-3 py-2 rounded">
              Tasks
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <User size={20} />
              <span>{user?.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>

            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block hover:bg-blue-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="block hover:bg-blue-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/tasks"
              className="block hover:bg-blue-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Tasks
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
