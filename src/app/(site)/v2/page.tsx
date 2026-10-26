import type { Metadata } from 'next';
import { getSettings } from '@/lib/queries';
import { V2Field } from '@/components/variants/V2Field';

export const metadata: Metadata = {
  title: 'Until someone else can run it',
  description: 'A field note on taking a Next.js build from a preview to something a team can run, then a Mavlers engineer.',
  robots: { index: false, follow: false },
};

export default async function FieldPage() {
  const settings = await getSettings();
  return <V2Field siteKey={settings.recaptcha_site_key || ''} />;
}
