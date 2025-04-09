import React from 'react'

type Props = {
  className?: string
  html: string
}

export const EmbedBlock: React.FC<Props> = ({ className, html }) => {
  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
