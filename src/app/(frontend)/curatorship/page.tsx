import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
import type { Item } from '@/components/CollectionList/types'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const curatorship = await getPayloadData('curatorship', {
    select: {
      id: true,
      date: true,
      entity: true,
      role: true,
      url: true,
    },
  })

  const columns = [{ field: 'date', width: '200px' }, { field: 'entity' }, { field: 'role' }]

  // Map items to include required title field
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
