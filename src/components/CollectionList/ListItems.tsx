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
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  return (
    <>
      {items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          columns={columns}
          collectionType={collectionType}
          isAudioVisible={activeItemId === item.id}
          onAudioToggle={() => {
            setActiveItemId(activeItemId === item.id ? null : item.id)
          }}
        />
      ))}
    </>
  )
}
