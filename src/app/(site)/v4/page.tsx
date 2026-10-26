import type { Metadata } from 'next';
import { getSettings } from '@/lib/queries';
import { V4Line } from '@/components/variants/V4Line';

export const metadata: Metadata = {
  title: 'From prototype to production',
  description:
    'Tell us where the Next.js build stalled. A plan opens beside the brief — CMS, cost, AI, rescue, and the days after launch.',
  robots: { index: false, follow: false },
};

export default async function LinePage() {
  const settings = await getSettings();
  return <V4Line siteKey={settings.recaptcha_site_key || ''} />;
}
