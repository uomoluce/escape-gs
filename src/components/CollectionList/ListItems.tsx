'use client'

import React, { useState } from 'react'
import { ListItem } from './ListItem'
import type { Column, CollectionType, Item } from './types'

interface ListItemsProps {
  items: Item[]
  columns: Column[]
  collectionType?: CollectionType
}

export const ListItems = ({ items, columns, collectionType }: ListItemsProps) => {
  // Track which item is currently playing (if any)
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  return (
    <>
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          columns={columns}
          collectionType={collectionType}
          isAudioVisible={activeAudioId === item.id}
          isVideoVisible={activeVideoId === item.id}
          onAudioToggle={() => {
            setActiveAudioId(activeAudioId === item.id ? null : item.id)
            // Close video if open
            if (activeVideoId === item.id) {
              setActiveVideoId(null)
            }
          }}
          onVideoToggle={() => {
            setActiveVideoId(activeVideoId === item.id ? null : item.id)
            // Close audio if open
            if (activeAudioId === item.id) {
              setActiveAudioId(null)
            }
          }}
        />
      ))}
    </>
  )
}
