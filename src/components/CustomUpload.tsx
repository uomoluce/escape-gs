import React, { useState, useCallback } from 'react'
import { useFormFields } from 'payload/components/forms'
import { Props } from 'payload/components/fields/File'

interface UploadStatus {
  type: 'idle' | 'uploading' | 'success' | 'error'
  message?: string
}

export const CustomUpload: React.FC<Props> = ({ field }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: 'idle' })
  const [s3UploadUrl] = useFormFields(([fields]) => [fields.s3UploadUrl?.value])

  const handleUpload = useCallback(
    async (file: File) => {
      if (!s3UploadUrl) {
        setUploadStatus({
          type: 'error',
          message: 'No upload URL available. Please try again.',
        })
        return
      }

      try {
        setUploadStatus({ type: 'uploading', message: 'Uploading file...' })

        const response = await fetch(s3UploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
            'x-amz-acl': 'public-read',
          },
          body: file,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || 'Upload failed')
        }

        setUploadStatus({
          type: 'success',
          message: 'File uploaded successfully!',
        })
      } catch (error) {
        setUploadStatus({
          type: 'error',
          message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        })
        console.error('Upload error:', error)
      }
    },
    [s3UploadUrl],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleUpload(file)
      }
    },
    [handleUpload],
  )

  return (
    <div className="p-4 border rounded-lg">
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Choose file
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept={field.accept}
            disabled={uploadStatus.type === 'uploading'}
          />
        </label>
      </div>

      {uploadStatus.message && (
        <div
          className={`mt-2 p-2 rounded ${
            uploadStatus.type === 'error'
              ? 'bg-red-100 text-red-700'
              : uploadStatus.type === 'success'
                ? 'bg-green-100 text-green-700'
                : uploadStatus.type === 'uploading'
                  ? 'bg-blue-100 text-blue-700'
                  : ''
          }`}
        >
          {uploadStatus.type === 'uploading' && (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {uploadStatus.message}
            </div>
          )}
          {uploadStatus.type !== 'uploading' && uploadStatus.message}
        </div>
      )}
    </div>
  )
}
