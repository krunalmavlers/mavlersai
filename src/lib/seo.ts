import type { Metadata } from 'next';
import type { SiteSettings } from '@/lib/types';

interface SeoInput {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  keywords?: string;
}

/** Build a Next.js Metadata object from CMS SEO fields, falling back to site defaults. */
export function buildMetadata(input: SeoInput, settings: SiteSettings): Metadata {
  const title = input.title?.trim() || settings.default_meta_title || settings.site_name;
  const description = input.description?.trim() || settings.default_meta_description || settings.tagline;
  const ogImage = input.ogImage?.trim() || settings.default_og_image;
  const robots = input.robots?.trim() || 'index,follow';
  const index = !/noindex/i.test(robots);
  const follow = !/nofollow/i.test(robots);

  const metadata: Metadata = {
    title,
    description,
    robots: { index, follow },
    openGraph: {
      title,
      description,
      siteName: settings.site_name,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
  if (input.keywords?.trim()) metadata.keywords = input.keywords;
  if (input.canonical?.trim()) metadata.alternates = { canonical: input.canonical };
  return metadata;
}

export function siteUrl(path = ''): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean === '/' ? '' : clean}`;
}
