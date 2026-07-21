import Link from 'next/link';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function InsightDetail({
  post,
  base,
  related,
}: {
  post: Post;
  base: string;
  related: Post[];
}) {
  const category = (post.categories || []).find((c) => c.taxonomy === 'category')?.name;

  return (
    <article className="bg-white px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[760px]">
        <nav className="mb-6 text-[13px] text-body-dim">
          <Link href={base} className="hover:text-black">
            Insights
          </Link>{' '}
          <span className="text-body-dim">/</span> <span className="text-body-faint">{category}</span>
        </nav>

        {category && (
          <div className="mb-4 text-[13px] font-bold uppercase tracking-wide text-brand-ink">{category}</div>
        )}

        <h1 className="m-0 mb-6 font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-black md:text-[44px]">
          {post.title}
        </h1>

        <div className="mb-10 flex items-center gap-3 border-b border-line pb-8 text-[13px] text-body-dim">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[12px] font-bold text-brand">
            {post.author?.initials || 'MA'}
          </span>
          <span className="font-semibold text-body-soft">{post.author?.name || 'Mavlers.ai Team'}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.reading_time}</span>
        </div>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="mb-10 w-full rounded-[16px]"
            decoding="async"
            fetchPriority="high"
          />
        )}

        <div className="prose-mavlers" dangerouslySetInnerHTML={{ __html: post.body_html }} />

        {(post.tags?.length || 0) > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-8">
            {post.tags!.map((t) => (
              <span
                key={t.id}
                className="rounded-full border border-surface-line2 bg-surface-tint px-3 py-1 text-[12.5px] text-body-faint"
              >
                #{t.name}
              </span>
            ))}
          </div>
        )}

        {post.author?.bio && (
          <div className="mt-8 flex gap-4 rounded-[18px] border border-surface-line2 bg-surface-tint p-6">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-[15px] font-bold text-brand">
              {post.author.initials}
            </span>
            <div>
              <div className="font-display text-[16px] font-bold text-black">{post.author.name}</div>
              <p className="m-0 mt-1 text-[13.5px] leading-relaxed text-body-faint">{post.author.bio}</p>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="m-0 mb-5 font-display text-[22px] font-extrabold tracking-[-0.02em] text-black">Keep reading</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`${base}/${r.slug}`}
                  className="svc-card group rounded-[16px] border border-surface-line2 bg-surface-tint p-5"
                >
                  <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.06em] text-brand-ink">
                    {(r.categories || []).find((c) => c.taxonomy === 'category')?.name}
                  </div>
                  <div className="font-display text-[15px] font-bold leading-snug text-black">{r.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 rounded-[20px] bg-brand p-8 text-center">
          <h2 className="m-0 mb-4 font-display text-[24px] font-extrabold tracking-[-0.02em] text-black">
            Have an AI opportunity to explore?
          </h2>
          <Link
            href="/book-a-call"
            className="inline-block rounded-full bg-black px-7 py-4 text-[16px] font-bold text-white hover:bg-[#1a1a1a]"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </article>
  );
}
