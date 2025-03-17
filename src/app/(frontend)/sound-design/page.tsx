import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const soundDesign = await getPayloadData('sound-design', {
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
      title="Sound Design" 
      columns={columns} 
      items={soundDesign?.docs} 
      collectionType="sound-design" 
      sortBy="year" 
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Sound Design`,
  }
}
