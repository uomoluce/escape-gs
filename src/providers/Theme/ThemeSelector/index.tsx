'use client'

import React, { useEffect, useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { Moon, Sun } from 'lucide-react'

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!isMounted) return
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Use a simple placeholder during SSR
  if (!isMounted) {
    return (
      <button
        onClick={toggleTheme}
        className="p-0 bg-transparent border-0 cursor-pointer"
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </button>
    )
  }

  // Once mounted, show the actual button with current theme icon
  return (
    <button
      onClick={toggleTheme}
      className="p-0 bg-transparent border-0 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '☽' : '☼'}
    </button>
  )
}
