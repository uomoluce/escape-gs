import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import type { CollectionBeforeChangeHook, Config, Plugin } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { CustomUpload } from './components/CustomUpload'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Discography } from './collections/Discography'
import { Mixes } from './collections/Mixes'
import { Events } from './collections/Events'
import { Curatorship } from './collections/Curatorship'
import { SoundDesign } from './collections/SoundDesign'
import { Header } from './Header/config'
import { Footer } from './Footer/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Runtime initialization function
const initializeStorage = (): Plugin => {
  const requiredS3EnvVars = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_REGION']
  const missingVars = requiredS3EnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(
      `Missing S3 environment variables: ${missingVars.join(', ')}. Falling back to Vercel Blob storage.`,
    )
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      return vercelBlobStorage({
        enabled: true,
        collections: {
          media: {
            disableLocalStorage: true,
          },
        },
        token: process.env.BLOB_READ_WRITE_TOKEN,
        clientUploads: true, // Enable client-side uploads to bypass 4.5MB limit
        addRandomSuffix: true, // Add random suffix to prevent naming conflicts
        cacheControlMaxAge: 31536000, // 1 year cache
      })
    }
    // Return a minimal storage plugin if no storage is configured
    return vercelBlobStorage({
      enabled: false,
      collections: {},
      token: '',
    })
  }

  return s3Storage({
    enabled: true,
    clientUploads: true,
    collections: {
      media: {
        disableLocalStorage: true,
        generateFileURL: ({ filename }) =>
          `https://s3.${process.env.S3_REGION}.amazonaws.com/${process.env.S3_BUCKET}/${filename}`,
      },
    },
    bucket: process.env.S3_BUCKET as string,
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      region: process.env.S3_REGION as string,
      forcePathStyle: true,
    },
  })
}

const hideCollection = (collection: any) => ({
  ...collection,
  admin: { ...collection.admin, hidden: true },
})

const beforeChangeHook: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' && req.file) {
    const file = req.file
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/s3-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.mimetype }),
    })
    if (!res.ok) throw new Error(`Failed to generate presigned URL: ${await res.text()}`)
    const { url, key } = await res.json()
    data.s3UploadUrl = url
    data.filename = key
    data.url = `https://s3.${process.env.S3_REGION}.amazonaws.com/${process.env.S3_BUCKET}/${key}`
  }
  return data
}

const MediaWithCustomUpload = {
  ...Media,
  fields: [...(Media.fields || []), { name: 's3UploadUrl', type: 'text', admin: { hidden: true } }],
  hooks: { beforeChange: [beforeChangeHook] },
  admin: {
    components: {
      Field: { upload: CustomUpload },
    },
  },
}

export default buildConfig({
  admin: {
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  debug: true,
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 3,
      min: 0,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
      allowExitOnIdle: true,
      keepAlive: true,
    },
  }),
  collections: [
    hideCollection(Pages),
    Posts,
    MediaWithCustomUpload,
    Categories,
    Users,
    Discography,
    Mixes,
    Events,
    Curatorship,
    SoundDesign,
  ],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL].filter(Boolean),
  globals: [Header, Footer],
  plugins: [...plugins, initializeStorage()],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
} satisfies Config)
