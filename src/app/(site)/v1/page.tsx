import type { Metadata } from 'next';
import { getSettings } from '@/lib/queries';
import { V1Signal } from '@/components/variants/V1Signal';

export const metadata: Metadata = {
  title: 'Name the stall',
  description: 'Name where the Next.js build stalled. A plan draws on the page, then a Mavlers engineer takes it the rest of the way.',
  robots: { index: false, follow: false },
};

export default async function SignalPage() {
  const settings = await getSettings();
  return <V1Signal siteKey={settings.recaptcha_site_key || ''} />;
}
