import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/** Admin-only: returns a short-lived signed URL for a private uploads file. */
export async function GET(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');
  if (!path) {
    return NextResponse.json({ ok: false, error: 'Missing path' }, { status: 400 });
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db.storage.from('uploads').createSignedUrl(path, 60);
  if (error || !data?.signedUrl) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.redirect(data.signedUrl);
}
