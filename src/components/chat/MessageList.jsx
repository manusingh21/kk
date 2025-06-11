// src/components/chat/MessageList.jsx
import React, { useEffect, useRef } from 'react'
import { useChatContext } from '@/contexts/ChatContext'
import { useAuthContext } from '@/contexts/AuthContext'
import Avatar from '@/components/common/Avatar'
import { formatTime } from '@/lib/utils'

const MessageList = () => {
  const { messages, currentConversation } = useChatContext()
  const { user } = useAuthContext()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
         // src/components/chat/MessageList.jsx (continued)
         <p className="text-lg font-medium">Welcome to Chat</p>
         <p className="text-sm mt-1">Select a conversation or search for users to start chatting</p>
       </div>
     </div>
   )
 }

 if (messages.length === 0) {
   return (
     <div className="flex-1 flex items-center justify-center bg-gray-50">
       <div className="text-center text-gray-500">
         <p>No messages yet</p>
         <p className="text-sm mt-1">Send the first message to start the conversation!</p>
       </div>
     </div>
   )
 }

 return (
   <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
     {messages.map((message, index) => {
       const isOwnMessage = message.sender_id === user?.id
       const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id
       const sender = message.users

       return (
         <div
           key={message.id}
           className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
         >
           <div
             className={`flex max-w-xs lg:max-w-md ${
               isOwnMessage ? 'flex-row-reverse' : 'flex-row'
             }`}
           >
             {showAvatar && !isOwnMessage && (
               <Avatar
                 src={sender?.avatar_url}
                 alt={sender?.full_name}
                 fallback={sender?.full_name?.charAt(0)}
                 size="sm"
                 className="mt-1"
               />
             )}
             
             <div
               className={`mx-2 ${
                 isOwnMessage ? 'text-right' : 'text-left'
               }`}
             >
               {showAvatar && !isOwnMessage && (
                 <div className="text-xs text-gray-500 mb-1">
                   {sender?.full_name || sender?.username}
                 </div>
               )}
               
               <div
                 className={`inline-block rounded-lg px-3 py-2 ${
                   isOwnMessage
                     ? 'bg-blue-500 text-white'
                     : 'bg-white text-gray-900 border border-gray-200'
                 }`}
               >
                 {message.message_type === 'image' ? (
                   <div>
                     <img
                       src={message.image_url}
                       alt="Shared image"
                       className="max-w-full h-auto rounded-md"
                       style={{ maxHeight: '200px' }}
                     />
                     {message.content && (
                       <p className="mt-2 text-sm">{message.content}</p>
                     )}
                   </div>
                 ) : (
                   <p className="text-sm">{message.content}</p>
                 )}
               </div>
               
               <div
                 className={`text-xs text-gray-400 mt-1 ${
                   isOwnMessage ? 'text-right' : 'text-left'
                 }`}
               >
                 {formatTime(message.created_at)}
               </div>
             </div>
           </div>
         </div>
       )
     })}
     <div ref={messagesEndRef} />
   </div>
 )
}

export default MessageList