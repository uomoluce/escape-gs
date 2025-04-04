'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex justify-between gap-5 items-start">
      {navItems.map(({ link }, i) => {
        if (!link?.url) return null

        return (
          <Link
            key={i}
            href={link.url}
            target={link.newTab ? '_blank' : undefined}
            className="nav-link hover:opacity-75 transition-opacity text-gray-800"
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
