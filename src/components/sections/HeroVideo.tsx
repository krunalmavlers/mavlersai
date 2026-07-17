'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-bleed hero background video. Muted + looped + inline so it can autoplay.
 * Respects prefers-reduced-motion (pauses on the poster frame). Decorative:
 * pointer-events-none + aria-hidden. A legibility overlay is rendered by the
 * hero on top of this.
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      v.pause();
      return;
    }
    // Some browsers need an explicit play() after hydration.
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
