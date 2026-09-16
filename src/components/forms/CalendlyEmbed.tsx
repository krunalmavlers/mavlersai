'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/sections/icons';

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
function HostRow({ host, duration }: { host: CalendlyHost; duration?: string }) {
  const name = host.name?.trim();
  if (!name) return null;
  return (
    <div className="flex items-center gap-4 border-b border-surface-line2 bg-surface-tint px-5 py-[18px] md:px-7">
      {host.photo ? (
        // Decorative: the name sits right beside it in text.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={host.photo}
          alt=""
          width={58}
          height={58}
          loading="lazy"
          className="h-[58px] w-[58px] flex-none rounded-full object-cover object-top ring-2 ring-brand ring-offset-2 ring-offset-surface-tint"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-[58px] w-[58px] flex-none items-center justify-center rounded-full bg-brand font-display text-[19px] font-extrabold tracking-[-0.02em] text-black ring-2 ring-brand ring-offset-2 ring-offset-surface-tint"
        >
          {initials(name)}
        </span>
      )}
      <div className="min-w-0">
        <div className="font-display text-[17px] font-bold leading-tight tracking-[-0.01em] text-black">
          {name}
        </div>
        {host.role && (
          <div className="mt-[3px] text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-brand-ink">
            {host.role}
          </div>
        )}
      </div>
      {duration && (
        <span className="ml-auto hidden flex-none items-center gap-2 rounded-full border border-surface-line2 bg-white px-3.5 py-2 text-[12.5px] font-bold text-black sm:inline-flex">
          <Icon name="clock" size={15} className="text-brand-ink" />
          {duration}
        </span>
      )}
    </div>
  );
}

/**
 * Inline Calendly scheduler, wrapped in our own booking card.
 *
 * Three things this has to get right:
 *
 *  - It renders inside a light section, so the card and the iframe's own page
 *    are painted light. The earlier dark theming was left over from when this
 *    sat on a dark band.
 *  - Calendly's own pages vary a lot in height, so a fixed iframe leaves either
 *    dead space or a scrollbar. Calendly posts its content height to the parent
 *    on every view change; we listen and follow it. `height` is only the
 *    starting guess for before the first message arrives (and the floor, so the
 *    card never collapses if no message ever comes).
 *  - Everything a visitor needs in order to commit to the call — who they are
 *    meeting, how long it takes, what it costs them — sits above the frame,
 *    where we control it, rather than inside Calendly where we do not.
 */
export function CalendlyEmbed({
  url,
  note,
  host,
  duration,
  facts = [],
  height = 700,
}: {
  url: string;
  note?: string;
  host?: CalendlyHost;
  /** e.g. "30 minutes". Shown beside the consultant and in the fact strip. */
  duration?: string;
  /** Short reassurances, one line. Drives the strip under the consultant. */
  facts?: string[];
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
      if (Number.isFinite(h) && h > 0) setFrameHeight(Math.max(h, 420));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const sep = url.includes('?') ? '&' : '?';
  const themed =
    `${url}${sep}` +
    'embed_domain=mavlers.ai&embed_type=Inline&hide_gdpr_banner=1' +
    // Calendly repeats the host name, event name and duration above its
    // calendar. We already state all three, in our own type, so hiding
    // Calendly's header removes the duplication and leaves the frame to do
    // one job: show times.
    '&hide_landing_page_details=1&hide_event_type_details=1' +
    '&background_color=ffffff&text_color=1a1a1a&primary_color=1a1a1a';

  return (
    <div className="overflow-hidden rounded-[22px] border border-surface-line2 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_46px_-30px_rgba(0,0,0,0.3)]">
      {host && <HostRow host={host} duration={duration} />}

      {facts.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 border-b border-surface-line2 px-5 py-3.5 md:px-7">
          {facts.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[13px] font-semibold text-body-faint">
              <Icon name="check-check" size={15} className="flex-none text-brand-ink" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="px-2 pb-2 pt-1 md:px-3 md:pb-3">
        <iframe
          src={themed}
          title="Schedule a call"
          loading="lazy"
          style={{ width: '100%', height: frameHeight, border: 0, display: 'block' }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-surface-line2 bg-surface-tint px-5 py-3.5 md:px-7">
        {note && <p className="m-0 text-[12.5px] text-body-dim">{note}</p>}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-black underline decoration-brand decoration-2 underline-offset-4 hover:decoration-black"
        >
          Open the scheduler in a new tab
          <Icon name="arrow-up-right" size={14} />
        </a>
      </div>
    </div>
  );
}
