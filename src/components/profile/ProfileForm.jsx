// src/components/profile/ProfileForm.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/contexts/AuthContext'
import { useImageUpload } from '@/hooks/useImageUpload'
import Avatar from '@/components/common/Avatar'

const ProfileForm = ({ onClose }) => {
  const { profile, updateProfile } = useAuthContext()
  const { uploadAvatar, uploading } = useImageUpload()
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return

    try {
      const avatarUrl = await uploadAvatar(file, profile.id)
      await updateProfile({ avatar_url: avatarUrl })
    } catch (error) {
      console.error('Error updating avatar:', error)
      setError('Failed to update avatar')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await updateProfile(formData)
      onClose?.()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar
          src={profile?.avatar_url}
          alt={profile?.full_name}
          fallback={profile?.full_name?.charAt(0)}
          size="xl"
        />
        
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Change Avatar'}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ''}
            disabled
            className="mt-1 bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm