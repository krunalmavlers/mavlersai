import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getCurrentAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'application/pdf',
]);

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'image';
}

/**
 * Admin-only image upload for rich content (blog bodies, section HTML, etc.).
 * Stores in the PUBLIC `media` bucket and returns a public URL.
 */
export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid upload.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file provided.' }, { status: 400 });
  }
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: 'Unsupported file type.' }, { status: 400 });
  }
  const isPdf = file.type === 'application/pdf';
  const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: `File is larger than ${isPdf ? '25' : '8'} MB.` },
      { status: 400 },
    );
  }

  const db = createSupabaseAdminClient();
  const path = `content/${randomUUID()}-${safeName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage.from('media').upload(path, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: 'Upload failed.' }, { status: 500 });
  }

  const { data } = db.storage.from('media').getPublicUrl(path);
  // Serve through our own domain (mavlers.ai/images/...) instead of the raw
  // Supabase URL. `supabaseUrl` is kept as a fallback / reference.
  return NextResponse.json({
    ok: true,
    url: `/images/${path}`,
    path: `/images/${path}`,
    supabaseUrl: data.publicUrl,
  });
}
