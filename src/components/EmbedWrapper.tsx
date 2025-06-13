import React from 'react'
import { cn } from '@/utilities/ui'

type EmbedWrapperProps = {
  html: string
  className?: string
  isDesktopOnly?: boolean
}

/**
 * A reusable component for safely embedding external content like videos or audio players
 * with proper responsive behavior on mobile and desktop
 */
export const EmbedWrapper: React.FC<EmbedWrapperProps> = ({
  html,
  className,
  isDesktopOnly = false,
}) => {
  return (
    <div
      className={cn('relative w-full overflow-hidden', isDesktopOnly ? 'md:w-auto' : '', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
