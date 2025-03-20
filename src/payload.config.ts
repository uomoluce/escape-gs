// payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig, CollectionConfig } from 'payload'
import type { BeforeChangeHook } from 'payload/types'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// We'll create CustomUpload component later
// import { CustomUpload } from './components/CustomUpload'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { Discography } from './collections/Discography'
import { Mixes } from './collections/Mixes'
import { Events } from './collections/Events'
import { Curatorship } from './collections/Curatorship'
import { SoundDesign } from './collections/SoundDesign'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Hide collection helper
const hideCollection = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  admin: { ...collection.admin, hidden: true },
})

// BeforeChange hook for S3 upload
const beforeChangeHook: BeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' && req.files?.[0]) {
    const file = req.files[0]
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    if (!serverUrl) throw new Error('NEXT_PUBLIC_SERVER_URL is not defined')

    const res = await fetch(`${serverUrl}/api/media/s3-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.mimetype }),
    })
    if (!res.ok) throw new Error('Failed to generate presigned URL')
    const { url, key } = await res.json()
    data.s3UploadUrl = url
    data.filename = key

    const region = process.env.S3_REGION
    const bucket = process.env.S3_BUCKET
    if (!region || !bucket) throw new Error('S3 configuration is incomplete')

    data.url = `https://s3.${region}.amazonaws.com/${bucket}/${key}`
  }
  return data
}

// Enhanced Media collection
const MediaWithCustomUpload: CollectionConfig = {
  ...Media,
  fields: [...(Media.fields || []), { name: 's3UploadUrl', type: 'text', admin: { hidden: true } }],
  hooks: { beforeChange: [beforeChangeHook] },
  // Temporarily comment out CustomUpload until we create it
  // admin: {
  //   components: {
  //     Field: { upload: CustomUpload },
  //   },
  // },
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
      connectionString: process.env.DATABASE_URI || '',
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
  plugins: [
    ...plugins,
    s3Storage({
      enabled: true,
      clientUploads: true,
      collections: {
        media: {
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => {
            const region = process.env.S3_REGION
            const bucket = process.env.S3_BUCKET
            if (!region || !bucket) throw new Error('S3 configuration is incomplete')
            return `https://s3.${region}.amazonaws.com/${bucket}/${filename}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        forcePathStyle: true,
      },
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: false, // For legacy access only
            collections: {},
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
