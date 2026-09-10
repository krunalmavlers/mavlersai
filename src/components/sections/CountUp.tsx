'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Splits a CMS stat into an animatable number and the text around it, so
 * "15+" counts to 15 and keeps the "+", "1000s" counts to 1000 and keeps the
 * "s", and "1,200" counts up with its grouping intact. Anything without a
 * number in it (e.g. "Global") returns null and is rendered as-is.
 */
function parse(value: string) {
  const m = String(value).match(/^(\D*?)([\d][\d,]*(?:\.\d+)?)(.*)$/s);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const n = Number(digits.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return {
    prefix,
    suffix,
    target: n,
    decimals: (digits.split('.')[1] || '').length,
    grouped: digits.includes(','),
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const DURATION = 1400;

/**
 * Counts from zero to the stat's value the first time it scrolls into view.
 *
 * The final value is what renders on the server, so the number is correct
 * without JavaScript, for crawlers, and in the first painted frame. Only once
 * mounted — and only when the viewer hasn't asked for reduced motion — does it
 * reset to zero and wait for the observer.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const spec = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!spec || !el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const format = (n: number) => {
      const fixed = n.toFixed(spec.decimals);
      return spec.grouped ? Number(fixed).toLocaleString('en-US', {
        minimumFractionDigits: spec.decimals,
        maximumFractionDigits: spec.decimals,
      }) : fixed;
    };

    setDisplay(format(0));

    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / DURATION);
      setDisplay(format(spec.target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // `value` is the only input; spec is derived from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!spec) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {spec.prefix}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{display ?? spec.target.toLocaleString('en-US')}</span>
      {spec.suffix}
    </span>
  );
}
