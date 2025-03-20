import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

// Configure Edge runtime for better performance
export const runtime = 'edge'

// Ensure fresh responses
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.S3_REGION || '',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  // Enable acceleration for faster uploads
  useAccelerateEndpoint: true,
})

export async function POST(request: Request): Promise<NextResponse> {
  console.log('S3 upload request received')

  try {
    const { filename, contentType } = await request.json()
    console.log('Processing S3 upload request:', { filename, contentType })

    // Generate a unique key for the file
    const key = `${Date.now()}-${Math.random().toString(36).substring(2)}-${filename}`

    // Create the command for putting the object
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || '',
      Key: key,
      ContentType: contentType,
      // Set appropriate ACL
      ACL: 'public-read',
    })

    // Generate a presigned URL
    const url = await getSignedUrl(s3, command, {
      expiresIn: 3600, // URL expires in 1 hour
    })

    console.log('Generated presigned URL for:', key)

    return NextResponse.json({
      url,
      key,
      bucket: process.env.S3_BUCKET,
    })
  } catch (error) {
    console.error('S3 upload request failed:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
