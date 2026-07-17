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
          className="group mb-12 grid grid-cols-1 gap-6 overflow-hidden rounded-[22px] border border-white/9 bg-white/[0.03] p-6 transition-colors hover:border-brand/40 md:grid-cols-2 md:p-8"
        >
          <div className="flex flex-col justify-center">
            <div className="mb-3 flex items-center gap-3 text-[12px]">
              <span className="rounded-full bg-brand/15 px-3 py-1 font-bold text-brand">Featured</span>
              <span className="text-body-dim">{firstCat(featured)}</span>
            </div>
            <h2 className="m-0 mb-3 font-display text-[26px] font-bold leading-tight text-white group-hover:text-brand-200 md:text-[32px]">
              {featured.title}
            </h2>
            <p className="m-0 mb-4 text-[15px] leading-relaxed text-body-faint">{featured.excerpt}</p>
            <div className="flex items-center gap-3 text-[12.5px] text-body-dim">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-brand-200">
                {featured.author?.initials || 'MA'}
              </span>
              <span>{featured.author?.name || 'Mavlers.ai Team'}</span>
              <span>·</span>
              <span>{formatDate(featured.published_at)}</span>
              <span>·</span>
              <span>{featured.reading_time}</span>
            </div>
          </div>
          <div className="hidden items-center justify-center rounded-[16px] bg-gradient-to-br from-brand/20 to-transparent md:flex">
            <span className="font-display text-[64px] font-bold text-brand/30">ai</span>
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
                  ? 'border-brand bg-brand/15 text-brand-200'
                  : 'border-white/10 bg-white/[0.03] text-body-faint hover:border-white/25'
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
            className="group flex flex-col rounded-[18px] border border-white/9 bg-white/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-brand/50"
          >
            <div className="mb-3 text-[12px] font-semibold text-brand">{firstCat(p)}</div>
            <h3 className="m-0 mb-2.5 font-display text-[18px] font-semibold leading-snug text-white group-hover:text-brand-200">
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
