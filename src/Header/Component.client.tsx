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
      <div className="pt-8 pb-1 flex border-b border-[var(--border-color)] text-[var(--secondary-text)] dark:text-white">
        <div className="w-1/2">
          gs <br />
          b.1991, IT
        </div>
        {data.description && (
          <div className="w-1/2 text-[var(--secondary-text)] text-right">{data.description}</div>
        )}
        {/* leaving the theme selector out for now */}
        {/* <div className="w-1/3 text-right">
          <ThemeSelector />
        </div> */}
      </div>
      <div className="py-5">
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
