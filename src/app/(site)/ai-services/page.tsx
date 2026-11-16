import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LightWash } from '@/components/home/LightWash';
import { SectionRenderer } from '@/components/sections/Sections';
import { JsonLd } from '@/components/site/JsonLd';
import { getPageBySlug, getSettings } from '@/lib/queries';
import { breadcrumbSchema, faqFromSections, faqSchema } from '@/lib/schema';
import { buildMetadata, siteUrl } from '@/lib/seo';

const TITLE = 'AI Services for Agencies and Brands | Mavlers.ai';
const DESCRIPTION =
  'The engineering partner for agencies and brands. We take a stalled Next.js build or AI prototype to production on Vercel: CMS, cost, AI features, MVP and care.';
const KEYWORDS =
  'AI services, AI engineering for agencies, Next.js development, Vercel production, AI prototype to production, MVP development, white-label AI, automation for brands';

/** The previous marketing homepage, now the AI services page linked from the header. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(
    {
      title: TITLE,
      description: DESCRIPTION,
      keywords: KEYWORDS,
      pathname: '/ai-services',
      robots: 'index,follow',
      imageAlt: 'AI services for agencies and brands — Mavlers.ai',
    },
    settings,
  );
}

export default async function AiServicesPage() {
  const page = await getPageBySlug('');
  if (!page) notFound();
  const hasHero = page.sections.some((s) => s.type === 'hero' || s.type === 'launch_prompt');
  const sections = page.sections.map((section, i) => (
    <SectionRenderer key={section.id} section={section} primary={!hasHero && i === 0} />
  ));

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${siteUrl('/ai-services')}#webpage`,
            url: siteUrl('/ai-services'),
            name: TITLE,
            description: DESCRIPTION,
            inLanguage: 'en',
            isPartOf: { '@id': siteUrl('/#website') },
            about: { '@id': siteUrl('/#organization') },
            breadcrumb: { '@id': `${siteUrl('/ai-services')}#breadcrumb` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI services',
            serviceType: 'AI and Next.js production engineering',
            description: DESCRIPTION,
            url: siteUrl('/ai-services'),
            provider: { '@id': siteUrl('/#organization') },
            audience: { '@type': 'Audience', audienceType: 'Digital and technology agencies, and brands' },
          },
          { ...breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'AI services', path: '/ai-services' },
          ]), '@id': `${siteUrl('/ai-services')}#breadcrumb` },
          faqSchema(faqFromSections(page.sections)),
        ]}
      />
      <div className="home-light relative bg-white">
        <LightWash />
        {sections}
      </div>
    </>
  );
}
