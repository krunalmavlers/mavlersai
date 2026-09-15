import Link from 'next/link';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Icon } from '@/components/sections/icons';

/**
 * The three featured pieces, on black.
 *
 * Lives outside `InsightsList` so it can be a full-width band rather than a row
 * inside the page's max-width column — and because it needs no client state:
 * the featured set never changes as the reader filters the list below it.
 */
export function FeaturedInsights({ posts, base }: { posts: Post[]; base: string }) {
  if (posts.length === 0) return null;

  const firstCat = (p: Post) =>
    (p.categories || []).find((c) => c.taxonomy === 'category')?.name || '';
  const meta = (p: Post) => [formatDate(p.published_at), p.reading_time].filter(Boolean);

  return (
    <section className="ins-band relative overflow-hidden bg-ink-900 text-white [background:#0A0A0A]">
      <span aria-hidden className="ins-plane" />
      <div className="relative mx-auto max-w-page px-5 py-[clamp(38px,4.6vw,62px)] md:px-10">
        <div className="mb-7 flex items-center gap-3.5">
          <span aria-hidden className="h-[3px] w-7 rounded-full bg-gradient-to-r from-brand to-[#F0903C]" />
          <h2 className="m-0 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-brand">Featured</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`${base}/${p.slug}`}
              className="ins-card group flex flex-col overflow-hidden rounded-[18px] border border-[#242424] p-[24px] [background:linear-gradient(180deg,#141414,#0E0E0E)]"
            >
              {firstCat(p) && (
                <div className="mb-[15px] text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-brand">
                  {firstCat(p)}
                </div>
              )}
              <h3 className="m-0 mb-3 font-display text-[20px] font-extrabold leading-[1.22] tracking-[-0.02em] text-white transition-colors group-hover:text-brand">
                {p.title}
              </h3>
              <p className="cs-excerpt m-0 text-[13.5px] leading-[1.62] text-[#9A9A9A]">{p.excerpt}</p>
              <div className="mt-auto pt-[18px]">
                <span aria-hidden className="ins-rule mb-[14px] block h-px w-full" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[12px] text-[#8A8A8A]">
                    {meta(p).map((m, i) => (
                      <span key={m} className="flex items-center gap-2">
                        {i > 0 && <span aria-hidden className="opacity-50">·</span>}
                        {m}
                      </span>
                    ))}
                  </div>
                  <span
                    aria-hidden
                    className="ins-go flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border-[1.5px] border-white/15 text-brand"
                  >
                    <Icon name="arrow-up-right" size={15} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Flagged pieces first, topped up with the most recent so the row is never short. */
export function pickFeatured(posts: Post[], count = 3): Post[] {
  const flagged = posts.filter((p) => p.is_featured);
  const rest = posts.filter((p) => !p.is_featured);
  return [...flagged, ...rest].slice(0, count);
}
