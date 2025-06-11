// src/components/chat/UserSearch.jsx
import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUsers } from '@/hooks/useUsers'
import { useChatContext } from '@/contexts/ChatContext'
import { useAuthContext } from '@/contexts/AuthContext'
import Avatar from '@/components/common/Avatar'
import OnlineIndicator from '@/components/common/OnlineIndicator'
import { formatLastSeen } from '@/lib/utils'

const UserSearch = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  const { user } = useAuthContext()
  const { searchResults, loading, searchUsers, clearSearch } = useUsers(user?.id)
  const { onlineUsers, startChat } = useChatContext()

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery)
      } else {
        clearSearch()
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, searchUsers, clearSearch])

  const handleUserClick = async (selectedUser) => {
    try {
      await startChat(selectedUser.id)
      setSearchQuery('')
      clearSearch()
      setIsSearching(false)
      onUserSelect?.(selectedUser)
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    clearSearch()
    setIsSearching(false)
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsSearching(!!e.target.value.trim())
          }}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isSearching && (
        <div className="mt-2 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-sm">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((user) => {
                const isOnline = onlineUsers.has(user.id)
                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 text-left"
                  >
                    <div className="relative">
                      <Avatar
                        src={user.avatar_url}
                        alt={user.full_name}
                        fallback={user.full_name?.charAt(0)}
                      />
                      <OnlineIndicator
                        isOnline={isOnline}
                        className="absolute -bottom-1 -right-1"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{user.username}
                      </p>
                      {!isOnline && user.last_seen && (
                        <p className="text-xs text-gray-400">
                          {formatLastSeen(user.last_seen)}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default UserSearch