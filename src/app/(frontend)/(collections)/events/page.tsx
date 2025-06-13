import type { Metadata } from 'next/types'
import React from 'react'
import { getPayloadData } from '@/lib/payload-utils'
import type { Media } from '@/payload-types'
import type { Item } from '@/components/CollectionList/types'
import { EventsPage } from './page.client'
import { CollectionList } from '@/components/CollectionList'

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
    sort: '-year', // Sort by date in descending order
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '70px' },
    { field: 'watch', width: '80px' },
    { field: 'eventType', width: '60px' },
    { field: 'title', width: '1fr' },
    { field: 'location', width: '1fr' },
    { field: 'duration', width: '150px' },
  ]

  const items: Item[] =
    events?.docs.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      year: item.year,
      eventType: item.eventType,
      location: item.location,
      url: item.url || undefined,
      audioUrl: item.audioUrl || undefined,
      soundcloudEmbed: item.soundcloudEmbed || undefined,
      videoEmbed: item.videoEmbed || undefined,
      image: item.image
        ? {
            url: item.image.url,
            sizes: item.image.sizes?.thumbnail
              ? {
                  thumbnail: {
                    url: item.image.sizes.thumbnail.url,
                  },
                }
              : undefined,
          }
        : null,
    })) || []

  return (
    <EventsPage>
      <CollectionList items={items} columns={columns} collectionType="events" />
    </EventsPage>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Events`,
  }
}
