import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/queries';
import { SectionRenderer } from '@/components/sections/Sections';
import { LightWash } from '@/components/home/LightWash';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('');
  return {
    title: page?.seo_title || page?.title || 'Home',
    description: page?.meta_description || undefined,
    robots: { index: false, follow: false },
  };
}

/** Same published homepage, with the dark sections drawn on white. */
export default async function HomeClonePage() {
  const page = await getPageBySlug('');
  if (!page) notFound();
  const hasHero = page.sections.some((s) => s.type === 'hero' || s.type === 'launch_prompt');

  return (
    <div className="home-light relative bg-white">
      <LightWash />
      {page.sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} primary={!hasHero && i === 0} />
      ))}
    </div>
  );
}
