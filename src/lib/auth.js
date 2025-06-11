// src/lib/auth.js
import { supabase } from './supabase.js'
// Test with minimal data
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123'
})
console.log('Minimal signup result:', { data, error })
export const authAPI = {
  async signUp(email, password, userData) {
    // First, just try the basic signup without custom profile creation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userData.username,
          full_name: userData.fullName,
        }
      }
    })

    if (authError) throw authError
    return authData
  
  },
  // ... rest of your methods

  

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
    return data
  }
}