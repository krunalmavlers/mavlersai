'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Icon } from './icons';

/**
 * Horizontal slider of published case studies.
 *
 * The track is a native scroll-snap container, so it swipes on touch, scrolls
 * with a trackpad and remains keyboard-reachable with no JavaScript at all.
 * The arrows are an enhancement layered on top; they disable themselves at
 * either end rather than wrapping, so the reader can always tell where they are.
 *
 * It also advances on its own, but yields the moment it would be rude to keep
 * moving: on hover, on keyboard focus inside the track, while scrolled out of
 * view, for a cooldown after any manual interaction, and never at all for
 * viewers who have asked for reduced motion.
 */
export function CaseStudySlider({ posts, base }: { posts: Post[]; base: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  // Autoplay. `hold` is a timestamp rather than a boolean so any interaction
  // simply pushes the resume point forward instead of juggling paused states.
  const hold = useRef(0);
  const [idle, setIdle] = useState(true);
  const defer = useCallback(() => {
    hold.current = Date.now() + 8000;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let onScreen = true;
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0.25 });
    io?.observe(el);

    const id = window.setInterval(() => {
      if (!idle || !onScreen || Date.now() < hold.current) return;
      if (document.hidden) return;
      // one card per tick, measured from the DOM so it survives any resize
      const first = el.firstElementChild as HTMLElement | null;
      const second = el.children[1] as HTMLElement | undefined;
      const step = first
        ? (second ? second.offsetLeft - first.offsetLeft : first.offsetWidth)
        : el.clientWidth;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.scrollTo({ left: end ? 0 : el.scrollLeft + step, behavior: 'smooth' });
    }, 4200);

    return () => {
      window.clearInterval(id);
      io?.disconnect();
    };
  }, [idle]);

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => {
        defer();
        page(dir);
      }}
      disabled={disabled}
      aria-label={dir === -1 ? 'Previous case studies' : 'Next case studies'}
      className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-black bg-white text-black transition-colors hover:bg-black hover:text-brand disabled:cursor-not-allowed disabled:border-surface-line2 disabled:bg-white disabled:text-[#C9C9C4] disabled:hover:bg-white"
    >
      <span className={dir === -1 ? 'rotate-180' : undefined}>
        <Icon name="arrow-right" size={18} />
      </span>
    </button>
  );

  return (
    <>
      <div className="mb-5 flex items-center justify-end gap-2.5">
        {arrow(-1, atStart)}
        {arrow(1, atEnd)}
      </div>
      <div
        ref={trackRef}
        onScroll={sync}
        onMouseEnter={() => setIdle(false)}
        onMouseLeave={() => setIdle(true)}
        onFocusCapture={() => setIdle(false)}
        onBlurCapture={() => setIdle(true)}
        onPointerDown={defer}
        onTouchStart={defer}
        onWheel={defer}
        className="cs-track -mx-1 -my-7 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-7"
      >
        {posts.map((p) => {
          const industry = (p.categories || []).find((c) => c.taxonomy === 'industry')?.name;
          return (
            <Link
              key={p.id}
              href={`${base}/${p.slug}`}
              className="cs-card group flex w-[86vw] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] border border-surface-line2 bg-white p-6 sm:w-[330px]"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {p.meta?.type && (
                  <span className="rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-black">
                    {p.meta.type}
                  </span>
                )}
                {industry && <span className="text-[11.5px] text-body-dim">{industry}</span>}
              </div>
              <h3 className="m-0 mb-2.5 font-display text-[17px] font-bold leading-snug text-black transition-colors group-hover:text-brand-ink">
                {p.title}
              </h3>
              {p.meta?.result_headline && (
                <p className="m-0 mb-3 text-[13px] font-bold leading-snug text-brand-ink">
                  {p.meta.result_headline}
                </p>
              )}
              <p className="m-0 mb-4 flex-1 text-[13.5px] leading-relaxed text-body-faint">{p.excerpt}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {(p.meta?.stack || []).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="cs-chip rounded-md border border-surface-line2 bg-surface-tint px-2 py-0.5 text-[11px] text-body-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span
                  aria-hidden
                  className="cs-go flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-black"
                >
                  <Icon name="arrow-up-right" size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
