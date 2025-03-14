'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface ListItemProps {
  item: any
  columns: Array<{ field: string; width?: string }>
  collectionType?: 'discography' | 'events' | 'curatorship' | 'default'
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
  const audioRef = useRef<HTMLAudioElement>(null)
  const gridTemplateColumns = columns.map((col) => col.width || '1fr').join(' ')

  const hasPlayableContent = item.media?.mimeType === 'audio/mpeg' || item.url
  const isClickableTitleType = ['discography', 'events', 'curatorship'].includes(collectionType)

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
    if (item.media?.mimeType === 'audio/mpeg') {
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
    } else if (item.url) {
      window.open(item.url, '_blank')
    }
  }

  const renderPlayButton = () => {
    if (isClickableTitleType) return null

    return (
      <button
        onClick={handlePlayClick}
        className={`inline-flex items-center ${hasPlayableContent ? 'hover:opacity-75' : 'opacity-90 cursor-not-allowed'}`}
        disabled={!hasPlayableContent}
      >
        {isPlaying && isAudioVisible ? 'PAUSE' : 'PLAY'}
        {item.url && !item.media?.mimeType && <ExternalLinkIcon />}
      </button>
    )
  }

  const renderTitle = () => {
    if (isClickableTitleType && item.url) {
      return (
        <Link href={item.url} target="_blank" className="hover:opacity-75">
          {item.title}
        </Link>
      )
    }
    return item.title
  }

  const renderCell = (field: string) => {
    if (field === 'play') return renderPlayButton()
    if (field === 'title') return renderTitle()
    return item[field]
  }

  const renderAudioPlayer = () => (
    <div
      className="grid gap-x-4 w-[cal(100%-116px)] ml-[116px] mb-3"
      style={{ gridTemplateColumns }}
    >
      <div></div>
      <div className="col-span-full flex items-center">
        <div className="flex-grow bg-gray-200 h-[2px]">
          <div
            className="bg-black h-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="ml-4 text-sm tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <audio
          ref={audioRef}
          className="hidden"
          onEnded={() => {
            setIsPlaying(false)
            setCurrentTime(0)
          }}
        >
          <source src={item.media.url} type="audio/mpeg" />
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
      {item.media?.mimeType === 'audio/mpeg' && isAudioVisible && renderAudioPlayer()}
    </div>
  )
}

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)
