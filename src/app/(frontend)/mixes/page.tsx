import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const mixes = await getPayloadData('mixes', {
    select: {
      year: true,
      date: true,
      title: true,
      platform: true,
      url: true,
      audio: true,
    },
  })

  const columns = [
    { field: 'year', width: '60px' },
    { field: 'play', width: '100px' },
    { field: 'title' },
    { field: 'platform' },
    { field: 'duration', width: '150px' },
  ]

  return (
    <CollectionList 
      title="Selected Mixes" 
      columns={columns} 
      items={mixes?.docs} 
      collectionType="mixes" 
      sortBy="year"
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Selected Mixes`,
  }
}
