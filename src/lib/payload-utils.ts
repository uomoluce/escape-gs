import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadData(collection: string, options = {}) {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection,
    depth: 1,
    limit: 12,
    overrideAccess: false,
    ...options,
  })
}
