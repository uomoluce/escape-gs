'use client'

import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState('light')

  const toggleTheme = () => {
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    setTheme(newTheme)
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey) as Theme
    setCurrentTheme(preference)
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 bg-transparent"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {currentTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
