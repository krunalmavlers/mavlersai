import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
// Cached hard at the edge; uploaded filenames are unique (uuid-prefixed).
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * Serves media stored in the Supabase `media` bucket under our own domain,
 * e.g. https://mavlers.ai/images/content/<uuid>-name.png
 *
 * Storage stays in Supabase; only the public URL is rebranded to our domain.
 */
export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } },
) {
  const objectPath = (params.path || []).map(decodeURIComponent).join('/');
  if (!objectPath || objectPath.includes('..')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db.storage.from('media').download(objectPath);
  if (error || !data) {
    return new NextResponse('Not found', { status: 404 });
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': data.type || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
