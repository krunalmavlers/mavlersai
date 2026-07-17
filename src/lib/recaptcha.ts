import 'server-only';

interface VerifyResult {
  ok: boolean;
  score: number | null;
  reason?: string;
}

/**
 * Verify a reCAPTCHA v3 token server-side. If no secret key is configured we
 * fail OPEN in development (so local testing works without keys) but log it.
 */
export async function verifyRecaptcha(token: string | undefined): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');

  if (!secret) {
    console.warn('[recaptcha] RECAPTCHA_SECRET_KEY not set — skipping verification.');
    return { ok: true, score: null, reason: 'no-secret' };
  }
  if (!token) {
    return { ok: false, score: null, reason: 'missing-token' };
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
    });
    const data = (await res.json()) as { success: boolean; score?: number; 'error-codes'?: string[] };
    const score = typeof data.score === 'number' ? data.score : null;
    if (!data.success) {
      return { ok: false, score, reason: (data['error-codes'] || []).join(',') || 'verify-failed' };
    }
    if (score !== null && score < minScore) {
      return { ok: false, score, reason: 'low-score' };
    }
    return { ok: true, score };
  } catch (err) {
    return { ok: false, score: null, reason: 'network-error' };
  }
}
