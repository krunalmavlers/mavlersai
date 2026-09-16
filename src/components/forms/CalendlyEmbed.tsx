'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Inline Calendly scheduler card. The scheduling URL is configured in the
 * backend (Admin → Forms → Book a Call → Calendly URL).
 *
 * Two things this has to get right, both of which used to show as a black slab
 * under the scheduler:
 *
 *  - It renders inside a light section, so the card and the iframe's own page
 *    are painted light. The earlier dark theming was left over from when this
 *    sat on a dark band.
 *  - Calendly's event-type list is far shorter than a booking view, so a fixed
 *    iframe height leaves dead space. Calendly posts its content height to the
 *    parent on every view change; we listen and follow it. `height` is only the
 *    starting guess for before the first message arrives (and the floor, so the
 *    card never collapses if no message ever comes).
 */
export function CalendlyEmbed({
  url,
  heading,
  note,
  height = 560,
}: {
  url: string;
  heading?: string;
  note?: string;
  height?: number;
}) {
  const [frameHeight, setFrameHeight] = useState(height);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Other embeds and extensions post here too, and `e.origin` can be the
      // string "null" for sandboxed frames, which URL() rejects.
      let host = '';
      try {
        host = new URL(e.origin).hostname;
      } catch {
        return;
      }
      if (!/(^|\.)calendly\.com$/.test(host)) return;
      const data = e.data as { event?: string; payload?: { height?: string | number } };
      if (!data || typeof data !== 'object') return;
      if (data.event !== 'calendly.page_height') return;
      const h = parseInt(String(data.payload?.height ?? ''), 10);
      if (Number.isFinite(h) && h > 0) setFrameHeight(Math.max(h, 320));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const sep = url.includes('?') ? '&' : '?';
  const themed =
    `${url}${sep}` +
    'embed_domain=mavlers.ai&embed_type=Inline&hide_gdpr_banner=1' +
    '&background_color=ffffff&text_color=1a1a1a&primary_color=1a1a1a';

  return (
    <div className="rounded-[20px] border border-surface-line2 bg-surface-tint p-4 md:p-5">
      {heading && <div className="mb-1 px-1 font-display text-[16px] font-bold text-black">{heading}</div>}
      {note && <p className="m-0 mb-3 px-1 text-[12.5px] text-body-faint">{note}</p>}
      <div className="overflow-hidden rounded-[14px] border border-surface-line2 bg-white">
        <iframe
          ref={frame}
          src={themed}
          title="Schedule a call"
          loading="lazy"
          style={{ width: '100%', height: frameHeight, border: 0, display: 'block' }}
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 px-1 text-[13px] font-bold text-black underline decoration-brand decoration-2 underline-offset-4 hover:decoration-black"
      >
        Open the scheduler in a new tab
      </a>
    </div>
  );
}
