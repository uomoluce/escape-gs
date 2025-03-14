import type { Metadata } from 'next/types'
import React from 'react'
import { CollectionList } from '@/components/CollectionList'
import { getPayloadData } from '@/lib/payload-utils'
export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const discography = await getPayloadData('discography', {
    select: {
      title: true,
      year: true,
      label: true,
      type: true,
      duration: true,
      url: true,
    },
  })

  const columns = [
    { field: 'year', width: '100px' },
    { field: 'title' },
    { field: 'label' },
    { field: 'type' },
    // { field: 'duration', width: '100px' },
  ]

  console.log(discography, 'discography')

  return (
    <CollectionList
      title="Discography"
      columns={columns}
      items={discography?.docs}
      collectionType="discography"
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Discography`,
  }
}
