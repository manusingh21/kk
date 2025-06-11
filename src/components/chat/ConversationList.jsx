// src/components/chat/ConversationList.jsx
import React from 'react'
import { useChatContext } from '@/contexts/ChatContext'
import Avatar from '@/components/common/Avatar'
import OnlineIndicator from '@/components/common/OnlineIndicator'
import { formatLastSeen } from '@/lib/utils'

const ConversationList = () => {
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation, 
    onlineUsers,
    loading 
  } = useChatContext()

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading conversations...
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet.</p>
        <p className="text-sm mt-1">Search for users to start chatting!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const participant = conversation.participant
        const isOnline = onlineUsers.has(participant?.id)
        const isActive = currentConversation === conversation.id

        return (
          <button
            key={conversation.id}
            onClick={() => setCurrentConversation(conversation.id)}
            className={`w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-center space-x-3 text-left ${
              isActive ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
            }`}
          >
            <div className="relative">
              <Avatar
                src={participant?.avatar_url}
                alt={participant?.full_name}
                fallback={participant?.full_name?.charAt(0)}
              />
              <OnlineIndicator
                isOnline={isOnline}
                className="absolute -bottom-1 -right-1"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {participant?.full_name || participant?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{participant?.username}
              </p>
              {!isOnline && participant?.last_seen && (
                <p className="text-xs text-gray-400">
                  {formatLastSeen(participant.last_seen)}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default ConversationList