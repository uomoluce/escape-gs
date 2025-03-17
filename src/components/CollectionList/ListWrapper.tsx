'use client'

import React, { useState } from 'react'
import { ListItem } from './ListItem'

interface Props {
  items: any[]
  columns: Array<{ field: string; width?: string }>
  collectionType?: 'discography' | 'events' | 'curatorship' | 'mixes' | 'sound-design' | 'default'
}

export const ListWrapper: React.FC<Props> = ({ items, columns, collectionType = 'default' }) => {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null)

  const handleAudioToggle = (id: string) => {
    setActiveAudioId(activeAudioId === id ? null : id)
  }

  return (
    <>
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          columns={columns}
          collectionType={collectionType}
          isAudioVisible={activeAudioId === item.id}
          onAudioToggle={() => handleAudioToggle(item.id)}
        />
      ))}
    </>
  )
}
