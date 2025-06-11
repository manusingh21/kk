// src/components/chat/ImageUpload.jsx
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Image, Upload } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

const ImageUpload = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef(null)
  const { uploading } = useImageUpload()

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
    // Reset input
    event.target.value = ''
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleButtonClick}
        disabled={disabled || uploading}
        className="h-10 w-10 p-0"
      >
        {uploading ? (
          <Upload className="h-4 w-4 animate-spin" />
        ) : (
          <Image className="h-4 w-4" />
        )}
      </Button>
    </>
  )
}

export default ImageUpload