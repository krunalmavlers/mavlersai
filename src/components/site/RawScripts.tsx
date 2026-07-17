'use client';

import { useEffect, useRef } from 'react';

/**
 * Injects an arbitrary HTML/JS snippet (as pasted into Site Settings) and makes
 * any <script> tags actually execute — setting innerHTML alone does not run
 * scripts, so we recreate each script node.
 */
export function RawScripts({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container || !html) return;
    container.innerHTML = html;
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.text = old.textContent || '';
      old.replaceWith(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);
  return <div ref={ref} style={{ display: 'none' }} aria-hidden />;
}
