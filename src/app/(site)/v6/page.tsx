import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LightWash } from '@/components/home/LightWash';
import { SectionRenderer } from '@/components/sections/Sections';
import { JsonLd } from '@/components/site/JsonLd';
import { getPageBySlug, getSettings } from '@/lib/queries';
import { faqFromSections, faqSchema, storedSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

/** The previous marketing homepage, kept at /v6 after the MVP offer took /. */
export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPageBySlug('')]);
  return buildMetadata(
    {
      title: page?.seo_title || page?.title || 'Home',
      description: page?.meta_description,
      pathname: '/v6',
      robots: 'noindex,nofollow',
    },
    settings,
  );
}

export default async function PreviousHomePage() {
  const page = await getPageBySlug('');
  if (!page) notFound();
  const hasHero = page.sections.some((s) => s.type === 'hero' || s.type === 'launch_prompt');
  const sections = page.sections.map((section, i) => (
    <SectionRenderer key={section.id} section={section} primary={!hasHero && i === 0} />
  ));

  return (
    <>
      <JsonLd data={[storedSchema(page), faqSchema(faqFromSections(page.sections))].filter(Boolean)} />
      <div className="home-light relative bg-white">
        <LightWash />
        {sections}
      </div>
    </>
  );
}
