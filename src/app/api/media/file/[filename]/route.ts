import { NextRequest } from 'next/server'
import { list } from '@vercel/blob'
import { notFound } from 'next/navigation'

export const runtime = 'edge'

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename

  try {
    // Search for the blob in Vercel Blob storage
    const { blobs } = await list({
      prefix: filename,
      limit: 1,
    })

    const blob = blobs[0]
    if (!blob) {
      return notFound()
    }

    // Redirect to the blob's URL
    return Response.redirect(blob.url)
  } catch (error) {
    console.error('Error fetching blob:', error)
    return new Response('Error fetching file', { status: 500 })
  }
}

// Required for dynamic routes
export const dynamic = 'force-dynamic'
