'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Icon } from '@/components/sections/icons';
import { Pagination } from './Pagination';

const PAGE_SIZE = 9;
const FEATURED_COUNT = 3;

export function InsightsList({ posts, base }: { posts: Post[]; base: string }) {
  const [active, setActive] = useState('All');
  const [page, setPage] = useState(1);

  const pills = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) =>
      (p.categories || []).filter((c) => c.taxonomy === 'category').forEach((c) => set.add(c.name)),
    );
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    if (active === 'All') return posts;
    return posts.filter((p) => (p.categories || []).some((c) => c.name === active));
  }, [posts, active]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [active]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  function firstCat(p: Post) {
    return (p.categories || []).find((c) => c.taxonomy === 'category')?.name || '';
  }

  const meta = (p: Post) => [formatDate(p.published_at), p.reading_time].filter(Boolean);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
        <h2 className="m-0 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-body-dim">
          All insights
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
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
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((p) => (
          <Link
            key={p.id}
            href={`${base}/${p.slug}`}
            className="cs-card group flex flex-col overflow-hidden rounded-[18px] border border-surface-line2 bg-white p-[22px]"
          >
            {firstCat(p) && (
              <div className="mb-[13px] text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-body-dim">
                {firstCat(p)}
              </div>
            )}
            <h3 className="m-0 mb-2.5 font-display text-[18px] font-extrabold leading-[1.28] tracking-[-0.018em] text-black transition-colors group-hover:text-brand-ink">
              {p.title}
            </h3>
            <p className="cs-excerpt m-0 text-[13px] leading-[1.62] text-body-faint">{p.excerpt}</p>
            <div className="mt-auto pt-[18px]">
              <span aria-hidden className="cs-rule mb-[14px] block h-px w-full" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[12px] text-body-dim">
                  {meta(p).map((m, i) => (
                    <span key={m} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden className="text-body-dim/60">·</span>}
                      {m}
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
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
