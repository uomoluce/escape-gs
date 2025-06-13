import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
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
      audioUrl: true,
      soundcloudEmbed: true,
      videoEmbed: true,
    },
    sort: '-year', // Sort by date in descending order
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '70px' },
    { field: 'watch', width: '80px' },
    { field: 'title', width: 'minmax(250px, 2fr)' },
    { field: 'label', width: 'minmax(120px, 1fr)' },
    { field: 'type', width: 'minmax(100px, 1fr)' },
  ]

  const items = discography?.docs.map((item) => ({
    id: String(item.id),
    title: item.title,
    year: item.year,
    label: item.label,
    type: item.type,
    url: item.url || undefined,
    audioUrl: item.audioUrl || undefined,
    soundcloudEmbed: item.soundcloudEmbed || undefined,
    videoEmbed: item.videoEmbed || undefined,
  }))

  return <CollectionList columns={columns} items={items} collectionType="discography" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Discography`,
  }
}
