import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
import type { Item } from '@/components/CollectionList/types'
export const dynamic = 'force-static'

export default async function Page() {
  const curatorship = await getPayloadData('curatorship', {
    select: {
      id: true,
      date: true,
      entity: true,
      role: true,
      url: true,
    },
    sort: '-date', // Sort by date in descending order
  })

  const columns = [
    { field: 'date', width: '200px' },
    { field: 'entity', width: 'minmax(250px, 2fr)' },
    { field: 'role', width: 'minmax(120px, 1fr)' },
  ]

  const items: Item[] = curatorship?.docs.map(({ id, date, entity, role, url }) => ({
    id: String(id),
    title: entity,
    date,
    entity,
    role,
    url: url || undefined,
  }))

  return <CollectionList columns={columns} items={items} collectionType="curatorship" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Curatorship`,
  }
}
