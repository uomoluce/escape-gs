import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
import type { Media } from '@/payload-types'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const soundDesign = await getPayloadData('sound-design', {
    select: {
      id: true,
      year: true,
      date: true,
      title: true,
      platform: true,
      url: true,
      audio: true,
      soundcloudEmbed: true,
    },
    sort: '-year', // Sort by year in descending order
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '100px' },
    { field: 'title', width: 'minmax(250px, 2fr)' },
    { field: 'platform', width: 'minmax(120px, 1fr)' },
    // { field: 'duration', width: '150px' },
  ]

  // Convert id to string and handle null values
  const items = soundDesign?.docs.map((item) => {
    // Only include audio if both url and mimeType are available
    const audio =
      typeof item.audio === 'object' && item.audio?.url && item.audio?.mimeType
        ? {
            url: item.audio.url,
            mimeType: item.audio.mimeType,
          }
        : undefined

    return {
      id: String(item.id),
      title: item.title,
      year: item.year,
      platform: item.platform,
      url: item.url || undefined,
      audio,
      soundcloudEmbed: item.soundcloudEmbed || undefined,
    }
  })

  return <CollectionList columns={columns} items={items} collectionType="sound-design" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Sound Design`,
  }
}
