// src/hooks/useImageUpload.js
import { useState } from 'react'
import { storageAPI } from '@/lib/storage'

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file) => {
    if (!file) return null

    setUploading(true)
    try {
      const url = await storageAPI.uploadImage(file)
      return url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const uploadAvatar = async (file, userId) => {
    if (!file || !userId) return null

    setUploading(true)
    try {
      const url = await storageAPI.uploadAvatar(file, userId)
      return url
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    uploadImage,
    uploadAvatar,
  }
}