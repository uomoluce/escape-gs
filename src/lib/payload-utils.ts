import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { CollectionSlug } from 'payload'

export async function getPayloadData<T extends CollectionSlug>(collection: T, options = {}) {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection,
    depth: 1,
    pagination: false,
    overrideAccess: false,
    ...options,
  })
}
