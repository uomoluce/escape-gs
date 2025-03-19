import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
import type { Media } from '@/payload-types'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const events = await getPayloadData('events', {
    select: {
      id: true,
      title: true,
      year: true,
      date: true,
      location: true,
      url: true,
      audio: true,
      soundcloudEmbed: true,
      image: {
        url: true,
        sizes: {
          thumbnail: {
            url: true,
          },
        },
      },
    },
    sort: '-year',
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '100px' },
    { field: 'title' },
    { field: 'location' },
    // { field: 'duration', width: '150px' },
  ]

  // Convert id to string and handle null values
  const items = events?.docs.map((item) => {
    // Only include audio if both url and mimeType are available
    const audio =
      typeof item.audio === 'object' && item.audio?.url && item.audio?.mimeType
        ? {
            url: item.audio.url,
            mimeType: item.audio.mimeType,
          }
        : undefined

    // Handle image format with proper null checks
    const image =
      typeof item.image === 'object' && item.image?.url
        ? {
            url: item.image.url,
            sizes: {
              thumbnail: item.image.sizes?.thumbnail?.url
                ? { url: item.image.sizes.thumbnail.url }
                : undefined,
            },
          }
        : null

    return {
      id: String(item.id),
      title: item.title,
      year: item.year,
      location: item.location,
      url: item.url || undefined,
      audio,
      image,
      soundcloudEmbed: item.soundcloudEmbed || undefined,
    }
  })

  return <CollectionList columns={columns} items={items} collectionType="events" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Events`,
  }
}
