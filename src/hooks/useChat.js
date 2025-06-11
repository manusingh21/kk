// src/hooks/useChat.js
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { chatAPI } from '@/lib/chat'

export const useChat = (userId) => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!userId) return

    try {
      const data = await chatAPI.getConversations(userId)
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return

    try {
      const data = await chatAPI.getMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [])

  // Start chat with a user
  const startChat = useCallback(async (otherUserId) => {
    if (!userId) return

    try {
      const conversationId = await chatAPI.getOrCreateConversation(userId, otherUserId)
      setCurrentConversation(conversationId)
      await fetchMessages(conversationId)
      await fetchConversations()
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }, [userId, fetchMessages, fetchConversations])

  // Send a message
  const sendMessage = useCallback(async (content, messageType = 'text', imageUrl = null) => {
    if (!currentConversation || !userId) return

    try {
      await chatAPI.sendMessage(currentConversation, userId, content, messageType, imageUrl)
      // Message will be added via realtime subscription
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [currentConversation, userId])

  // Set up realtime subscriptions
  useEffect(() => {
    if (!userId) return

    // Subscribe to messages
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT',
          // src/hooks/useChat.js (continued)
         schema: 'public', 
         table: 'messages' 
       }, 
       async (payload) => {
         const newMessage = payload.new
         
         // Fetch complete message data with user info
         const { data: messageWithUser } = await supabase
           .from('messages')
           .select(`
             *,
             users!inner(id, username, full_name, avatar_url)
           `)
           .eq('id', newMessage.id)
           .single()

         if (messageWithUser && messageWithUser.conversation_id === currentConversation) {
           setMessages(prev => [...prev, messageWithUser])
         }

         // Update conversations list
         await fetchConversations()
       }
     )
     .subscribe()

   return () => {
     messagesSubscription.unsubscribe()
   }
 }, [userId, currentConversation, fetchConversations])

 // Initial load
 useEffect(() => {
   fetchConversations()
 }, [fetchConversations])

 // Load messages when conversation changes
 useEffect(() => {
   if (currentConversation) {
     fetchMessages(currentConversation)
   }
 }, [currentConversation, fetchMessages])

 return {
   conversations,
   currentConversation,
   messages,
   loading,
   setCurrentConversation,
   startChat,
   sendMessage,
   fetchConversations,
 }
}