import { MessageCircle, Users, Settings, LogOut, ChevronLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      icon: MessageCircle,
      label: 'Chats',
      path: '/chat',
      active: location.pathname === '/chat'
    },
    {
      icon: Users,
      label: 'Find Users',
      path: '/users',
      active: location.pathname === '/users'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      active: location.pathname === '/settings'
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <h1 className="text-xl font-semibold text-gray-800">ChatApp</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`} />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="ml-3 text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar