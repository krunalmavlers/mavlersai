import type { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getIndexablePaths, getSettings } from '@/lib/queries';
import { siteUrl } from '@/lib/seo';

// Regenerate on every request so a menu change shows up immediately.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const allowed = await getIndexablePaths();
  const supabase = createSupabaseServerClient();
  const implBase = settings.url_config?.implementations_base || 'implementations';
  const insBase = settings.url_config?.insights_base || 'insights';

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const add = (path: string, extra: Omit<MetadataRoute.Sitemap[number], 'url'> = {}) => {
    if (!allowed.has(path) || seen.has(path)) return;
    seen.add(path);
    entries.push({ url: siteUrl(path), ...extra });
  };

  add('/', { changeFrequency: 'weekly', priority: 1 });

  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at')
    .eq('status', 'published');
  for (const p of pages || []) {
    const path = p.slug ? `/${p.slug}` : '/';
    add(path, { lastModified: p.updated_at, changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.8 });
  }

  // Listing routes are real pages even when they have no CMS record of their own.
  add(`/${implBase}`, { changeFrequency: 'weekly', priority: 0.8 });
  add(`/${insBase}`, { changeFrequency: 'weekly', priority: 0.8 });

  const { data: posts } = await supabase
    .from('posts')
    .select('content_type, slug, updated_at')
    .eq('status', 'published');
  for (const post of posts || []) {
    const base = post.content_type === 'implementation' ? implBase : insBase;
    add(`/${base}/${post.slug}`, {
      lastModified: post.updated_at,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
