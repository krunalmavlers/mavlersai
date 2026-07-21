import type { Metadata } from 'next';
import type { SiteSettings } from '@/lib/types';

/** Sensible default keywords applied when a page/post specifies none. */
export const DEFAULT_KEYWORDS =
  'AI automation, white-label AI, AI development agency, automation engineering, AI implementation, AI agents, workflow automation, MVP development, generative AI, AI for agencies';

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Append the brand exactly once — never doubling a title that already carries it. */
function withBrand(raw: string, siteName: string): string {
  const t = raw.trim();
  if (!siteName || !t) return t || siteName;
  return normalize(t).includes(normalize(siteName)) ? t : `${t} | ${siteName}`;
}

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

/** Absolute site origin. Prefers NEXT_PUBLIC_SITE_URL; falls back to the
 *  production domain when deployed, and localhost only in local dev. */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.NODE_ENV === 'production') return 'https://mavlers.ai';
  return 'http://localhost:3000';
}

export function siteUrl(path = ''): string {
  const base = siteOrigin();
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
    // `absolute` bypasses the root "%s · Mavlers.ai" template so the brand is
    // never appended twice; withBrand adds it once only if missing.
    title: { absolute: withBrand(title, settings.site_name) },
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
  metadata.keywords = input.keywords?.trim() || DEFAULT_KEYWORDS;
  if (canonical) metadata.alternates = { canonical };
  return metadata;
}
