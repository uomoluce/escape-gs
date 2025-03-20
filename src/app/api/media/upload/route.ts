import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file
        return {
          allowedContentTypes: ['audio/*', 'video/*', 'image/*'],
          maximumSizeInBytes: 100000000, // 100MB
          tokenPayload: JSON.stringify({
            pathname,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        console.log('Upload completed:', blob.url)

        try {
          // Here you could update your database with the blob URL if needed
          if (typeof tokenPayload === 'string') {
            const { pathname } = JSON.parse(tokenPayload)
            console.log('Uploaded file pathname:', pathname)
          }
        } catch (error) {
          throw new Error('Could not process upload completion')
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    )
  }
}
