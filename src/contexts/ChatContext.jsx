// src/contexts/ChatContext.jsx
import React, { createContext, useContext } from 'react'
import { useChat } from '@/hooks/useChat'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useAuthContext } from './AuthContext'

const ChatContext = createContext({})

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const { user } = useAuthContext()
  const chat = useChat(user?.id)
  const onlineUsers = useOnlineStatus(user?.id)

  return (
    <ChatContext.Provider value={{ ...chat, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  )
}