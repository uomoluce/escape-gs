import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'

// Configure Edge runtime for better performance
export const runtime = 'edge'

// Ensure fresh responses
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

interface UploadRequestBody {
  filename: string
  contentType: string
}

// Initialize S3 client with environment variables
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
  },
  forcePathStyle: true,
})

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const bucket = process.env.S3_BUCKET
    if (!bucket) {
      throw new Error('S3_BUCKET environment variable is not defined')
    }

    // Parse and validate request body
    const body = (await request.json()) as UploadRequestBody
    if (!body.filename || !body.contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: filename or contentType' },
        { status: 400 },
      )
    }

    // Use plain filename to match PayloadCMS expectations
    const key = body.filename

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: body.contentType,
      ACL: 'public-read',
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

    return NextResponse.json({
      url,
      key,
      bucket,
    })
  } catch (error) {
    console.error('S3 upload request failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 },
    )
  }
}
