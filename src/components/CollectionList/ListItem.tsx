'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ListItemProps {
  item: any
  columns: Array<{ field: string; width?: string }>
  collectionType?: 'discography' | 'events' | 'curatorship' | 'mixes' | 'sound-design' | 'default'
  isAudioVisible: boolean
  onAudioToggle: () => void
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  columns,
  collectionType = 'default',
  isAudioVisible,
  onAudioToggle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showImage, setShowImage] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const audioRef = useRef<HTMLAudioElement>(null)
  const gridTemplateColumns = columns.map((col) => col.width || '1fr').join(' ')

  const hasPlayableContent = item.audio?.mimeType === 'audio/mpeg'
  const hasExternalUrl = Boolean(item.url)
  const hasImage = Boolean(item.image?.url)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime)
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0)
        if (isAudioVisible) {
          audioRef.current?.play()
          setIsPlaying(true)
        }
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateTime)
      }
    }
  }, [isAudioVisible])

  useEffect(() => {
    if (!isAudioVisible && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [isAudioVisible])

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayClick = () => {
    if (!hasPlayableContent) return

    if (isAudioVisible && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      onAudioToggle()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hasImage) {
      // Calculate position with offset to prevent image from being under cursor
      setCursorPosition({ 
        x: e.clientX + 20, 
        y: e.clientY + 20 
      })
    }
  }

  const renderPlayButton = () => {
    if (!hasPlayableContent) return null

    return (
      <button
        onClick={handlePlayClick}
        className="inline-flex items-center hover:opacity-75 transition-opacity"
      >
        {isPlaying && isAudioVisible ? 'PAUSE' : 'PLAY'}
      </button>
    )
  }

  const renderTitle = () => {
    const titleContent = (
      <span 
        className={`${hasExternalUrl ? 'hover:opacity-75 transition-opacity' : ''} ${hasImage ? 'relative' : ''}`}
        onMouseEnter={() => hasImage && setShowImage(true)}
        onMouseLeave={() => hasImage && setShowImage(false)}
        onMouseMove={handleMouseMove}
      >
        {item.title}
      </span>
    )

    if (hasExternalUrl) {
      return (
        <div className="flex items-center gap-2">
          <Link 
            href={item.url} 
            target="_blank" 
            className="hover:opacity-75"
            onMouseEnter={() => hasImage && setShowImage(true)}
            onMouseLeave={() => hasImage && setShowImage(false)}
            onMouseMove={handleMouseMove}
          >
            {titleContent}
          </Link>
          <ExternalLinkIcon />
        </div>
      )
    }

    return titleContent
  }

  const renderDuration = () => {
    if (!item.audio?.mimeType) return item.duration || null

    if (isAudioVisible && isPlaying) {
      return (
        <div className="text-sm text-right tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )
    }

    return <div className="text-sm tabular-nums text-right">{formatTime(duration)}</div>
  }

  const renderCell = (field: string) => {
    if (field === 'play') return renderPlayButton()
    if (field === 'title') return renderTitle()
    if (field === 'duration') return renderDuration()
    return item[field]
  }

  const renderAudioPlayer = () => (
    <div
      className="grid gap-y-2 w-[calc(100%-76px)] ml-[76px] mb-4"
      style={{ gridTemplateColumns }}
    >
      <div></div>
      <div className="col-span-full flex items-center">
        <div className="flex-grow bg-border h-[2px]">
          <div
            className="bg-foreground h-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <audio
          ref={audioRef}
          className="hidden"
          onEnded={() => {
            setIsPlaying(false)
            setCurrentTime(0)
          }}
        >
          <source src={item.audio.url} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )

  return (
    <div className="contents">
      <div className="grid gap-x-4 items-start w-full" style={{ gridTemplateColumns }}>
        {columns.map(({ field }) => (
          <div key={field} className={field.toLowerCase()}>
            {renderCell(field)}
          </div>
        ))}
      </div>
      {hasPlayableContent && isAudioVisible && renderAudioPlayer()}
      {/* Render the hovering image at the document level to avoid containment issues */}
      {hasImage && showImage && (
        <div 
          className="fixed z-50 shadow-lg overflow-hidden pointer-events-none"
          style={{ 
            left: `${cursorPosition.x}px`, 
            top: `${cursorPosition.y}px`,
            transition: 'left 0.05s, top 0.05s'
          }}
        >
          <Image 
            src={item.image.url} 
            alt={item.title || 'Event image'} 
            width={300}
            height={200}
            className="object-contain max-w-[300px] max-h-[200px] w-auto h-auto"
            style={{ 
              width: 'auto', 
              height: 'auto'
            }}
          />
        </div>
      )}
    </div>
  )
}

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)
