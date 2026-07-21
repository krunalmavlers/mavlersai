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
    <article className="bg-white px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[860px]">
        <nav className="mb-6 text-[13px] text-body-dim">
          <Link href={base} className="hover:text-black">
            Implementations
          </Link>{' '}
          <span className="text-body-dim">/</span> <span className="text-body-faint">{post.title}</span>
        </nav>

        <div className="mb-5 flex flex-wrap gap-2">
          {m.type && (
            <span className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-black">{m.type}</span>
          )}
          {industry && (
            <span className="rounded-md border border-surface-line2 px-2.5 py-1 text-[11px] font-semibold text-body-soft">
              {industry}
            </span>
          )}
          {lifecycle && (
            <span className="rounded-md border border-surface-line2 px-2.5 py-1 text-[11px] font-semibold text-body-soft">
              {lifecycle}
            </span>
          )}
        </div>

        <h1 className="m-0 mb-4 font-display text-[34px] font-extrabold leading-[1.06] tracking-[-0.03em] text-black md:text-[46px]">
          {post.title}
        </h1>
        <p className="m-0 mb-10 text-[18px] leading-relaxed text-body-muted">{post.excerpt}</p>

        {Array.isArray(m.metrics) && m.metrics.length > 0 && (
          <div className="mb-12 grid grid-cols-2 gap-4 rounded-[18px] bg-black p-6 md:grid-cols-4">
            {m.metrics.map((met, i) => (
              <div key={i}>
                <div className="font-display text-[26px] font-extrabold text-brand">{met.value}</div>
                <div className="mt-1 text-[12.5px] text-body-onDark">{met.label}</div>
              </div>
            ))}
          </div>
        )}

        {post.body_html && (
          <div className="prose-mavlers mb-12" dangerouslySetInnerHTML={{ __html: post.body_html }} />
        )}

        {Array.isArray(m.challenge) && m.challenge.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-extrabold tracking-[-0.02em] text-black">The challenge</h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {m.challenge.map((ch, i) => (
                <li key={i} className="flex items-start gap-3 text-[14.5px] text-body-faint">
                  <span className="mt-1 text-brand-ink">◆</span>
                  {ch}
                </li>
              ))}
            </ul>
          </section>
        )}

        {Array.isArray(m.architecture) && m.architecture.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-extrabold tracking-[-0.02em] text-black">Solution architecture</h2>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
              {m.architecture.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="whitespace-nowrap rounded-[10px] border border-surface-line2 bg-surface-tint px-3.5 py-2.5 text-[13px] font-semibold text-body-soft">
                    {step}
                  </span>
                  {i < m.architecture!.length - 1 && <span className="text-brand-ink">→</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(m.delivered) && m.delivered.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-extrabold tracking-[-0.02em] text-black">What we delivered</h2>
            <div className="flex flex-wrap gap-2">
              {m.delivered.map((d) => (
                <span key={d} className="rounded-full border border-surface-line2 bg-surface-tint px-3.5 py-1.5 text-[13px] text-body-soft">
                  {d}
                </span>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(m.stack) && m.stack.length > 0 && (
          <section className="mb-12">
            <h2 className="m-0 mb-5 font-display text-[24px] font-extrabold tracking-[-0.02em] text-black">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {m.stack.map((s) => (
                <span key={s} className="rounded-md bg-brand/15 px-3 py-1.5 text-[13px] font-semibold text-brand-ink">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {related && (
          <Link
            href={`${base}/${related.slug}`}
            className="mb-12 block rounded-[18px] border border-surface-line2 bg-surface-tint p-6 transition-colors hover:border-black"
          >
            <div className="mb-2 text-[12px] font-bold uppercase tracking-wide text-brand-ink">Related implementation</div>
            <div className="font-display text-[18px] font-bold text-black">{related.title}</div>
          </Link>
        )}

        <div className="rounded-[20px] bg-brand p-8 text-center">
          <h2 className="m-0 mb-3 font-display text-[26px] font-extrabold tracking-[-0.02em] text-black">
            Want something like this for your client?
          </h2>
          <p className="m-0 mb-6 text-[15px] text-[#1a1a1a]">
            Bring us the opportunity — we will map it to the right implementation pathway.
          </p>
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
