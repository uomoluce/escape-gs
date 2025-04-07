'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import type { Header } from '@/payload-types'
import { HeaderNav } from './Nav'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <header className="container relative z-20">
      <div className="pt-8 pb-1 flex justify-between border-b border-[var(--border-color)] text-[var(--secondary-text)] dark:text-white">
        <>
          gs <br />
          b.1991, IT
        </>
        {/* <ThemeSelector /> */}
      </div>
      <div className="py-5">
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
