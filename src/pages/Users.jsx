import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useChat } from '../hooks/useChat'
import OnlineIndicator from '../components/common/OnlineIndicator'

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { users, loading, searchUsers } = useUsers()
  const { createOrGetConversation } = useChat()

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    searchUsers(query)
  }

  const handleStartChat = async (user) => {
    const conversationId = await createOrGetConversation(user.id)
    // Navigate to chat with this conversation
    window.location.href = `/chat?conversation=${conversationId}`
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Find Users</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or username..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      <div className="grid gap-4 max-w-2xl">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.full_name || user.username}</p>
                <div className="flex items-center space-x-2">
                  <OnlineIndicator 
                    isOnline={user.is_online} 
                    lastSeen={user.last_seen}
                    size="sm"
                  />
                  <span className="text-sm text-gray-500">@{user.username}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStartChat(user)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users