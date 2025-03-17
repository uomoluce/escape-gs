import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: {
    filename: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  const filename = context.params.filename;
  
  try {
    // List blobs with the specified filename prefix
    const { blobs } = await list({
      prefix: `media/${filename}`
    });

    // Find the exact blob that matches our filename
    const blob = blobs.find(b => b.pathname === `media/${filename}` || b.pathname.endsWith(`/${filename}`));
    
    if (blob) {
      // If found in Vercel Blob, redirect to the Vercel Blob URL
      console.log(`File ${filename} found in Vercel Blob, redirecting to: ${blob.url}`);
      return NextResponse.redirect(blob.url);
    }
    
    // If not found in Vercel Blob, return a 404
    console.log(`File ${filename} not found in Vercel Blob`);
    return new NextResponse('File not found', { status: 404 });
  } catch (error) {
    console.error('Error serving file from Vercel Blob:', error);
    return new NextResponse('Error serving file', { status: 500 });
  }
}

// Required for dynamic routes
export const dynamic = 'force-dynamic'; 