// src/components/chat/ChatArea.jsx
import React from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useChatContext } from '@/contexts/ChatContext'

const ChatArea = () => {
  const { currentConversation, conversations, onlineUsers } = useChatContext()
  
  // Find current conversation details
  const currentConversationData = conversations.find(
    conv => conv.id === currentConversation
  )
  
  const participant = currentConversationData?.participant
  const isOnline = participant ? onlineUsers.has(participant.id) : false

  return (
    <div className="flex-1 flex flex-col">
      {currentConversation && participant && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {participant.full_name || participant.username}
              </h3>
              <p className="text-xs text-gray-500">
                {isOnline ? (
                  <span className="text-green-500">● Online</span>
                ) : (
                  `Last seen ${new Date(participant.last_seen).toLocaleString()}`
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <MessageList />
      <MessageInput />
    </div>
  )
}

export default ChatArea