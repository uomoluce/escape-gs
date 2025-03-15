import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const events = await getPayloadData('events', {
    select: {
      title: true,
      year: true,
      location: true,
      url: true,
      audio: true,
      image: true,
    },
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '100px' },
    { field: 'title' },
    { field: 'location' },
    { field: 'duration', width: '150px' },
  ]

  return (
    <CollectionList title="Events" columns={columns} items={events?.docs} collectionType="events" />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Events`,
  }
}
