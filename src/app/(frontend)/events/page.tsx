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
      audioUrl: true,
      soundcloudEmbed: true,
      videoEmbed: true,
      eventType: true,
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
    { field: 'play', width: '60px' },
    { field: 'watch', width: '100px' },
    { field: 'title' },
    { field: 'eventType', width: '100px' },
    { field: 'location' },
    // { field: 'duration', width: '150px' },
  ]

  // Convert id to string and handle null values
  const items = events?.docs.map((item) => {
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

    // Map event type to display label
    const eventTypeLabels: Record<string, string> = {
      dj_set: 'DJ Set',
      live: 'Live',
      residency: 'Residency',
      n_a: 'N/A',
    }

    return {
      id: String(item.id),
      title: item.title,
      year: item.year,
      location: item.location,
      url: item.url || undefined,
      audioUrl: item.audioUrl || undefined,
      image,
      soundcloudEmbed: item.soundcloudEmbed || undefined,
      videoEmbed: item.videoEmbed || undefined,
      eventType: eventTypeLabels[item.eventType] || 'N/A',
    }
  })

  return <CollectionList columns={columns} items={items} collectionType="events" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Events`,
  }
}
