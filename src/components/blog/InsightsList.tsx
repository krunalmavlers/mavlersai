'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function InsightsList({ posts, base }: { posts: Post[]; base: string }) {
  const featured = posts.find((p) => p.is_featured);
  const rest = posts.filter((p) => !p.is_featured);
  const [active, setActive] = useState('All');

  const pills = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) =>
      (p.categories || []).filter((c) => c.taxonomy === 'category').forEach((c) => set.add(c.name)),
    );
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    if (active === 'All') return rest;
    return rest.filter((p) => (p.categories || []).some((c) => c.name === active));
  }, [rest, active]);

  function firstCat(p: Post) {
    return (p.categories || []).find((c) => c.taxonomy === 'category')?.name || '';
  }

  return (
    <div>
      {featured && (
        <Link
          href={`${base}/${featured.slug}`}
          className="group mb-12 grid grid-cols-1 gap-6 overflow-hidden rounded-[22px] border border-surface-line2 bg-surface-tint p-6 transition-colors hover:border-black md:grid-cols-2 md:p-8"
        >
          <div className="flex flex-col justify-center">
            <div className="mb-3 flex items-center gap-3 text-[12px]">
              <span className="rounded-full bg-brand px-3 py-1 font-bold text-black">Featured</span>
              <span className="text-body-dim">{firstCat(featured)}</span>
            </div>
            <h2 className="m-0 mb-3 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-black transition-colors group-hover:text-brand-ink md:text-[32px]">
              {featured.title}
            </h2>
            <p className="m-0 mb-4 text-[15px] leading-relaxed text-body-faint">{featured.excerpt}</p>
            <div className="flex items-center gap-3 text-[12.5px] text-body-dim">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[11px] font-bold text-brand">
                {featured.author?.initials || 'MA'}
              </span>
              <span className="font-semibold text-body-soft">{featured.author?.name || 'Mavlers.ai Team'}</span>
              <span>·</span>
              <span>{formatDate(featured.published_at)}</span>
              <span>·</span>
              <span>{featured.reading_time}</span>
            </div>
          </div>
          <div className="hidden items-center justify-center rounded-[16px] bg-brand/10 md:flex">
            <span className="font-display text-[64px] font-extrabold text-brand">ai</span>
          </div>
        </Link>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <button
              key={p}
              onClick={() => setActive(p)}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                active === p
                  ? 'border-black bg-black text-white'
                  : 'border-surface-line2 bg-white text-body-faint hover:border-black'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-body-dim">
          Showing {filtered.length} of {rest.length} articles
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`${base}/${p.slug}`}
            className="svc-card group flex flex-col rounded-[18px] border border-surface-line2 bg-surface-tint p-6"
          >
            <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-brand-ink">{firstCat(p)}</div>
            <h3 className="m-0 mb-2.5 font-display text-[18px] font-bold leading-snug text-black transition-colors group-hover:text-brand-ink">
              {p.title}
            </h3>
            <p className="m-0 mb-4 flex-1 text-[13.5px] leading-relaxed text-body-faint">{p.excerpt}</p>
            <div className="flex items-center gap-2 text-[12px] text-body-dim">
              <span>{formatDate(p.published_at)}</span>
              <span>·</span>
              <span>{p.reading_time}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
