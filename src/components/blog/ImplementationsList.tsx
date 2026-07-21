'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Category, Post } from '@/lib/types';

export function ImplementationsList({
  posts,
  base,
}: {
  posts: Post[];
  base: string;
}) {
  const [dimension, setDimension] = useState<'industry' | 'lifecycle'>('industry');
  const [active, setActive] = useState('All');

  const pills = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) =>
      (p.categories || []).filter((c) => c.taxonomy === dimension).forEach((c) => set.add(c.name)),
    );
    return ['All', ...Array.from(set)];
  }, [posts, dimension]);

  const filtered = useMemo(() => {
    if (active === 'All') return posts;
    return posts.filter((p) =>
      (p.categories || []).some((c) => c.taxonomy === dimension && c.name === active),
    );
  }, [posts, dimension, active]);

  function catName(p: Post, tax: Category['taxonomy']) {
    return (p.categories || []).find((c) => c.taxonomy === tax)?.name || '';
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-[12px] border border-surface-line2 bg-surface-tint2 p-1">
          {(['industry', 'lifecycle'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDimension(d);
                setActive('All');
              }}
              className={`rounded-[9px] px-4 py-2 text-[13px] font-bold capitalize transition-colors ${
                dimension === d ? 'bg-brand text-black' : 'text-body-soft hover:text-black'
              }`}
            >
              By {d === 'industry' ? 'Industry' : 'Lifecycle'}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-body-dim">
          Showing {filtered.length} of {posts.length} implementations
        </span>
      </div>

      <div className="mb-9 flex flex-wrap gap-2">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const badge = dimension === 'industry' ? catName(p, 'lifecycle') : catName(p, 'industry');
          return (
            <Link
              key={p.id}
              href={`${base}/${p.slug}`}
              className="svc-card group flex flex-col rounded-[18px] border border-surface-line2 bg-surface-tint p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                {p.meta?.type && (
                  <span className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-black">
                    {p.meta.type}
                  </span>
                )}
                {badge && <span className="text-[11.5px] text-body-dim">{badge}</span>}
              </div>
              <h3 className="m-0 mb-2.5 font-display text-[18px] font-bold leading-snug text-black transition-colors group-hover:text-brand-ink">
                {p.title}
              </h3>
              <p className="m-0 mb-4 flex-1 text-[13.5px] leading-relaxed text-body-faint">{p.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {(p.meta?.stack || []).slice(0, 4).map((t) => (
                  <span key={t} className="rounded-md border border-surface-line2 bg-white px-2 py-0.5 text-[11px] text-body-faint">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
