import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

// Configure Edge runtime
export const runtime = 'edge'

// Must start sending response within 25 seconds on Edge runtime
// This is different from maxDuration which only applies to serverless functions
export const maxDuration = 60

// Ensure fresh responses
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Disable body parsing since we're using direct upload to Blob storage
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request): Promise<NextResponse> {
  console.log('Upload request received')

  try {
    // This should only receive metadata, not the actual file
    const body = (await request.json()) as HandleUploadBody
    console.log('Processing token request')

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        console.log('Generating upload token for:', pathname)
        return {
          allowedContentTypes: ['audio/*', 'video/*', 'image/*'],
          maximumSizeInBytes: 26214400, // 25MB
          tokenPayload: JSON.stringify({
            pathname,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called after the direct upload to Blob storage completes
        console.log('Upload completed:', {
          url: blob.url,
          pathname: blob.pathname,
        })

        try {
          if (typeof tokenPayload === 'string') {
            const { pathname } = JSON.parse(tokenPayload)
            console.log('Upload pathname:', pathname)
          }
        } catch (error) {
          console.error('Error processing token payload:', error)
          throw new Error('Could not process upload completion')
        }
      },
    })

    console.log('Upload handler completed successfully')
    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
