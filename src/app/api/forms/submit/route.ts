import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendSubmissionEmail } from '@/lib/email';

export const runtime = 'nodejs';

const schema = z.object({
  form_key: z.string().min(1),
  mode: z.string().optional().default(''),
  data: z.record(z.any()).default({}),
  recaptcha_token: z.string().optional(),
  // simple honeypot — must be empty
  company_url: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid submission.' }, { status: 400 });
  }
  const { form_key, data, recaptcha_token, company_url } = parsed.data;

  // Honeypot
  if (company_url && company_url.trim() !== '') {
    return NextResponse.json({ ok: true }); // silently accept + drop
  }

  const admin = createSupabaseAdminClient();

  // Load the form (need recipients + whether recaptcha is required).
  const { data: form } = await admin
    .from('forms')
    .select('id, key, name, recipient_emails, recaptcha_enabled')
    .eq('key', form_key)
    .maybeSingle();

  if (!form) {
    return NextResponse.json({ ok: false, error: 'Unknown form.' }, { status: 404 });
  }

  // Verify reCAPTCHA if the form requires it.
  let score: number | null = null;
  if (form.recaptcha_enabled) {
    const result = await verifyRecaptcha(recaptcha_token);
    score = result.score;
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: 'Spam check failed. Please try again.' },
        { status: 400 },
      );
    }
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '';
  const userAgent = req.headers.get('user-agent') || '';

  const { error: insertError } = await admin.from('form_submissions').insert({
    form_id: form.id,
    form_key: form.key,
    data,
    recaptcha_score: score,
    ip_address: ip,
    user_agent: userAgent,
  });

  if (insertError) {
    return NextResponse.json({ ok: false, error: 'Could not save submission.' }, { status: 500 });
  }

  // Fire-and-forget email notification (no-op unless EMAIL_PROVIDER is set).
  try {
    await sendSubmissionEmail({
      formName: form.name,
      recipients: form.recipient_emails || [],
      data,
    });
  } catch {
    // never fail the request because email failed
  }

  return NextResponse.json({ ok: true });
}
