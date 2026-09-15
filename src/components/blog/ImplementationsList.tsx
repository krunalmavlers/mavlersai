'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Category, Post } from '@/lib/types';
import { Icon } from '@/components/sections/icons';
import { Pagination } from './Pagination';

const PAGE_SIZE = 9;

export function ImplementationsList({
  posts,
  base,
}: {
  posts: Post[];
  base: string;
}) {
  const [dimension, setDimension] = useState<'industry' | 'lifecycle'>('industry');
  const [active, setActive] = useState('All');
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [dimension, active]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  function catName(p: Post, tax: Category['taxonomy']) {
    return (p.categories || []).find((c) => c.taxonomy === tax)?.name || '';
  }

  /**
   * One card, shared by the feature and the grid.
   *
   * The seeded sample posts carry `meta.type` and `meta.stack`; the real case
   * studies are tagged with `category` and `lifecycle` terms instead. Reading
   * only the former left every real card with no badge and no chips, so each
   * falls back to the taxonomy its author actually used — the same rule the
   * homepage slider follows, so the two read as one card language.
   */
  function Card({ p }: { p: Post }) {
    const cats = p.categories || [];
    const badge = p.meta?.type || cats.find((c) => c.taxonomy === 'category')?.name;
    const label = dimension === 'industry' ? catName(p, 'lifecycle') : catName(p, 'industry');
    const chips = p.meta?.stack?.length
      ? p.meta.stack
      : cats.filter((c) => c.taxonomy === 'lifecycle').map((c) => c.name);

    return (
      <Link
        href={`${base}/${p.slug}`}
        className="cs-card group flex flex-col overflow-hidden rounded-[18px] border border-surface-line2 bg-white p-[22px]"
      >
        <div className="mb-[15px] flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          {badge && (
            <span className="rounded-[5px] bg-brand px-2.5 py-[5px] text-[10.5px] font-extrabold uppercase tracking-[0.05em] leading-none text-black">
              {badge}
            </span>
          )}
          {label && (
            <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-body-dim">{label}</span>
          )}
        </div>
        <h2 className="m-0 mb-2.5 font-display text-[18px] font-extrabold leading-[1.28] tracking-[-0.018em] text-black transition-colors group-hover:text-brand-ink">
          {p.title}
        </h2>
        {p.meta?.result_headline && (
          <p className="m-0 mb-2.5 text-[12.5px] font-bold leading-snug text-brand-ink">
            {p.meta.result_headline}
          </p>
        )}
        <p className="cs-excerpt m-0 text-[13px] leading-[1.62] text-body-faint">{p.excerpt}</p>
        <div className="mt-auto pt-[18px]">
          <span aria-hidden className="cs-rule mb-[14px] block h-px w-full" />
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {chips.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="cs-chip rounded-[6px] bg-surface-tint px-2 py-[3px] text-[10.5px] font-semibold text-body-dim"
                >
                  {t}
                </span>
              ))}
            </div>
            <span
              aria-hidden
              className="cs-go flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border-[1.5px] border-black/[0.13] text-black"
            >
              <Icon name="arrow-up-right" size={15} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div>
      {/* Filters as one tray of segments rather than two rows of loose buttons —
          the same control the service pages use. */}
      <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-body-dim">View by</span>
        <div className="inline-flex flex-wrap gap-1 rounded-[14px] border border-surface-line2 bg-surface-tint p-1.5">
          {(['industry', 'lifecycle'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDimension(d);
                setActive('All');
              }}
              aria-pressed={dimension === d}
              className={`jump-seg rounded-[10px] px-[15px] py-2.5 text-[13.5px] font-bold leading-none ${
                dimension === d ? 'is-on' : ''
              }`}
            >
              {d === 'industry' ? 'Industry' : 'Lifecycle'}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-body-dim">
          {filtered.length} AI use {filtered.length === 1 ? 'case' : 'cases'}
        </span>
      </div>

      <div className="mb-9 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-surface-line2 pt-5">
        {pills.map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            aria-pressed={active === p}
            className={`tax-pill relative text-[13.5px] font-bold ${active === p ? 'is-on' : ''}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
