// src/pages/Profile.jsx
import React from 'react'
import Layout from '@/components/common/Layout'
import ProfileForm from '@/components/profile/ProfileForm'

const Profile = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <ProfileForm />
        </div>
      </div>
    </Layout>
  )
}

export default Profile