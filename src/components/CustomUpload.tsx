'use client'

import React, { useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import type { UploadField } from 'payload'

export const CustomUpload: React.FC<{ field: UploadField }> = ({ field }) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [s3UploadUrl] = useFormFields(([fields]) => [
    fields.s3UploadUrl?.value as string | undefined,
  ])

  const handleUpload = async (file: File) => {
    if (!s3UploadUrl) {
      setUploadStatus('No upload URL available')
      return
    }

    try {
      setUploadStatus('Uploading...')
      const response = await fetch(s3UploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!response.ok) throw new Error(await response.text())
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
