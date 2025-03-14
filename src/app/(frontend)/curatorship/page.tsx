import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const curatorship = await getPayloadData('curatorship', {
    select: {
      date: true,
      entity: true,
      role: true,
      url: true,
    },
  })

  const columns = [{ field: 'date', width: '200px' }, { field: 'entity' }, { field: 'role' }]

  return (
    <CollectionList
      title="Curatorship"
      columns={columns}
      items={curatorship?.docs}
      collectionType="curatorship"
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Curatorship`,
  }
}
