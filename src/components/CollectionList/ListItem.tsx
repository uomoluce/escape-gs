'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageIcon, PauseIcon, PlayIcon, X } from 'lucide-react'
import type { ListItemProps } from './types'
import { EmbedWrapper } from '@/components/EmbedWrapper'
import { ImageModal } from '@/components/ImageModal'
import { AudioPlayer } from '@/components/AudioPlayer'

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
  const [showImage, setShowImage] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const gridTemplateColumns = columns.map((col) => col.width || '1fr').join(' ')

  const hasAudioContent = Boolean(item.audioUrl) || Boolean(item.soundcloudEmbed)
  const hasVideoContent = Boolean(item.videoEmbed)
  const hasExternalUrl = Boolean(item.url)
  const hasImage = Boolean(item.image?.url)

  // Add a hidden audio element to preload metadata (original approach that was working)
  useEffect(() => {
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl)
      audio.preload = 'metadata'
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
    }
  }, [item.audioUrl])

  // Debug duration changes
  useEffect(() => {
    // Duration changed
  }, [duration, item.title])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    if (collectionType === 'events' && hasImage) {
      e.preventDefault()
      setShowImage(!showImage)
    }
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
            onClick={onAudioToggle}
            className="inline-flex items-center hover:opacity-75 transition-opacity text-[var(--secondary-text)] text-opacity-70"
            aria-label={isAudioVisible ? 'Hide audio player' : 'Show audio player'}
          >
            {isPlaying && isAudioVisible ? 'PAUSE' : 'PLAY'}
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
                className="hover:underline hover:opacity-75 transition-opacity"
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
        return (
          <div className="tabular-nums text-right text-[var(--secondary-text)] text-opacity-70">
            {isPlaying && isAudioVisible ? (
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            ) : (
              <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
            )}
          </div>
        )
      case 'date':
        return <span className="text-[var(--secondary-text)] text-opacity-70">{item[field]}</span>
      default:
        const fieldValue = item[field]
        const hasUrl = !!item.url
        if (hasUrl && item.url) {
          return (
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:opacity-75 transition-opacity"
            >
              {fieldValue}
            </Link>
          )
        }
        return (
          <span className={isSecondary ? 'text-[var(--secondary-text)] text-opacity-70' : ''}>
            {fieldValue}
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

    if (isAudioVisible && hasAudioContent) {
      return (
        <div className="w-full md:w-[calc(100%-60px)] md:ml-[60px] mb-4">
          <AudioPlayer
            audioUrl={item.audioUrl || ''}
            soundcloudEmbed={item.soundcloudEmbed}
            isVisible={isAudioVisible}
            onToggle={onAudioToggle}
            onEnded={onAudioToggle}
            onDurationChange={setDuration}
            onTimeUpdate={setCurrentTime}
            onPlayingStateChange={setIsPlaying}
            showControls={false}
          />
        </div>
      )
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
                onClick={onAudioToggle}
                className="flex items-center gap-1 hover:opacity-75 transition-opacity"
                aria-label={isAudioVisible ? 'Hide audio player' : 'Show audio player'}
              >
                {isAudioVisible ? (
                  <PauseIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                ) : (
                  <PlayIcon className="w-4 h-4 text-[var(--secondary-text)]" />
                )}
                <span className="text-[var(--secondary-text)] text-opacity-70">
                  {isAudioVisible ? 'HIDE' : 'PLAY'}
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

      {/* Hidden AudioPlayer for duration loading - only for custom audio URLs */}
      {item.audioUrl && (
        <div
          style={{
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            position: 'absolute',
            top: '-9999px',
          }}
        >
          <AudioPlayer
            audioUrl={item.audioUrl}
            isVisible={false}
            onToggle={() => {}}
            onEnded={() => {}}
            onDurationChange={setDuration}
            onTimeUpdate={setCurrentTime}
            onPlayingStateChange={setIsPlaying}
            showControls={false}
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
