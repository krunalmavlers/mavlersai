import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getSettings,
  getPageBySlug,
  getPosts,
  getPostBySlug,
} from '@/lib/queries';
import type { Page, PageSection, Post } from '@/lib/types';
import { buildMetadata } from '@/lib/seo';
import { SectionRenderer } from '@/components/sections/Sections';
import { JsonLd } from '@/components/site/JsonLd';
import { ImplementationsList } from '@/components/blog/ImplementationsList';
import { InsightsList } from '@/components/blog/InsightsList';
import { ImplementationDetail } from '@/components/blog/ImplementationDetail';
import { InsightDetail } from '@/components/blog/InsightDetail';

type Params = { slug?: string[] };

type Resolved =
  | { kind: 'page'; page: Page & { sections: PageSection[] } }
  | { kind: 'impl-list'; base: string }
  | { kind: 'impl-detail'; base: string; post: Post; related: Post | null }
  | { kind: 'insight-list'; base: string }
  | { kind: 'insight-detail'; base: string; post: Post; related: Post[] }
  | { kind: '404' };

async function resolve(slugArr: string[] | undefined): Promise<Resolved> {
  const settings = await getSettings();
  const implBase = settings.url_config?.implementations_base || 'implementations';
  const insBase = settings.url_config?.insights_base || 'insights';
  const parts = slugArr || [];

  // Home
  if (parts.length === 0) {
    const page = await getPageBySlug('');
    return page ? { kind: 'page', page } : { kind: '404' };
  }

  // Implementations
  if (parts[0] === implBase) {
    if (parts.length === 1) return { kind: 'impl-list', base: `/${implBase}` };
    const post = await getPostBySlug('implementation', parts[1]);
    if (!post) return { kind: '404' };
    const relatedSlug = post.meta?.related?.[0];
    let related: Post | null = null;
    if (relatedSlug) related = await getPostBySlug('implementation', relatedSlug);
    return { kind: 'impl-detail', base: `/${implBase}`, post, related };
  }

  // Insights
  if (parts[0] === insBase) {
    if (parts.length === 1) return { kind: 'insight-list', base: `/${insBase}` };
    const post = await getPostBySlug('insight', parts[1]);
    if (!post) return { kind: '404' };
    const all = await getPosts('insight');
    const cat = (post.categories || [])[0]?.name;
    const related = all
      .filter((p) => p.id !== post.id && (p.categories || []).some((c) => c.name === cat))
      .slice(0, 3);
    return { kind: 'insight-detail', base: `/${insBase}`, post, related };
  }

  // CMS page (single or nested slug)
  const slug = parts.join('/');
  const page = await getPageBySlug(slug);
  return page ? { kind: 'page', page } : { kind: '404' };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const settings = await getSettings();
  const r = await resolve(params.slug);
  switch (r.kind) {
    case 'page':
      return buildMetadata(
        {
          title: r.page.seo_title || r.page.title,
          description: r.page.meta_description,
          ogImage: r.page.og_image,
          canonical: r.page.canonical_url,
          robots: r.page.robots,
          keywords: r.page.meta_keywords,
        },
        settings,
      );
    case 'impl-detail':
    case 'insight-detail':
      return buildMetadata(
        {
          title: r.post.seo_title || r.post.title,
          description: r.post.meta_description || r.post.excerpt,
          ogImage: r.post.og_image || r.post.cover_image,
          canonical: r.post.canonical_url,
          robots: r.post.robots,
        },
        settings,
      );
    case 'impl-list':
      return buildMetadata(
        { title: 'Implementations', description: 'AI implementations across industries and the digital lifecycle.' },
        settings,
      );
    case 'insight-list':
      return buildMetadata(
        { title: 'Insights', description: 'Practical AI thinking for agencies and brands.' },
        settings,
      );
    default:
      return buildMetadata({ title: 'Not found', robots: 'noindex,follow' }, settings);
  }
}

function ListHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden pb-6 pt-16 md:pt-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(900px 500px at 70% 0%,rgba(255,203,46,0.14),transparent 60%)' }}
      />
      <div className="relative mx-auto max-w-page px-5 md:px-10">
        <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{eyebrow}</div>
        <h1 className="m-0 mb-4 max-w-[720px] font-display text-[36px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[52px]">
          {title}
        </h1>
        <p className="m-0 max-w-[620px] text-[17px] leading-relaxed text-body-muted">{subtitle}</p>
      </div>
    </section>
  );
}

export default async function CatchAllPage({ params }: { params: Params }) {
  const r = await resolve(params.slug);

  if (r.kind === '404') notFound();

  if (r.kind === 'page') {
    return (
      <>
        <JsonLd data={r.page.schema_jsonld} />
        {r.page.sections.map((s) => (
          <SectionRenderer key={s.id} section={s} />
        ))}
      </>
    );
  }

  if (r.kind === 'impl-list') {
    const posts = await getPosts('implementation');
    return (
      <>
        <ListHero
          eyebrow="Implementations"
          title="AI implementations you can build with your clients"
          subtitle="Explore the workflows, agents and integrations we deliver — filter by industry or by digital lifecycle."
        />
        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-page px-5 md:px-10">
            <ImplementationsList posts={posts} base={r.base} />
          </div>
        </section>
      </>
    );
  }

  if (r.kind === 'insight-list') {
    const posts = await getPosts('insight');
    return (
      <>
        <ListHero
          eyebrow="Insights"
          title="Practical AI thinking for agencies."
          subtitle="How to sell, scope, build and deliver AI and automation under your brand."
        />
        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-page px-5 md:px-10">
            <InsightsList posts={posts} base={r.base} />
          </div>
        </section>
      </>
    );
  }

  if (r.kind === 'impl-detail') {
    return (
      <>
        <JsonLd data={r.post.schema_jsonld} />
        <ImplementationDetail post={r.post} base={r.base} related={r.related} />
      </>
    );
  }

  // insight-detail
  return (
    <>
      <JsonLd data={r.post.schema_jsonld} />
      <InsightDetail post={r.post} base={r.base} related={r.related} />
    </>
  );
}
