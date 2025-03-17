import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  try {
    // Get all blobs to search through them
    // This works better for smaller blob stores (up to a few hundred files)
    const { blobs } = await list();
    
    // Search for files that match or contain our filename
    const matchingBlobs = blobs.filter(blob => {
      const pathParts = blob.pathname.split('/');
      const blobFilename = pathParts[pathParts.length - 1];
      
      // Check if pathname ends with our filename
      return blob.pathname.endsWith(`/${filename}`) || 
             blob.pathname === filename ||
             blobFilename === filename ||
             blob.pathname === `media/${filename}`;
    });
    
    // Sort matching blobs by most specific match first
    const sortedBlobs = matchingBlobs.sort((a, b) => {
      // Exact matches should come first
      if (a.pathname === `media/${filename}` || a.pathname === filename) return -1;
      if (b.pathname === `media/${filename}` || b.pathname === filename) return 1;
      return 0;
    });
    
    // Use the best match or fallback to any match
    const blob = sortedBlobs[0];
    
    if (blob) {
      // If found, redirect to the Vercel Blob URL
      return NextResponse.redirect(blob.url);
    }
    
    // If nothing found, return a 404
    return new NextResponse('File not found', { status: 404 });
  } catch (error) {
    console.error('Error serving file from Vercel Blob:', error);
    return new NextResponse('Error serving file', { status: 500 });
  }
}

// Required for dynamic routes
export const dynamic = 'force-dynamic'; 