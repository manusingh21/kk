// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase.js'
import { authAPI } from '@/lib/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      const data = await authAPI.signUp(email, password, userData)
      return data
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      const data = await authAPI.signIn(email, password)
      return data
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authAPI.signOut()
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const data = await authAPI.updateUserProfile(user.id, updates)
      await fetchProfile(user.id)
      return data
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}