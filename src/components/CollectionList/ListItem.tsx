'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageIcon, PauseIcon, PlayIcon, X } from 'lucide-react'
import type { ListItemProps } from './types'
import { EmbedWrapper } from '@/components/EmbedWrapper'
import { ImageModal } from '@/components/ImageModal'

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

  const handleTitleClick = (e: React.MouseEvent) => {
    if (collectionType === 'events' && hasImage) {
      e.preventDefault()
      setShowImage(!showImage)
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
        className={`${hasImage && collectionType === 'events' ? 'hover:opacity-75 transition-opacity cursor-pointer' : ''}`}
        onClick={handleTitleClick}
      >
        {item.title}
      </span>
    )

    if (hasExternalUrl && item.url) {
      return (
        <Link href={item.url} className="hover:opacity-75 transition-opacity">
          {titleContent}
        </Link>
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
        return (
          <>
            {/* Mobile view - always show year */}
            <span className="md:hidden text-[var(--secondary-text)]">{item.year}</span>
            {/* Desktop view - only show first of year */}
            <span className="hidden md:inline text-[var(--secondary-text)]">
              {isFirstOfYear ? item.year : null}
            </span>
          </>
        )
      case 'play':
        return hasAudioContent ? (
          <button
            onClick={() => {
              if (isAudioVisible) {
                if (isPlaying) {
                  audioRef.current?.pause()
                  setIsPlaying(false)
                } else if (audioRef.current) {
                  audioRef.current.play()
                  setIsPlaying(true)
                }
              }
              onAudioToggle()
            }}
            className="inline-flex items-center hover:opacity-75 transition-opacity text-[var(--secondary-text)] text-opacity-70"
            aria-label={
              isAudioVisible ? (isPlaying ? 'Pause audio' : 'Play audio') : 'Show audio player'
            }
          >
            {isAudioVisible ? (isPlaying ? 'PAUSE' : 'PLAY') : 'PLAY'}
          </button>
        ) : null
      case 'watch':
        return hasVideoContent ? (
          <button
            onClick={onVideoToggle}
            className="inline-flex items-center hover:opacity-75 transition-opacity text-[var(--secondary-text)] text-opacity-70"
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
                className={`${hasImage && collectionType === 'events' ? 'hover:underline hover:opacity-75 transition-opacity cursor-pointer' : ''}`}
                onClick={handleTitleClick}
              >
                {item.title}
              </Link>
            ) : (
              <span
                onClick={handleTitleClick}
                className={`${hasImage && collectionType === 'events' ? 'hover:underline hover:opacity-75 transition-opacity cursor-pointer' : ''}`}
              >
                {item.title}
              </span>
            )}
          </div>
        )
      case 'eventType':
        if (collectionType === 'events') {
          // Custom opacity values for each type
          const opacityMap: Record<string, number> = {
            n_a: 0.2,
            residency: 0.4,
            live: 1.0,
            dj_set: 1.0,
          }
          const opacity = opacityMap[item.eventType?.toLowerCase() || ''] || 0.6
          return (
            <span
              className={`inline-block w-2 h-2 rounded-full bg-[var(--accent-color)]  ${
                item.eventType?.toLowerCase() === 'live'
                  ? 'border border-[var(--accent-color)] bg-transparent'
                  : ''
              }`}
              style={{ opacity }}
            />
          )
        }
        return (
          <span className={isSecondary ? 'text-[var(--secondary-text)] text-opacity-70' : ''}>
            {item.eventType}
          </span>
        )
      case 'duration':
        if (!hasAudioContent) return null
        if (item.audioUrl) {
          if (duration > 0) {
            if (isAudioVisible && isPlaying) {
              return (
                <div className="text-right tabular-nums text-[var(--secondary-text)] text-opacity-70">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )
            }
            return (
              <div className="tabular-nums text-right text-[var(--secondary-text)] text-opacity-70">
                {formatTime(duration)}
              </div>
            )
          }
        }
        return (
          <div className="tabular-nums text-right text-[var(--secondary-text)] text-opacity-70">
            --:--
          </div>
        )
      default:
        return (
          <span className={isSecondary ? 'text-[var(--secondary-text)] text-opacity-70' : ''}>
            {item[field]}
          </span>
        )
    }
  }

  const renderMediaPlayer = () => {
    if (isVideoVisible && item.videoEmbed) {
      return (
        <div className="w-full md:w-[calc(100%-120px)] md:ml-[120px] my-4">
          <EmbedWrapper html={item.videoEmbed} isDesktopOnly={true} />
        </div>
      )
    }

    if (isAudioVisible) {
      // Then prefer our own audio URL if available
      if (item.audioUrl) {
        return (
          <div className="w-full md:w-[calc(100%-60px)] md:ml-[60px] mb-4">
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
                setIsPlaying(false)
              }}
              src={item.audioUrl}
            />
          </div>
        )
      }

      // Finally fall back to Soundcloud embed if available
      if (item.soundcloudEmbed) {
        return (
          <div className="w-full md:w-[calc(100%-60px)] md:ml-[60px] my-4">
            <EmbedWrapper html={item.soundcloudEmbed} isDesktopOnly={true} />
          </div>
        )
      }
    }

    return null
  }

  const getImageUrl = (image: any): string => {
    if (!image?.url) return ''
    return image.sizes?.small?.url || image.url
  }

  return (
    <div className="contents">
      {/* Mobile view - single column */}
      <div className="md:hidden flex flex-col gap-1 py-4">
        {/* Render title and event type together */}
        <div className="flex items-center gap-1">
          {columns
            .filter(({ field }) => field === 'title')
            .map(({ field }) => (
              <div key={field} className={`${field.toLowerCase()} flex items-center gap-1`}>
                {renderCell(field)}
              </div>
            ))}
          {columns
            .filter(({ field }) => field === 'eventType')
            .map(({ field }) => (
              <div key={field} className={`${field.toLowerCase()} flex items-center`}>
                {renderCell(field)}
              </div>
            ))}
        </div>
        {/* Render other columns except play/watch, duration, and eventType */}
        {columns
          .filter(({ field }) => {
            // Always filter out play/watch, title (already rendered), duration (will be rendered last), and eventType (rendered with title)
            if (['play', 'watch', 'title', 'duration', 'eventType'].includes(field)) return false
            // Filter out date for events
            if (field === 'date' && collectionType === 'events') return false
            return true
          })
          .map(({ field }) => (
            <div key={field} className={`${field.toLowerCase()} flex items-center gap-1`}>
              <span className="text-[var(--secondary-text)] text-opacity-70">
                {field === 'eventType' ? 'Type' : field.charAt(0).toUpperCase() + field.slice(1)}:
              </span>
              {renderCell(field)}
            </div>
          ))}
        {/* Only show play/watch buttons if there's content */}
        {(hasAudioContent || hasVideoContent) && (
          <div className="flex items-center gap-4">
            {hasAudioContent && (
              <button
                onClick={handlePlayClick}
                className="flex items-center gap-1 hover:opacity-75 transition-opacity"
                aria-label={
                  isAudioVisible ? (isPlaying ? 'Pause audio' : 'Play audio') : 'Show audio player'
                }
              >
                {isAudioVisible ? (
                  isPlaying ? (
                    <PauseIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                  ) : (
                    <PlayIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                  )
                ) : (
                  <PlayIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                )}
                <span className="text-[var(--secondary-text)] text-opacity-70">
                  {isAudioVisible ? (isPlaying ? 'PAUSE' : 'PLAY') : 'PLAY'}
                </span>
              </button>
            )}
            {hasVideoContent && (
              <button
                onClick={onVideoToggle}
                className="flex items-center gap-1 hover:opacity-75 transition-opacity"
                aria-label={isVideoVisible ? 'Hide video player' : 'Show video player'}
              >
                {isVideoVisible ? (
                  <PauseIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                ) : (
                  <PlayIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                )}
                <span className="text-[var(--secondary-text)] text-opacity-70">
                  {isVideoVisible ? 'HIDE' : 'WATCH'}
                </span>
              </button>
            )}
          </div>
        )}
        {/* Render duration last if there's audio content */}
        {hasAudioContent && (
          <div className="flex items-center gap-1 justify-end">
            <span className="text-[var(--secondary-text)] text-opacity-70">Duration:</span>
            {renderCell('duration')}
          </div>
        )}
        {/* Render media player in mobile view */}
        {(hasAudioContent || hasVideoContent) && renderMediaPlayer()}
      </div>
      <div className="md:hidden border-b border-[var(--border-color)] border-opacity-20 hover:bg-[rgba(152,161,166,0.05)]" />

      {/* Desktop view - grid */}
      <div
        className="hidden md:grid items-start w-full border-b border-transparent hover:bg-[rgba(152,161,166,0.05)] hover:border-[#98a1a6] hover:border-opacity-20"
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
      {/* Render media player in desktop view */}
      <div className="hidden md:block">
        {(hasAudioContent || hasVideoContent) && renderMediaPlayer()}
      </div>

      <ImageModal
        isOpen={showImage}
        onClose={() => setShowImage(false)}
        imageUrl={getImageUrl(item.image)}
        alt={item.title || 'Event image'}
      />
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
