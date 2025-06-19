'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { PauseIcon, PlayIcon } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
  soundcloudEmbed?: string
  isVisible: boolean
  onToggle: () => void
  onEnded?: () => void
  onDurationChange?: (duration: number) => void
  onTimeUpdate?: (currentTime: number) => void
  onPlayingStateChange?: (isPlaying: boolean) => void
  className?: string
  showControls?: boolean
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  soundcloudEmbed,
  isVisible,
  onToggle,
  onEnded,
  onDurationChange,
  onTimeUpdate,
  onPlayingStateChange,
  className = '',
  showControls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const hasAudioContent = Boolean(audioUrl) || Boolean(soundcloudEmbed)

  // Stable event handlers using useCallback to prevent recreation
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      onTimeUpdate?.(audioRef.current.currentTime)
    }
  }, [onTimeUpdate])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      onDurationChange?.(audioRef.current.duration)
    }
  }, [onDurationChange])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    onPlayingStateChange?.(true)
  }, [onPlayingStateChange])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    onPlayingStateChange?.(false)
  }, [onPlayingStateChange])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    onPlayingStateChange?.(false)
    onEnded?.()
  }, [onPlayingStateChange, onEnded])

  // Set up event listeners once with stable references
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handlePlay, handlePause, handleEnded])

  // Auto-play when audio becomes visible
  useEffect(() => {
    if (isVisible && audioUrl && audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }, [isVisible, audioUrl, isPlaying])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Click-to-seek functionality
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !duration) return

      const rect = e.currentTarget.getBoundingClientRect()
      const position = (e.clientX - rect.left) / rect.width
      const seekTime = Math.max(0, Math.min(position * duration, duration))

      audioRef.current.currentTime = seekTime
    },
    [duration],
  )

  // Drag-to-seek functionality
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !duration) return
      setIsDragging(true)
      handleSeek(e)
    },
    [duration, handleSeek],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !audioRef.current || !duration || !progressBarRef.current) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const position = (e.clientX - rect.left) / rect.width
      const seekTime = Math.max(0, Math.min(position * duration, duration))

      audioRef.current.currentTime = seekTime
    },
    [isDragging, duration],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Global mouse listeners for dragging outside the progress bar
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handlePlayClick = useCallback(() => {
    if (!hasAudioContent || !audioRef.current) return

    if (isVisible) {
      if (audioUrl) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch(() => {
            // Ignore play errors
          })
        }
      }
    } else {
      onToggle()
    }
  }, [hasAudioContent, isVisible, audioUrl, isPlaying, onToggle])

  const renderPlayButton = () => {
    if (!hasAudioContent || !showControls) return null

    return (
      <button
        onClick={handlePlayClick}
        className="flex items-center gap-1 hover:opacity-75 transition-opacity"
        aria-label={isVisible ? (isPlaying ? 'Pause audio' : 'Play audio') : 'Show audio player'}
      >
        {isVisible ? (
          isPlaying ? (
            <PauseIcon className="w-4 h-4 text-[var(--secondary-text)]" />
          ) : (
            <PlayIcon className="w-4 h-4 text-[var(--secondary-text)]" />
          )
        ) : (
          <PlayIcon className="w-4 h-4 text-[var(--secondary-text)]" />
        )}
        <span className="text-[var(--secondary-text)] text-opacity-70">
          {isVisible ? (isPlaying ? 'PAUSE' : 'PLAY') : 'PLAY'}
        </span>
      </button>
    )
  }

  const renderDuration = () => {
    if (!audioUrl) return null

    if (duration > 0) {
      if (isVisible && isPlaying) {
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

    return (
      <div className="tabular-nums text-right text-[var(--secondary-text)] text-opacity-70">
        --:--
      </div>
    )
  }

  const renderAudioPlayer = () => {
    if (!isVisible) return null

    // Prefer our own audio URL if available
    if (audioUrl) {
      return (
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
      )
    }

    // Fall back to Soundcloud embed if available
    if (soundcloudEmbed) {
      return (
        <div className="w-full">
          <div className="w-full" dangerouslySetInnerHTML={{ __html: soundcloudEmbed }} />
        </div>
      )
    }

    return null
  }

  if (!hasAudioContent) return null

  return (
    <div className={className}>
      {showControls && (
        <div className="flex items-center gap-4 mb-2">
          {renderPlayButton()}
          {renderDuration()}
        </div>
      )}
      {renderAudioPlayer()}

      {/* Hidden audio element - always render to ensure stable reference and load metadata */}
      {audioUrl && (
        <audio
          ref={audioRef}
          style={{ position: 'absolute', top: '-9999px', width: '1px', height: '1px' }}
          preload="metadata"
          src={audioUrl}
        />
      )}
    </div>
  )
}
