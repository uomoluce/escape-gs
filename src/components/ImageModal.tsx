import React from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, alt }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-[80vw] max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt={alt}
          className="object-contain max-w-[80vw] max-h-[80vh] w-auto h-auto"
          onError={onClose}
        />
      </div>
    </div>
  )
}
