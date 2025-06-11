// src/hooks/useOnlineStatus.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useOnlineStatus = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set())

  useEffect(() => {
    if (!userId) return

    // Update user's online status
    const updateOnlineStatus = async (isOnline) => {
      await supabase
        .from('users')
        .update({ 
          is_online: isOnline, 
          last_seen: new Date().toISOString() 
        })
        .eq('id', userId)
    }

    // Set user as online
    updateOnlineStatus(true)

    // Listen for online status changes
    const presenceSubscription = supabase
      .channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = supabase.getChannels()[0].presenceState()
        const users = new Set()
        Object.keys(newState).forEach(key => {
          newState[key].forEach(presence => {
            users.add(presence.user_id)
          })
        })
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        newPresences.forEach(presence => {
          setOnlineUsers(prev => new Set([...prev, presence.user_id]))
        })
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        leftPresences.forEach(presence => {
          setOnlineUsers(prev => {
            const newSet = new Set(prev)
            newSet.delete(presence.user_id)
            return newSet
          })
        })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await supabase.channel('online-users').track({
            user_id: userId,
            online_at: new Date().toISOString(),
          })
        }
      })

    // Set user as offline when leaving
    const handleBeforeUnload = () => {
      updateOnlineStatus(false)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      updateOnlineStatus(false)
      presenceSubscription.unsubscribe()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [userId])

  return onlineUsers
}