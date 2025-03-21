import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

const requiredEnvVars = ['S3_BUCKET', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION']

export async function POST(req: Request) {
  // Check for required environment variables
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
  if (missingVars.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: `S3 upload is not configured. Missing environment variables: ${missingVars.join(', ')}`,
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }

  try {
    const { filename, contentType } = await req.json()

    if (!filename || !contentType) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: filename and contentType' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Let AWS SDK automatically pick up credentials from environment variables
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
    })

    const key = `${Date.now()}-${filename}`
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return new NextResponse(JSON.stringify({ url, key }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to generate presigned URL' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
