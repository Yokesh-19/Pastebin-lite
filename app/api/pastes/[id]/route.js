import { NextResponse } from 'next/server';
import { getPaste, getTestTime } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  
  // Handle test mode timing
  const currentTime = process.env.TEST_MODE === '1' 
    ? getTestTime(request.headers)
    : undefined;
  
  const paste = await getPaste(id, currentTime);
  
  if (!paste) {
    return NextResponse.json({ error: 'Paste not found or expired' }, { status: 404 });
  }
  
  return NextResponse.json(paste);
}