import { withPayload } from '@payloadcms/next/withPayload'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true, // Enable for the media collection
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
