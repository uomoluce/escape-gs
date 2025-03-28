'use client'

import { useState } from 'react'
import { upload } from '@vercel/blob/client'

interface Props {
  onUploadComplete?: (url: string) => void
  onUploadError?: (error: Error) => void
  onUploadProgress?: (progress: number) => void
}

export function ClientUpload({ onUploadComplete, onUploadError, onUploadProgress }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Log file details
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Check file size before upload
    if (file.size > 26214400) {
      // 25MB in bytes
      onUploadError?.(new Error('File size exceeds 25MB limit'))
      return
    }

    try {
      setUploading(true)

      // Get the file extension
      const ext = file.name.split('.').pop()

      // Generate a unique filename with the original extension
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

      console.log('Starting upload process for:', {
        filename,
        size: file.size,
        type: file.type,
      })

      // Start the upload - this should only send metadata to our API
      // and then upload directly to Blob storage
      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/media/upload',
        onUploadProgress: (progress) => {
          // Calculate and report progress percentage
          const percentage = Math.round((progress.loaded / progress.total) * 100)
          console.log(`Direct upload progress: ${percentage}%`, {
            loaded: progress.loaded,
            total: progress.total,
          })
          onUploadProgress?.(percentage)
        },
      })

      // Report success
      console.log('Upload completed successfully:', {
        url: blob.url,
        pathname: blob.pathname,
      })
      onUploadComplete?.(blob.url)
    } catch (error) {
      console.error('Upload failed:', error)
      onUploadError?.(error as Error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="audio/*,video/*,image/*"
      />
      <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
        {uploading ? 'Uploading...' : 'Upload File'}
      </div>
    </div>
  )
}
