import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
import type { Media } from '@/payload-types'
export const dynamic = 'force-static'

export default async function Page() {
  const discography = await getPayloadData('discography', {
    select: {
      id: true,
      title: true,
      year: true,
      label: true,
      type: true,
      url: true,
      audio: true,
    },
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '100px' },
    { field: 'title' },
    { field: 'label' },
    { field: 'type' },
  ]

  // Convert id to string and handle null values
  const items = discography?.docs.map((item) => {
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
      label: item.label,
      type: item.type,
      url: item.url || undefined,
      audio,
      soundcloudEmbed: undefined, // Explicitly set to undefined since we're not querying it
    }
  })

  return <CollectionList columns={columns} items={items} collectionType="discography" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Discography`,
  }
}
