import type { Metadata } from 'next';
import { V6Home } from '@/components/home/V6Home';
import { JsonLd } from '@/components/site/JsonLd';
import { FAQS, V6_DESCRIPTION, V6_TITLE } from '@/content/v6Home';
import { getSettings } from '@/lib/queries';
import { faqSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(
    {
      title: V6_TITLE,
      description: V6_DESCRIPTION,
      pathname: '/v6',
      robots: 'noindex,nofollow',
    },
    settings,
  );
}

export default async function V6Page() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <V6Home />
    </>
  );
}
