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
        <div className="inline-flex rounded-[12px] border border-white/12 bg-white/[0.04] p-1">
          {(['industry', 'lifecycle'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDimension(d);
                setActive('All');
              }}
              className={`rounded-[9px] px-4 py-2 text-[13px] font-bold capitalize transition-colors ${
                dimension === d ? 'bg-brand text-ink' : 'text-body-soft hover:text-white'
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
                ? 'border-brand bg-brand/15 text-brand-200'
                : 'border-white/10 bg-white/[0.03] text-body-faint hover:border-white/25'
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
              className="group flex flex-col rounded-[18px] border border-white/9 bg-white/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-brand/50"
            >
              <div className="mb-4 flex items-center gap-2">
                {p.meta?.type && (
                  <span className="rounded-md bg-brand/15 px-2.5 py-1 text-[11px] font-bold text-brand">
                    {p.meta.type}
                  </span>
                )}
                {badge && <span className="text-[11.5px] text-body-dim">{badge}</span>}
              </div>
              <h3 className="m-0 mb-2.5 font-display text-[18px] font-semibold leading-snug text-white group-hover:text-brand-200">
                {p.title}
              </h3>
              <p className="m-0 mb-4 flex-1 text-[13.5px] leading-relaxed text-body-faint">{p.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {(p.meta?.stack || []).slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-body-dim"
                  >
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
