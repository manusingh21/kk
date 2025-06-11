// src/components/chat/MessageInput.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useChatContext } from '@/contexts/ChatContext'
import { useImageUpload } from '@/hooks/useImageUpload'
import ImageUpload from './ImageUpload'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const { sendMessage, currentConversation } = useChatContext()
  const { uploadImage, uploading } = useImageUpload()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim() || !currentConversation) return

    try {
      await sendMessage(message.trim())
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleImageSelect = async (file) => {
    if (!currentConversation) return

    try {
      const imageUrl = await uploadImage(file)
      await sendMessage('', 'image', imageUrl)
    } catch (error) {
      console.error('Error sending image:', error)
    }
  }

  if (!currentConversation) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-gray-500">
          Select a conversation to start messaging
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <ImageUpload
          onImageSelect={handleImageSelect}
          disabled={uploading}
        />
        
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={uploading}
            className="w-full"
          />
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || uploading}
          size="sm"
          className="h-10 w-10 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default MessageInput