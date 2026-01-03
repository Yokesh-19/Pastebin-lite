import { NextResponse } from 'next/server';
import { checkHealth } from '@/lib/db';

export async function GET() {
  const isHealthy = await checkHealth();
  
  if (!isHealthy) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  
  return NextResponse.json({ ok: true });
}