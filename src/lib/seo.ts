import type { Metadata } from 'next';
import type { SiteSettings } from '@/lib/types';

interface SeoInput {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  keywords?: string;
  /** Path of this page (e.g. "/insights/foo") — used for self-referencing canonical + og:url. */
  pathname?: string;
  type?: 'website' | 'article';
  imageAlt?: string;
  article?: {
    publishedTime?: string | null;
    modifiedTime?: string | null;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
}

export function siteUrl(path = ''): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean === '/' ? '' : clean}`;
}

/** Turn a possibly-relative asset path into an absolute URL. */
export function absUrl(u?: string): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return siteUrl(u);
}

/** Build a Next.js Metadata object from CMS SEO fields, falling back to site defaults. */
export function buildMetadata(input: SeoInput, settings: SiteSettings): Metadata {
  const title = input.title?.trim() || settings.default_meta_title || settings.site_name;
  const description = input.description?.trim() || settings.default_meta_description || settings.tagline;
  const ogImage = absUrl(input.ogImage?.trim() || settings.default_og_image);
  const robots = input.robots?.trim() || 'index,follow';
  const index = !/noindex/i.test(robots);
  const follow = !/nofollow/i.test(robots);

  const canonical = input.canonical?.trim()
    ? absUrl(input.canonical.trim())
    : input.pathname
      ? siteUrl(input.pathname)
      : undefined;

  const images = ogImage
    ? [{ url: ogImage, alt: input.imageAlt || title, width: 1200, height: 630 }]
    : undefined;

  const isArticle = input.type === 'article';

  const metadata: Metadata = {
    title,
    description,
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title,
      description,
      siteName: settings.site_name,
      locale: 'en_US',
      type: isArticle ? 'article' : 'website',
      url: canonical,
      images,
      ...(isArticle && input.article
        ? {
            publishedTime: input.article.publishedTime || undefined,
            modifiedTime: input.article.modifiedTime || input.article.publishedTime || undefined,
            authors: input.article.authors,
            section: input.article.section,
            tags: input.article.tags,
          }
        : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
  if (input.keywords?.trim()) metadata.keywords = input.keywords;
  if (canonical) metadata.alternates = { canonical };
  return metadata;
}
