'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: defaultTheme,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [isMounted, setIsMounted] = useState(false)

  // Safe theme setter that works on client side only
  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (!canUseDOM) return // Don't run on server

    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference()
      document.documentElement.setAttribute('data-theme', implicitPreference || defaultTheme)
      if (implicitPreference) setThemeState(implicitPreference)
      else setThemeState(defaultTheme)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  // Handle initial theme setup (client-side only)
  useEffect(() => {
    if (!canUseDOM) return
    setIsMounted(true)

    // Check for user's stored preference
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    // If valid preference exists, use it
    if (themeIsValid(preference)) {
      setThemeState(preference)
      document.documentElement.setAttribute('data-theme', preference)
    }
    // Otherwise set the default theme (dark)
    else {
      setThemeState(defaultTheme)
      window.localStorage.setItem(themeLocalStorageKey, defaultTheme)
      document.documentElement.setAttribute('data-theme', defaultTheme)
    }
  }, [])

  return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
