import Link from 'next/link';
import type { Post } from '@/lib/types';

export function ImplementationDetail({
  post,
  base,
  related,
}: {
  post: Post;
  base: string;
  related?: Post | null;
}) {
  const m = post.meta || {};
  const industry = (post.categories || []).find((c) => c.taxonomy === 'industry')?.name;
  const lifecycle = (post.categories || []).find((c) => c.taxonomy === 'lifecycle')?.name;

  return (
    <article className="px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[860px]">
        <nav className="mb-6 text-[13px] text-body-dim">
          <Link href={base} className="hover:text-white">
            Implementations
          </Link>{' '}
          <span className="text-[#2A3346]">/</span> <span className="text-body-faint">{post.title}</span>
        </nav>

        <div className="mb-5 flex flex-wrap gap-2">
          {m.type && (
            <span className="rounded-md bg-brand/15 px-2.5 py-1 text-[11px] font-bold text-brand">
              {m.type}
            </span>
          )}
          {industry && (
            <span className="rounded-md border border-white/12 px-2.5 py-1 text-[11px] text-body-soft">
              {industry}
            </span>
          )}
          {lifecycle && (
            <span className="rounded-md border border-white/12 px-2.5 py-1 text-[11px] text-body-soft">
              {lifecycle}
            </span>
          )}
        </div>

        <h1 className="m-0 mb-4 font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[46px]">
          {post.title}
        </h1>
        <p className="m-0 mb-10 text-[18px] leading-relaxed text-body-muted">{post.excerpt}</p>

        {Array.isArray(m.metrics) && m.metrics.length > 0 && (
          <div className="mb-12 grid grid-cols-2 gap-4 rounded-[18px] border border-white/9 bg-white/[0.03] p-6 md:grid-cols-4">
            {m.metrics.map((met, i) => (
              <div key={i}>
                <div className="font-display text-[26px] font-bold text-brand">{met.value}</div>
                <div className="mt-1 text-[12.5px] text-body-faint">{met.label}</div>
              </div>
            ))}
          </div>
        )}

        {post.body_html && (
          <div className="prose-mavlers mb-12" dangerouslySetInnerHTML={{ __html: post.body_html }} />
        )}

        {Array.isArray(m.challenge) && m.challenge.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-bold text-white">The challenge</h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {m.challenge.map((ch, i) => (
                <li key={i} className="flex items-start gap-3 text-[14.5px] text-body-faint">
                  <span className="mt-1 text-brand">◆</span>
                  {ch}
                </li>
              ))}
            </ul>
          </section>
        )}

        {Array.isArray(m.architecture) && m.architecture.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-bold text-white">Solution architecture</h2>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
              {m.architecture.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="whitespace-nowrap rounded-[10px] border border-brand/25 bg-brand/[0.06] px-3.5 py-2.5 text-[13px] font-semibold text-body-soft">
                    {step}
                  </span>
                  {i < m.architecture!.length - 1 && <span className="text-brand">→</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(m.delivered) && m.delivered.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-bold text-white">What we delivered</h2>
            <div className="flex flex-wrap gap-2">
              {m.delivered.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-body-soft"
                >
                  {d}
                </span>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(m.stack) && m.stack.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-bold text-white">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {m.stack.map((s) => (
                <span key={s} className="rounded-md bg-brand/10 px-3 py-1.5 text-[13px] font-semibold text-brand-200">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {related && (
          <Link
            href={`${base}/${related.slug}`}
            className="mb-12 block rounded-[18px] border border-white/9 bg-white/[0.03] p-6 transition-colors hover:border-brand/40"
          >
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-brand">
              Related implementation
            </div>
            <div className="font-display text-[18px] font-semibold text-white">{related.title}</div>
          </Link>
        )}

        <div className="rounded-[20px] border border-brand/25 bg-brand/[0.06] p-8 text-center">
          <h2 className="m-0 mb-3 font-display text-[26px] font-bold text-white">
            Want something like this for your client?
          </h2>
          <p className="m-0 mb-6 text-[15px] text-body-muted">
            Bring us the opportunity — we will map it to the right implementation pathway.
          </p>
          <Link
            href="/book-a-call"
            className="inline-block rounded-[12px] bg-brand px-7 py-4 text-[16px] font-bold text-ink shadow-[0_10px_30px_rgba(255,203,46,0.4)] hover:bg-brand-300"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </article>
  );
}
