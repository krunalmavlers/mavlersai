import 'server-only';

interface SubmissionEmail {
  formName: string;
  recipients: string[];
  data: Record<string, unknown>;
}

/**
 * Send a notification email for a form submission.
 *
 * Email is OFF by default (EMAIL_PROVIDER=none) — submissions are still stored
 * in the database. To enable, set EMAIL_PROVIDER=resend and RESEND_API_KEY.
 * The Resend path uses the REST API directly (no extra dependency).
 */
export async function sendSubmissionEmail({
  formName,
  recipients,
  data,
}: SubmissionEmail): Promise<{ sent: boolean; reason?: string }> {
  const provider = (process.env.EMAIL_PROVIDER || 'none').toLowerCase();
  if (provider === 'none' || recipients.length === 0) {
    return { sent: false, reason: 'disabled' };
  }

  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'Mavlers.ai <onboarding@resend.dev>';
    if (!apiKey) return { sent: false, reason: 'no-api-key' };

    const rows = Object.entries(data)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${escapeHtml(k)}</b></td><td style="padding:4px 0">${escapeHtml(String(v ?? ''))}</td></tr>`)
      .join('');
    const html = `<h2>New submission — ${escapeHtml(formName)}</h2><table>${rows}</table>`;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: recipients,
          subject: `New submission: ${formName}`,
          html,
        }),
      });
      if (!res.ok) return { sent: false, reason: `resend-${res.status}` };
      return { sent: true };
    } catch {
      return { sent: false, reason: 'network-error' };
    }
  }

  return { sent: false, reason: 'unknown-provider' };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
