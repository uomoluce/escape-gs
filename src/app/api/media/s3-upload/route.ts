import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Validate environment variables
const requiredEnvVars = ['S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_BUCKET']
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

const s3 = new S3Client({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
})

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { filename, contentType } = await request.json()
    if (!filename || !contentType) throw new Error('Missing filename or contentType')

    const key = filename

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET as string, // Also assert here
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    return NextResponse.json({ url, key, bucket: process.env.S3_BUCKET })
  } catch (error) {
    console.error('S3 upload request failed:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
