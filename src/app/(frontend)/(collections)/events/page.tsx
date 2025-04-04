import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
import type { Media } from '@/payload-types'
import type { Item } from '@/components/CollectionList/types'

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
    { field: 'watch', width: '60px' },
    { field: 'eventType', width: '40px' },
    { field: 'title', width: 'minmax(250px, 2fr)' },
    { field: 'location', width: 'minmax(120px, 1fr)' },
    { field: 'duration', width: '150px' },
  ]

  // Define all possible event types and their labels
  const eventTypeLabels: Record<string, string> = {
    dj_set: 'dj_set',
    live: 'live',
    residency: 'residency',
    n_a: 'n_a',
  }

  // Get unique event types and ensure all types are included
  const eventTypes = Object.entries(eventTypeLabels)

  const items: Item[] =
    events?.docs.map((item) => {
      const imageUrl =
        item.image && typeof item.image === 'object' ? (item.image as Media).url : null
      const thumbnailUrl =
        item.image && typeof item.image === 'object'
          ? (item.image as Media).sizes?.thumbnail?.url
          : null

      const imageData = imageUrl
        ? {
            url: imageUrl,
            sizes: thumbnailUrl
              ? {
                  thumbnail: {
                    url: thumbnailUrl,
                  },
                }
              : undefined,
            thumbnailURL: thumbnailUrl || undefined,
          }
        : null

      return {
        id: String(item.id),
        title: item.title,
        year: item.year,
        eventType: item.eventType,
        location: item.location,
        url: item.url || undefined,
        audioUrl: item.audioUrl || undefined,
        soundcloudEmbed: item.soundcloudEmbed || undefined,
        videoEmbed: item.videoEmbed || undefined,
        image: imageData,
      }
    }) || []

  return (
    <>
      <div className="flex justify-between py-1">
        {eventTypes.map(([type, label], index) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full bg-[#98a1a6] opacity-${(index + 2) * 20}`}
            />
            <span className="text-[11px] text-[#98a1a6] text-opacity-70 uppercase">{label}</span>
          </div>
        ))}
      </div>
      <div className="py-5">
        <CollectionList items={items} columns={columns} collectionType="events" />
      </div>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Events`,
  }
}
