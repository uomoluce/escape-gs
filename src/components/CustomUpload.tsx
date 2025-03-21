'use client'

import React, { useState } from 'react'
import type { UploadField } from 'payload'

export const CustomUpload: React.FC<{ field: UploadField }> = ({ field }) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    // Get the presigned URL from your API
    try {
      setUploadStatus('Getting upload URL...')
      const response = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })
      
      if (!response.ok) throw new Error('Failed to get upload URL')
      const { url } = await response.json()

      setUploadStatus('Uploading...')
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      
      if (!uploadResponse.ok) throw new Error(await uploadResponse.text())
      setUploadStatus('Upload successful!')
    } catch (error) {
      setUploadStatus(`Upload failed: ${(error as Error).message}`)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  )
}
