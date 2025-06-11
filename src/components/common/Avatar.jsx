// src/components/common/Avatar.jsx
import React from 'react'
import { Avatar as AvatarUI, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Avatar = ({ src, alt, fallback, className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <AvatarUI className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
      </AvatarFallback>
    </AvatarUI>
  )
}

export default Avatar