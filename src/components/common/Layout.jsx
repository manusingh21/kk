// src/components/common/Layout.jsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import Avatar from './Avatar'

const Layout = ({ children }) => {
  const { profile, signOut } = useAuthContext()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Chat App</h1>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.full_name}
                fallback={profile?.full_name?.charAt(0)}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-700">
                {profile?.full_name || profile?.username}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export default Layout