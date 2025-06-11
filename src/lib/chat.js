// src/lib/chat.js
import { supabase } from './supabase'

export const chatAPI = {
  async getOrCreateConversation(userId1, userId2) {
    // Check if conversation already exists
    let { data: existingConversation, error } = await supabase
      .from('conversations')
      .select(`
        id,
        conversation_participants!inner(user_id)
      `)
      .eq('conversation_participants.user_id', userId1)

    if (error) throw error

    // Find conversation with both users
    const conversation = existingConversation?.find(conv => 
      conv.conversation_participants.some(p => p.user_id === userId2)
    )

    if (conversation) {
      return conversation.id
    }

    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert([{}])
      .select()
      .single()

    if (createError) throw createError

    // Add participants
    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConversation.id, user_id: userId1 },
        { conversation_id: newConversation.id, user_id: userId2 }
      ])

    if (participantsError) throw participantsError

    return newConversation.id
  },

  async getConversations(userId) {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations!inner(
          id,
          updated_at,
          conversation_participants!inner(
            user_id,
            users!inner(id, username, full_name, avatar_url, is_online, last_seen)
          )
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    return data?.map(item => ({
      id: item.conversation_id,
      updated_at: item.conversations.updated_at,
      participant: item.conversations.conversation_participants.find(p => p.user_id !== userId)?.users
    })) || []
  },

  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users!inner(id, username, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async sendMessage(conversationId, senderId, content, messageType = 'text', imageUrl = null) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        message_type: messageType,
        image_url: imageUrl
      }])
      .select(`
        *,
        users!inner(id, username, full_name, avatar_url)
      `)
      .single()

    if (error) throw error

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return data
  },

  async searchUsers(query, currentUserId) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, avatar_url, is_online, last_seen')
      .neq('id', currentUserId)
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10)

    if (error) throw error
    return data
  }
}