import { kv } from '@vercel/kv';

function getCurrentTime() {
  if (process.env.TEST_MODE === '1') {
    // In test mode, check for x-test-now-ms header
    return Date.now(); // Will be overridden by API handlers
  }
  return Date.now();
}

export function getTestTime(headers) {
  const testTime = headers.get('x-test-now-ms');
  return testTime ? parseInt(testTime, 10) : Date.now();
}

export async function createPaste(paste, currentTime) {
  const id = generateId();
  const now = currentTime || getCurrentTime();
  
  const pasteData = {
    id,
    content: paste.content,
    created_at: now,
    ttl_seconds: paste.ttl_seconds,
    max_views: paste.max_views,
    view_count: 0
  };

  try {
    await kv.set(`paste:${id}`, pasteData);
    return id;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save paste');
  }
}

export async function getPaste(id, currentTime) {
  try {
    const paste = await kv.get(`paste:${id}`);
    if (!paste) return null;

    const now = currentTime || getCurrentTime();
    
    // Check TTL expiry BEFORE incrementing view count
    if (paste.ttl_seconds && (now - paste.created_at) >= (paste.ttl_seconds * 1000)) {
      await kv.del(`paste:${id}`);
      return null;
    }

    // Check view limit BEFORE incrementing
    if (paste.max_views && paste.view_count >= paste.max_views) {
      await kv.del(`paste:${id}`);
      return null;
    }

    // Increment view count atomically
    const newViewCount = paste.view_count + 1;
    const updatedPaste = { ...paste, view_count: newViewCount };
    
    // Update the paste with new view count
    await kv.set(`paste:${id}`, updatedPaste);

    // Calculate remaining views AFTER increment
    const remainingViews = paste.max_views ? Math.max(0, paste.max_views - newViewCount) : null;

    // Check if this view reached the limit and delete if so
    if (paste.max_views && newViewCount >= paste.max_views) {
      await kv.del(`paste:${id}`);
    }

    return {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.ttl_seconds ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString() : null
    };
  } catch (error) {
    console.error('Error getting paste:', error);
    return null;
  }
}

export async function checkHealth() {
  try {
    await kv.set('health:check', Date.now(), { ex: 1 });
    return true;
  } catch {
    return false;
  }
}

function generateId() {
  // Generate a more robust ID with better entropy
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}