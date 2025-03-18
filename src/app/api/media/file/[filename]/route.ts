import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  try {
    // Use a more efficient approach with targeted searches instead of fetching all blobs
    
    // 1. Try exact matches first with common patterns (most efficient)
    const searchPatterns = [
      `media/${filename}`,  // Standard media path
      filename,             // Direct filename
    ];
    
    // Try each pattern in order - return on first match
    for (const pattern of searchPatterns) {
      const { blobs } = await list({ prefix: pattern, limit: 1 });
      if (blobs.length > 0 && blobs[0]) {
        return NextResponse.redirect(blobs[0].url);
      }
    }
    
    // 2. If exact patterns fail, try a more flexible search but with limit
    // Extract the base filename without extension for a broader search
    const filenameParts = filename.split('.');
    const baseFilename = filenameParts.length > 1 
      ? filenameParts.slice(0, -1).join('.') 
      : filename;
      
    const { blobs } = await list({ prefix: baseFilename, limit: 10 });
    
    // Find a close match if possible
    const blob = blobs.find(b => 
      b.pathname.includes(filename) || 
      b.pathname.endsWith(`/${filename}`)
    );
    
    if (blob) {
      return NextResponse.redirect(blob.url);
    }
    
    // If not found, return a 404
    return new NextResponse('File not found', { status: 404 });
  } catch (error) {
    console.error('Error serving file from Vercel Blob:', error);
    return new NextResponse('Error serving file', { status: 500 });
  }
}

// Required for dynamic routes
export const dynamic = 'force-dynamic'; 