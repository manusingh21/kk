// src/pages/Chat.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import Layout from '@/components/common/Layout'
import UserSearch from '@/components/chat/UserSearch'
import ConversationList from '@/components/chat/ConversationList'
import ChatArea from '@/components/chat/ChatArea'
import ProfileModal from '@/components/profile/ProfileModal'
import { ChatProvider } from '@/contexts/ChatContext'

const Chat = () => {
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <ChatProvider>
      <Layout>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileModal(true)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* User Search */}
            <UserSearch />

            {/* Conversations List */}
            <ConversationList />
          </div>

          {/* Chat Area */}
          <ChatArea />
        </div>

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      </Layout>
    </ChatProvider>
  )
}

export default Chat