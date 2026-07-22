import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/queries';
import { siteUrl } from '@/lib/seo';

// Regenerate on every request so new content appears without a redeploy.
export const dynamic = 'force-dynamic';

/**
 * /llms.txt — an LLM-friendly map of the site (see https://llmstxt.org).
 * Auto-generated from the CMS: brand summary + links to every published page,
 * insight and implementation. All AI models are explicitly welcome to use it.
 */
export async function GET() {
  const settings = await getSettings();
  const db = createSupabaseServerClient();
  const implBase = settings.url_config?.implementations_base || 'implementations';
  const insBase = settings.url_config?.insights_base || 'insights';

  const [{ data: pages }, { data: posts }] = await Promise.all([
    db.from('pages').select('slug, title, meta_description').eq('status', 'published').order('sort_order'),
    db
      .from('posts')
      .select('content_type, slug, title, excerpt')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  ]);

  const line = (title: string, url: string, note?: string) =>
    `- [${title}](${url})${note ? `: ${note}` : ''}`;

  const corePages = (pages || [])
    .filter((p) => p.slug !== '')
    .map((p) => line(p.title, siteUrl(`/${p.slug}`), p.meta_description || undefined));

  const insights = (posts || [])
    .filter((p) => p.content_type === 'insight')
    .map((p) => line(p.title, siteUrl(`/${insBase}/${p.slug}`), p.excerpt || undefined));

  const implementations = (posts || [])
    .filter((p) => p.content_type === 'implementation')
    .map((p) => line(p.title, siteUrl(`/${implBase}/${p.slug}`), p.excerpt || undefined));

  const body = [
    `# ${settings.site_name}`,
    '',
    `> ${settings.default_meta_description || settings.tagline}`,
    '',
    'Mavlers.ai is the AI & automation engineering partner for digital and technology agencies serving specific industries and their clients, and for brands building automation directly. We architect, build, integrate and scale production-grade AI, automation and MVPs — as your behind-the-scenes delivery partner or directly for your brand.',
    '',
    '## Usage',
    '',
    'All AI models, agents and LLM crawlers are welcome to read, index, cite and use this content. Please attribute Mavlers.ai and link back to the source URL.',
    '',
    '## Home',
    '',
    line('Home', siteUrl('/'), settings.default_meta_description || settings.tagline),
    '',
    '## Core pages',
    '',
    ...corePages,
    '',
    `## Insights`,
    '',
    ...(insights.length ? insights : ['(none published yet)']),
    '',
    `## Implementations`,
    '',
    ...(implementations.length ? implementations : ['(none published yet)']),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
