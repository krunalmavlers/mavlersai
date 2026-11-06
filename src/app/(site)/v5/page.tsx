import type { Metadata } from 'next';
import { MvpHome } from '@/components/home/MvpHome';
import { JsonLd } from '@/components/site/JsonLd';
import { FAQS, MVP_DESCRIPTION, MVP_TITLE } from '@/content/mvpHome';
import { getSettings } from '@/lib/queries';
import { faqSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(
    {
      title: MVP_TITLE,
      description: MVP_DESCRIPTION,
      pathname: '/v5',
      robots: 'noindex,nofollow',
    },
    settings,
  );
}

export default async function MvpPage() {
  const settings = await getSettings();
  const email = settings.contact?.emails?.[0];
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <MvpHome email={email} />
    </>
  );
}
