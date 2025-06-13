import React from 'react'
import { EmbedWrapper } from '@/components/EmbedWrapper'

type Props = {
  className?: string
  html: string
}

export const EmbedBlock: React.FC<Props> = ({ className, html }) => {
  return (
    <div className={className}>
      <EmbedWrapper html={html} />
    </div>
  )
}
