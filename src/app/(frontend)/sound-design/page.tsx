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
      title: true,
      platform: true,
      media: true,
      url: true,
    },
  })

  const columns = [{ field: 'year', width: '100px' }, { field: 'title' }, { field: 'platform' }]

  return <CollectionList title="Sound Design" columns={columns} items={soundDesign?.docs} />
}

export function generateMetadata(): Metadata {
  return {
    title: `Sound Design`,
  }
}
