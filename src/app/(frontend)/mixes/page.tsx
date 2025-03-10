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
      title: true,
      platform: true,
    },
  })

  const columns = [{ field: 'year', width: '100px' }, { field: 'title' }, { field: 'platform' }]

  return <CollectionList title="Selected Mixes" columns={columns} items={mixes?.docs} />
}

export function generateMetadata(): Metadata {
  return {
    title: `Selected Mixes`,
  }
}
