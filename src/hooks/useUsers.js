// src/hooks/useUsers.js
import { useState, useCallback } from 'react'
import { chatAPI } from '@/lib/chat'

export const useUsers = (currentUserId) => {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const searchUsers = useCallback(async (query) => {
    if (!query.trim() || !currentUserId) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const results = await chatAPI.searchUsers(query, currentUserId)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  const clearSearch = useCallback(() => {
    setSearchResults([])
  }, [])

  return {
    searchResults,
    loading,
    searchUsers,
    clearSearch,
  }
}