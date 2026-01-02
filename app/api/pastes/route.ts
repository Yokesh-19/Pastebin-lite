import { NextRequest, NextResponse } from 'next/server';
import { createPaste, getTestTime } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required content
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json({ error: 'Content is required and must be non-empty' }, { status: 400 });
    }
    
    // Validate optional constraints
    if (body.ttl_seconds !== undefined) {
      if (typeof body.ttl_seconds !== 'number' || body.ttl_seconds < 1) {
        return NextResponse.json({ error: 'ttl_seconds must be >= 1' }, { status: 400 });
      }
    }
    
    if (body.max_views !== undefined) {
      if (typeof body.max_views !== 'number' || body.max_views < 1) {
        return NextResponse.json({ error: 'max_views must be >= 1' }, { status: 400 });
      }
    }
    
    // Handle test mode timing
    const currentTime = process.env.TEST_MODE === '1' 
      ? getTestTime(request.headers)
      : undefined;
    
    const id = await createPaste({
      content: body.content,
      ttl_seconds: body.ttl_seconds,
      max_views: body.max_views
    }, currentTime);
    
    // Get the base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const baseUrl = `${protocol}://${host}`;
    
    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}