// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
// Import Vercel Blob storage only in production
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest, CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Discography } from './collections/Discography'
import { Mixes } from './collections/Mixes'
import { Events } from './collections/Events'
import { Curatorship } from './collections/Curatorship'
import { SoundDesign } from './collections/SoundDesign'
// import CircleLogo from './components/Logo/CircleLogo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Helper to hide a collection
const hideCollection = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  admin: {
    ...collection.admin,
    hidden: true,
  },
})

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      // graphics: {
      //   Logo: CircleLogo,
      // },
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // Database configuration optimized for serverless environment
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // SSL configuration - only enable in production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Connection pool settings optimized for migrations and serverless
      max: 3, // Allow more connections for migrations
      min: 0, // Start with no connections
      idleTimeoutMillis: 30000, // Longer timeout for migrations
      connectionTimeoutMillis: 30000, // Longer connection timeout for migrations
      allowExitOnIdle: true,
      keepAlive: true, // Enable keep-alive for more stable connections
    },
  }),
  collections: [
    hideCollection(Pages),
    Posts,
    Media,
    Categories,
    Users,
    Discography,
    Mixes,
    Events,
    Curatorship,
    SoundDesign,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header],
  plugins: [
    ...plugins,
    // Configure Vercel Blob Storage following best practices
    vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_dummy_123456789',
      collections: {
        [Media.slug]: {
          // Always use Vercel Blob in production
          disableLocalStorage: process.env.NODE_ENV === 'production',
          // Enable client-side uploads for large files
          clientUploads: true,
          // Add upload limits for client-side uploads
          limits: {
            fileSize: 26214400, // 25MB in bytes (leaving room for overhead)
          },
        },
      },
      // Enable client uploads globally
      clientUploads: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
