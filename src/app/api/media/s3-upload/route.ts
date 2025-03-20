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
  forcePathStyle: true,
})

export async function POST(request: Request): Promise<NextResponse> {
  console.log('S3 upload request received')

  try {
    const { filename, contentType } = await request.json()
    console.log('Processing S3 upload request:', { filename, contentType })

    // Create the command for putting the object
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || '',
      Key: filename,
      ContentType: contentType,
      // Set appropriate ACL
      ACL: 'public-read',
    })

    // Generate a presigned URL
    const url = await getSignedUrl(s3, command, {
      expiresIn: 3600, // URL expires in 1 hour
    })

    console.log('Generated presigned URL for:', filename)

    return NextResponse.json({
      url,
      key: filename,
      bucket: process.env.S3_BUCKET,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
