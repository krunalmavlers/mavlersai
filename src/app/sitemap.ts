import type { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/queries';
import { siteUrl } from '@/lib/seo';

// Regenerate on every request so newly published pages/posts appear immediately.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const supabase = createSupabaseServerClient();
  const implBase = settings.url_config?.implementations_base || 'implementations';
  const insBase = settings.url_config?.insights_base || 'insights';

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: siteUrl(`/${implBase}`), changeFrequency: 'weekly', priority: 0.8 },
    { url: siteUrl(`/${insBase}`), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at')
    .eq('status', 'published');
  for (const p of pages || []) {
    if (p.slug === '') continue;
    entries.push({ url: siteUrl(`/${p.slug}`), lastModified: p.updated_at });
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('content_type, slug, updated_at')
    .eq('status', 'published');
  for (const post of posts || []) {
    const base = post.content_type === 'implementation' ? implBase : insBase;
    entries.push({
      url: siteUrl(`/${base}/${post.slug}`),
      lastModified: post.updated_at,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
