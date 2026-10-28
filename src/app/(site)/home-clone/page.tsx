import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/queries';
import { SectionRenderer } from '@/components/sections/Sections';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('');
  return {
    title: page?.seo_title || page?.title || 'Home',
    description: page?.meta_description || undefined,
    robots: { index: false, follow: false },
  };
}

/** The previous dark homepage. Same sections as the live page. */
export default async function HomeClonePage() {
  const page = await getPageBySlug('');
  if (!page) notFound();
  const hasHero = page.sections.some((s) => s.type === 'hero' || s.type === 'launch_prompt');

  return (
    <>
      {page.sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} primary={!hasHero && i === 0} />
      ))}
    </>
  );
}
