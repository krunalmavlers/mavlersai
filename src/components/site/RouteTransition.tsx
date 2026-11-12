'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const COVER_MS = 380;
const REVEAL_MS = 460;
const SAFETY_MS = 6000;

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Same-origin link that will actually change the page. Hash jumps on the current URL are ignored. */
function isPageChange(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest('a');
  if (!(anchor instanceof HTMLAnchorElement)) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/.test(href)) return false;

  let next: URL;
  try {
    next = new URL(anchor.href);
  } catch {
    return false;
  }
  if (next.origin !== window.location.origin) return false;
  return next.pathname !== window.location.pathname || next.search !== window.location.search;
}

/**
 * Glass sheet on route changes. It slides in from the left under the header,
 * covers the page while the next view arrives, then continues off to the right.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const startedAt = useRef(0);
  const timers = useRef<number[]>([]);
  const [phase, setPhase] = useState<'off' | 'in' | 'out'>('off');
  const [top, setTop] = useState(72);

  const controls = useRef({ start: () => {}, stop: () => {} });

  useEffect(() => {
    const clearTimers = () => {
      for (const id of timers.current) window.clearTimeout(id);
      timers.current = [];
    };
    const later = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    const start = () => {
      if (reducedMotion()) return;
      clearTimers();
      const header = document.querySelector('header');
      const belowHeader = header ? Math.round(header.getBoundingClientRect().bottom) : 72;
      setTop(Math.max(0, belowHeader));
      startedAt.current = performance.now();
      setPhase('in');
      later(() => {
        setPhase('off');
        startedAt.current = 0;
      }, SAFETY_MS);
    };

    const stop = () => {
      if (!startedAt.current) return;
      const coverLeft = Math.max(0, COVER_MS - (performance.now() - startedAt.current));
      clearTimers();
      later(() => setPhase('out'), coverLeft);
      later(() => {
        setPhase('off');
        startedAt.current = 0;
      }, coverLeft + REVEAL_MS);
    };

    controls.current = { start, stop };

    const onClick = (event: MouseEvent) => {
      if (!isPageChange(event)) return;
      start();
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      clearTimers();
      document.body.classList.remove('is-route-in');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-route-in', phase === 'out');
  }, [phase]);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (!startedAt.current) controls.current.start();
    controls.current.stop();
  }, [pathname]);

  if (phase === 'off') return null;

  return (
    <div
      aria-hidden
      className={`route-wipe${phase === 'out' ? ' is-out' : ' is-in'}`}
      style={{ top }}
    />
  );
}
