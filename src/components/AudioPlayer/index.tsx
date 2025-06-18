'use client'

import React, { useState, useRef, useEffect } from 'react'
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

  // Debug component mounting
  useEffect(() => {
    // Component mounted/updated
  }, [audioUrl, isVisible])

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
        onDurationChange?.(audioRef.current?.duration || 0)

        // Reset UI immediately after metadata is loaded
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }

        if (isVisible) {
          const playPromise = audioRef.current?.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
                onPlayingStateChange?.(true)
              })
              .catch((error) => {
                console.error('Playback failed:', error)
                setIsPlaying(false)
                onPlayingStateChange?.(false)
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
  }, [isVisible, audioUrl])

  // Add global mouse up listener for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current) {
        // Convert global mouse position to local progress bar position
        const rect = progressBarRef.current.getBoundingClientRect()
        const position = (e.clientX - rect.left) / rect.width
        const seekTime = Math.max(0, Math.min(position * duration, duration))

        if (audioRef.current) {
          audioRef.current.currentTime = seekTime
          setCurrentTime(seekTime)
        }
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging && audioRef.current) {
        // Update isPlaying state to match the actual audio state
        const newPlayingState = !audioRef.current.paused
        setIsPlaying(newPlayingState)
        onPlayingStateChange?.(newPlayingState)
        setIsDragging(false)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, duration])

  useEffect(() => {
    // Immediately reset position display when audio becomes invisible
    if (!isVisible) {
      resetPlayerState()
    }
  }, [isVisible])

  const updateTime = () => {
    if (audioRef.current) {
      // Force UI update with the current audio position
      requestAnimationFrame(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime
          setCurrentTime(currentTime)
          onTimeUpdate?.(currentTime)
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

    // Update position immediately on mouse down
    handleSeek(e)
  }

  const handlePlayClick = () => {
    if (!hasAudioContent) return

    if (isVisible) {
      if (audioUrl && isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
        onPlayingStateChange?.(false)
      }
      onToggle()
    } else {
      onToggle()
    }
  }

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

      {/* Hidden audio element - always render to load duration */}
      {audioUrl && (
        <audio
          ref={audioRef}
          style={{ position: 'absolute', top: '-9999px', width: '1px', height: '1px' }}
          preload="metadata"
          key={audioUrl}
          onLoadStart={() => {
            // Audio load started
          }}
          onLoadedMetadata={(e) => {
            const audio = e.target as HTMLAudioElement
            setDuration(audio.duration)
            onDurationChange?.(audio.duration)
          }}
          onCanPlay={() => {
            // Audio can play
          }}
          onEnded={() => {
            setIsPlaying(false)
            onPlayingStateChange?.(false)
            resetPlayerState(0)
            onEnded?.()
          }}
          onError={(e) => {
            console.error('AudioPlayer: Audio playback error:', e)
            setIsPlaying(false)
            onPlayingStateChange?.(false)
          }}
          src={audioUrl}
        />
      )}
    </div>
  )
}
