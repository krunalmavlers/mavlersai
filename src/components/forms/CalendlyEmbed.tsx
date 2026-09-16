'use client';

import { useEffect, useState } from 'react';

export type CalendlyHost = { name?: string; role?: string; photo?: string };

/** Initials, for before a photo is uploaded. "Krunal Bakraniya" -> "KB". */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

/**
 * The consultant the visitor is about to book. Calendly renders its own host
 * name inside the iframe, but that is cross-origin and unstyleable, so we
 * introduce the person ourselves on our side of the frame.
 */
function HostRow({ host }: { host: CalendlyHost }) {
  const name = host.name?.trim();
  if (!name) return null;
  return (
    <div className="mb-4 flex items-center gap-3.5 px-1">
      {host.photo ? (
        // Decorative: the name sits right beside it in text.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={host.photo}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="h-[56px] w-[56px] flex-none rounded-full object-cover object-top ring-2 ring-brand ring-offset-2 ring-offset-surface-tint"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-[56px] w-[56px] flex-none items-center justify-center rounded-full bg-brand font-display text-[18px] font-extrabold tracking-[-0.02em] text-black ring-2 ring-brand ring-offset-2 ring-offset-surface-tint"
        >
          {initials(name)}
        </span>
      )}
      <div className="min-w-0">
        <div className="font-display text-[16px] font-bold leading-tight text-black">{name}</div>
        {host.role && (
          <div className="mt-[3px] text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-body-faint">
            {host.role}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Inline Calendly scheduler card. The scheduling URL and the host details are
 * configured in the backend (Admin → Forms → Book a Call).
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
  host,
  height = 560,
}: {
  url: string;
  heading?: string;
  note?: string;
  host?: CalendlyHost;
  height?: number;
}) {
  const [frameHeight, setFrameHeight] = useState(height);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Other embeds and extensions post here too, and `e.origin` can be the
      // string "null" for sandboxed frames, which URL() rejects.
      let hostname = '';
      try {
        hostname = new URL(e.origin).hostname;
      } catch {
        return;
      }
      if (!/(^|\.)calendly\.com$/.test(hostname)) return;
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
      {host && <HostRow host={host} />}
      {heading && <div className="mb-1 px-1 font-display text-[16px] font-bold text-black">{heading}</div>}
      {note && <p className="m-0 mb-3 px-1 text-[12.5px] text-body-faint">{note}</p>}
      <div className="overflow-hidden rounded-[14px] border border-surface-line2 bg-white">
        <iframe
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
