// This remains a server component
import React from 'react'
import { ListItems } from './ListItems'
import type { Column, CollectionType, Item } from './types'

interface Props {
  items: Item[]
  columns: Column[]
  collectionType?: CollectionType
}

/**
 * This component is used to display an archive of items in each collection:
 *  - discography
 *  - mixes
 *  - events
 *  - curatorship
 *  - sound design
 * Designed to look like a table, but really a list of items wrapped in a css grid
 */
export const CollectionList = ({
  items,
  columns: initialColumns,
  collectionType = 'default',
}: Props) => {
  // Do the audio check on the server
  const hasAudioContent = items.some(
    (item) => Boolean(item.audioUrl) || Boolean(item.soundcloudEmbed),
  )

  // Do the video check on the server
  const hasVideoContent = items.some((item) => Boolean(item.videoEmbed))

  // Filter columns on the server
  const columns = initialColumns.filter((col) => {
    if (!hasAudioContent && (col.field === 'play' || col.field === 'duration')) return false
    if (!hasVideoContent && col.field === 'watch') return false
    return true
  })

  return (
    <div className="container mb-20">
      <ListItems items={items} columns={columns} collectionType={collectionType} />
    </div>
  )
}
