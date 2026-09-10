'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Publishes the section's scroll progress as `--p` (0 → 1) on its own element,
 * so child styles can be written as pure functions of scroll position. Because
 * nothing latches, scrolling back up runs the whole scene in reverse.
 *
 * `--p` defaults to 1 in CSS and the dependent transforms sit behind
 * `[data-scrub]`, which is only set on the client — so the content renders in
 * place without JavaScript, for crawlers, and under reduced motion. Reads are
 * batched into a single rAF per frame to keep the scroll listener cheap.
 */
export function ScrollScene({
  className,
  style,
  children,
  mode = 'enter',
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /**
   * `enter` — 0 before the section arrives, 1 once it has settled in view.
   *   Right for anything that reveals as you reach it.
   * `exit`  — 0 while the section fills the viewport, 1 once it has scrolled
   *   away. Right for a hero, which is already on screen at rest and has no
   *   arrival to animate.
   * `pin`   — 0 when a tall section's sticky child locks to the top, 1 when it
   *   releases. Progress through the pinned run, for stepping between states.
   */
  mode?: 'enter' | 'exit' | 'pin';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    el.dataset.scrub = '';
    let raf = 0;
    const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      // --- read phase: every measurement first, so styles written below can't
      // force a synchronous re-layout between reads ---
      const r = el.getBoundingClientRect();
      const items = el.querySelectorAll<HTMLElement>('.sx');
      const tops: number[] = [];
      const mids: number[] = [];
      items.forEach((n) => {
        const q = n.getBoundingClientRect();
        tops.push(q.top);
        mids.push(q.top + q.height / 2);
      });

      // --- write phase ---
      const p =
        mode === 'exit'
          ? // starts the moment the page moves, complete once most of the
            // section has passed the top edge
            -r.top / Math.max(1, r.height * 0.85)
          : mode === 'pin'
            ? // the sticky child holds for (height - viewport) of scroll; that
              // run is the whole timeline
              -r.top / Math.max(1, r.height - vh)
            : // finishes shortly after the section is fully in view
              (vh * 0.9 - r.top) / (r.height * 0.62 + vh * 0.5);
      el.style.setProperty('--p', String(clamp(p)));

      // Each `.sx` element also carries its own progress, `--e`, measured from
      // where it actually sits rather than from the section's. Without this an
      // element's timing depends on its index, so in a tall section the lower
      // items animate while still below the fold and the upper ones are done
      // before the reader settles on them.
      //
      // 0 as it clears the bottom edge, 1 once it is 45% of a screen further
      // up — a slow enough run to be watched rather than glimpsed.
      for (let i = 0; i < items.length; i += 1) {
        items[i].style.setProperty('--e', String(clamp((vh * 0.94 - tops[i]) / (vh * 0.45))));
        // `--c` is centredness: 1 when the element sits on the viewport's
        // midline, falling to 0 as it reaches either edge. Lets a section put
        // the reader's current focus in front and hold the rest back.
        const c = clamp(1 - Math.abs(mids[i] - vh / 2) / (vh * 0.42));
        items[i].style.setProperty('--c', String(c));
        // An element carrying `data-slot` also publishes its centredness onto
        // the scene as `--c0`, `--c1`, … so a *sibling* can react to it. CSS
        // variables only travel down, so a sticky panel could not otherwise
        // know which item the reader is level with.
        const slot = items[i].dataset.slot;
        if (slot !== undefined) el.style.setProperty(`--c${slot}`, String(c));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);

  return (
    <div ref={ref} className={`pm-scene ${className ?? ''}`} data-mode={mode} style={style}>
      {children}
    </div>
  );
}
