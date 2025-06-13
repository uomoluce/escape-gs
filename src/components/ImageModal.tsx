import React, { useState } from 'react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, alt }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="relative max-w-[80vw] max-h-[80vh] bg-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          className={`object-contain max-w-[80vw] max-h-[80vh] w-auto h-auto grayscale brightness-90 contrast-125 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
          onError={onClose}
        />
      </div>
    </div>
  )
}
