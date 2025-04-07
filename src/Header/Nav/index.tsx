'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-5 items-start">
      {navItems.map(({ link }, i) => {
        if (!link?.url) return null

        const isActive = pathname === link.url

        return (
          <Link
            key={i}
            href={link.url}
            target={link.newTab ? '_blank' : undefined}
            className={`nav-link hover:opacity-75 transition-opacity ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
