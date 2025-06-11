// src/components/common/OnlineIndicator.jsx
import React from 'react'
import { cn } from '@/lib/utils'

const OnlineIndicator = ({ isOnline, className }) => {
  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full border-2 border-white",
        isOnline ? "bg-green-500" : "bg-gray-400",
        className
      )}
    />
  )
}

export default OnlineIndicator