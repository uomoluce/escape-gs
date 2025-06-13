import type { Metadata } from 'next'
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
    depth: 2,
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
      image: true,
    },
    populate: {
      image: {
        select: {
          id: true,
          url: true,
          filename: true,
        },
      },
    },
    sort: '-year',
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
            id: item.image.id,
            url: item.image.url,
            filename: item.image.filename,
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
