'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageIcon, PauseIcon, PlayIcon } from 'lucide-react'
import type { ListItemProps } from './types'

export const ListItem: React.FC<ListItemProps> = ({
  item,
  columns,
  collectionType = 'default',
  isAudioVisible,
  isVideoVisible,
  onAudioToggle,
  onVideoToggle,
  isFirstOfYear,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showImage, setShowImage] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const gridTemplateColumns = columns.map((col) => col.width || '1fr').join(' ')

  const hasAudioContent = Boolean(item.audioUrl) || Boolean(item.soundcloudEmbed)
  const hasVideoContent = Boolean(item.videoEmbed)
  const hasExternalUrl = Boolean(item.url)
  const hasImage = Boolean(item.image?.url)

  // Add a hidden audio element to preload metadata
  useEffect(() => {
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl)
      audio.preload = 'metadata'
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
    }
  }, [item.audioUrl])

  // Add a reset function to ensure consistent state when switching tracks
  const resetPlayerState = (newTime = 0) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime)

      // Add a seeking event to update the UI immediately during seeking
      audioRef.current.addEventListener('seeking', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      })

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0)

        // Reset UI immediately after metadata is loaded
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }

        if (isAudioVisible) {
          const playPromise = audioRef.current?.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                console.error('Playback failed:', error)
                setIsPlaying(false)
              })
          }
        }
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateTime)
        audioRef.current.removeEventListener('seeking', updateTime)
      }
    }
  }, [isAudioVisible, item.audioUrl]) // Add item.audioUrl as dependency to refresh when track changes

  useEffect(() => {
    // Immediately reset position display when audio becomes invisible
    if (!isAudioVisible) {
      resetPlayerState()
    }
  }, [isAudioVisible])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current && audioRef.current && duration) {
        const rect = progressBarRef.current.getBoundingClientRect()
        let position = (e.clientX - rect.left) / rect.width

        // Clamp position between 0 and 1
        position = Math.max(0, Math.min(1, position))

        const seekTime = position * duration
        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (isPlaying && audioRef.current) {
        audioRef.current.play()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, duration, isPlaying])

  const updateTime = () => {
    if (audioRef.current) {
      // Force UI update with the current audio position
      requestAnimationFrame(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      })
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const position = (e.clientX - rect.left) / rect.width
    const seekTime = position * duration

    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return

    setIsDragging(true)

    // Pause audio during drag for better performance
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
    }

    // Update position immediately on mouse down
    handleSeek(e)
  }

  const handlePlayClick = () => {
    if (!hasAudioContent) return

    if (isAudioVisible) {
      if (item.audioUrl && isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      }
      onAudioToggle()
    } else {
      onAudioToggle()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hasImage) {
      // Calculate position with offset to prevent image from being under cursor
      setCursorPosition({
        x: e.clientX + 20,
        y: e.clientY + 20,
      })
    }
  }

  const renderPlayButton = () => {
    if (!hasAudioContent) return null

    return (
      <button
        onClick={handlePlayClick}
        className="inline-flex items-center hover:opacity-75 transition-opacity"
      >
        {isPlaying && isAudioVisible ? 'PAUSE' : 'PLAY'}
      </button>
    )
  }

  const renderWatchButton = () => {
    if (!hasVideoContent) return null

    return (
      <button
        onClick={onVideoToggle}
        className="inline-flex items-center hover:opacity-75 transition-opacity"
      >
        {isVideoVisible ? 'HIDE' : 'WATCH'}
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
            href={item.url || '#'}
            target="_blank"
            className="hover:opacity-75"
            onMouseEnter={() => hasImage && setShowImage(true)}
            onMouseLeave={() => hasImage && setShowImage(false)}
            onMouseMove={handleMouseMove}
          >
            {titleContent}
          </Link>
          {/* <ExternalLinkIcon /> */}
        </div>
      )
    }

    return titleContent
  }

  const renderDuration = () => {
    if (!item.audioUrl) return item.duration || null

    if (duration > 0) {
      if (isAudioVisible && isPlaying) {
        return (
          <div className="text-right tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )
      }
      return <div className="tabular-nums text-right">{formatTime(duration)}</div>
    }

    return <div className="tabular-nums text-right">--:--</div>
  }

  const renderCell = (field: string) => {
    // Define which fields should be styled as secondary
    const secondaryFields = ['year', 'eventType', 'location', 'duration', 'type', 'date']
    const isSecondary = secondaryFields.includes(field)

    // Helper function to get opacity based on event type
    const getEventTypeOpacity = (type: string) => {
      const types = ['EP', 'LP', 'REMIX', 'VA', 'COMMISSION']
      const index = types.indexOf(type.toUpperCase())
      return index !== -1 ? (index + 2) * 20 : 60 // Default to 60% if type not found
    }

    switch (field) {
      case 'year':
        return isFirstOfYear ? (
          <span className={isSecondary ? 'text-[#98a1a6] text-opacity-70' : ''}>{item.year}</span>
        ) : null
      case 'play':
        return hasAudioContent ? (
          <button
            onClick={onAudioToggle}
            className="inline-flex items-center hover:opacity-75 transition-opacity text-[11px] text-[#98a1a6] text-opacity-70"
            aria-label={isAudioVisible ? 'Hide audio player' : 'Show audio player'}
          >
            {isAudioVisible ? 'PAUSE' : 'PLAY'}
          </button>
        ) : null
      case 'watch':
        return hasVideoContent ? (
          <button
            onClick={onVideoToggle}
            className="inline-flex items-center hover:opacity-75 transition-opacity"
            aria-label={isVideoVisible ? 'Hide video player' : 'Show video player'}
          >
            {isVideoVisible ? 'HIDE' : 'WATCH'}
          </button>
        ) : null
      case 'title':
        return (
          <div className="flex items-center gap-2">
            {item.url ? (
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                onMouseEnter={() => hasImage && setShowImage(true)}
                onMouseLeave={() => hasImage && setShowImage(false)}
                onMouseMove={handleMouseMove}
              >
                {item.title}
              </Link>
            ) : (
              <span
                onMouseEnter={() => hasImage && setShowImage(true)}
                onMouseLeave={() => hasImage && setShowImage(false)}
                onMouseMove={handleMouseMove}
              >
                {item.title}
              </span>
            )}
          </div>
        )
      case 'eventType':
        if (collectionType === 'events') {
          return (
            <span
              className={`inline-block w-2 h-2 rounded-full bg-[#98a1a6]`}
              style={{ opacity: getEventTypeOpacity(item.eventType) / 100 }}
            />
          )
        }
        return (
          <span className={isSecondary ? 'text-[#98a1a6] text-opacity-70' : ''}>
            {item.eventType}
          </span>
        )
      case 'duration':
        if (!hasAudioContent) return null
        if (item.audioUrl) {
          if (duration > 0) {
            if (isAudioVisible && isPlaying) {
              return (
                <div className="text-right tabular-nums text-[#98a1a6] text-opacity-70">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )
            }
            return (
              <div className="tabular-nums text-right text-[#98a1a6] text-opacity-70">
                {formatTime(duration)}
              </div>
            )
          }
        }
        return <div className="tabular-nums text-right text-[#98a1a6] text-opacity-70">--:--</div>
      default:
        return (
          <span className={isSecondary ? 'text-[#98a1a6] text-opacity-70' : ''}>{item[field]}</span>
        )
    }
  }

  const renderMediaPlayer = () => {
    if (isVideoVisible && item.videoEmbed) {
      return (
        <div
          className="w-[calc(100%-76px)] ml-[76px] my-4"
          dangerouslySetInnerHTML={{ __html: item.videoEmbed }}
        />
      )
    }

    if (isAudioVisible) {
      // Then prefer our own audio URL if available
      if (item.audioUrl) {
        return (
          <div
            className="grid gap-y-2 w-[calc(100%-76px)] ml-[76px] mb-4"
            style={{ gridTemplateColumns }}
          >
            <div></div>
            <div className="col-span-full">
              <div className="flex items-center">
                <div
                  ref={progressBarRef}
                  className="flex-grow h-[2px] bg-border cursor-pointer relative group"
                  onClick={handleSeek}
                  onMouseDown={handleMouseDown}
                  aria-label="Audio progress"
                  aria-valuemin={0}
                  aria-valuemax={duration || 100}
                  aria-valuenow={currentTime}
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                >
                  {/* Progress fill */}
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-foreground group-hover:bg-primary transition-colors"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      transition: isDragging ? 'none' : 'width 0.1s linear',
                    }}
                  />
                </div>
              </div>

              <audio
                ref={audioRef}
                className="hidden"
                crossOrigin="anonymous"
                preload="metadata"
                key={item.audioUrl}
                onLoadedMetadata={(e) => {
                  const audio = e.target as HTMLAudioElement
                  setDuration(audio.duration)
                }}
                onEnded={() => {
                  setIsPlaying(false)
                  resetPlayerState(0)
                  onAudioToggle()
                }}
                onError={(e) => {
                  console.error('Audio playback error:', e)
                }}
                src={item.audioUrl}
              />
            </div>
          </div>
        )
      }

      // Finally fall back to Soundcloud embed if available
      if (item.soundcloudEmbed) {
        return (
          <div
            className="w-[calc(100%-76px)] ml-[76px] my-4"
            dangerouslySetInnerHTML={{ __html: item.soundcloudEmbed }}
          />
        )
      }
    }

    return null
  }

  // Add helper function to get the thumbnail URL
  const getThumbnailUrl = (image: any): string => {
    // First check if the image has sizes.thumbnail (preferred)
    if (image?.sizes?.thumbnail?.url) {
      return image.sizes.thumbnail.url
    }

    // Some Payload configurations provide thumbnailURL directly
    if (image?.thumbnailURL) {
      return image.thumbnailURL
    }

    // Fallback to the original URL
    return image.url
  }

  return (
    <div className="contents">
      <div
        className="grid items-start w-full border-b border-transparent hover:bg-[rgba(152,161,166,0.05)] hover:border-[#98a1a6] hover:border-opacity-20"
        style={{ gridTemplateColumns }}
      >
        {columns.map(({ field }, index) => (
          <div
            key={field}
            className={`${field.toLowerCase()} ${index === columns.length - 1 ? 'text-right' : ''}`}
          >
            {renderCell(field)}
          </div>
        ))}
      </div>
      {(hasAudioContent || hasVideoContent) && renderMediaPlayer()}
      {/* Render the hovering image at the document level to avoid containment issues */}
      {hasImage && showImage && (
        <div
          className="fixed z-50 overflow-hidden pointer-events-none"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transition: 'left 0.05s, top 0.05s',
          }}
        >
          <Image
            src={getThumbnailUrl(item.image)}
            alt={item.title || 'Event image'}
            width={300}
            height={200}
            className="object-contain max-w-[300px] max-h-[200px] w-auto h-auto mix-blend-difference"
            style={{
              width: 'auto',
              height: 'auto',
            }}
            onError={() => {
              setShowImage(false)
              // Update hasImage to prevent future attempts
              item.image = null
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
