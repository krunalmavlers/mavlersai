import type { Metadata } from 'next';
import { getSettings } from '@/lib/queries';
import { V3Instrument } from '@/components/variants/V3Instrument';

export const metadata: Metadata = {
  title: 'The plan draws itself',
  description: 'Describe where the build broke. A plan draws beside the brief, then a Mavlers engineer takes the moves.',
  robots: { index: false, follow: false },
};

export default async function InstrumentPage() {
  const settings = await getSettings();
  return <V3Instrument siteKey={settings.recaptcha_site_key || ''} />;
}
