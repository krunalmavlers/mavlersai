import type { Page, PageSection, Post, SiteSettings } from '@/lib/types';
import { absUrl, siteUrl } from '@/lib/seo';

type Json = Record<string, unknown>;

const isEmpty = (o?: Json | null) => !o || Object.keys(o).length === 0;

/** Organization node — prefers the CMS-managed schema, enriched with logo + social profiles. */
export function organizationSchema(settings: SiteSettings): Json {
  const sameAs = (settings.social_links || []).map((s) => s.url).filter(Boolean);
  const logo = absUrl(settings.logo_url) || absUrl(settings.default_og_image);

  if (!isEmpty(settings.organization_schema)) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': siteUrl('/#organization'),
      url: siteUrl('/'),
      ...(logo ? { logo } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...settings.organization_schema,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': siteUrl('/#organization'),
    name: settings.site_name,
    url: siteUrl('/'),
    description: settings.default_meta_description || settings.tagline,
    ...(logo ? { logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** WebSite node — ties pages back to the brand and enables sitelinks. */
export function websiteSchema(settings: SiteSettings): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl('/#website'),
    name: settings.site_name,
    url: siteUrl('/'),
    description: settings.default_meta_description || settings.tagline,
    inLanguage: 'en',
    publisher: { '@id': siteUrl('/#organization') },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: siteUrl(it.path),
    })),
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  settings: SiteSettings;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: siteUrl(input.path),
    isPartOf: { '@id': siteUrl('/#website') },
    inLanguage: 'en',
  };
}

export function faqSchema(items: { q?: string; a?: string }[]): Json | null {
  const qa = (items || []).filter((i) => i?.q && i?.a);
  if (!qa.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

/** Collect FAQ Q&A pairs from any `faq` sections on a page. */
export function faqFromSections(sections: PageSection[]): { q?: string; a?: string }[] {
  return (sections || [])
    .filter((s) => s.type === 'faq' && s.is_visible !== false)
    .flatMap((s) => (Array.isArray(s.content?.items) ? s.content.items : []));
}

/** Article / BlogPosting node for an insight or implementation post. */
export function articleSchema(input: {
  post: Post;
  path: string;
  settings: SiteSettings;
}): Json {
  const { post, path, settings } = input;
  const url = siteUrl(path);
  const image = absUrl(post.og_image || post.cover_image || settings.default_og_image);
  const modified = (post as unknown as { updated_at?: string }).updated_at || post.published_at;

  return {
    '@context': 'https://schema.org',
    '@type': post.content_type === 'insight' ? 'BlogPosting' : 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.seo_title || post.title,
    description: post.meta_description || post.excerpt,
    ...(image ? { image: [image] } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(modified ? { dateModified: modified } : {}),
    inLanguage: 'en',
    author: post.author?.name
      ? { '@type': 'Person', name: post.author.name }
      : { '@id': siteUrl('/#organization') },
    publisher: { '@id': siteUrl('/#organization') },
    ...(post.categories?.length
      ? { articleSection: post.categories.map((c) => c.name) }
      : {}),
    ...(post.tags?.length ? { keywords: post.tags.map((t) => t.name).join(', ') } : {}),
    isPartOf: { '@id': siteUrl('/#website') },
  };
}

/** Optional stored schema from the CMS (Page or Post), if non-empty. */
export function storedSchema(entity: Page | Post): Json | null {
  return isEmpty(entity.schema_jsonld) ? null : (entity.schema_jsonld as Json);
}
