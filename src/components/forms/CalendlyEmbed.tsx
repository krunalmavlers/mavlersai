'use client';

/**
 * Inline Calendly scheduler card. The scheduling URL is configured in the
 * backend (Admin → Forms → Book a Call → Calendly URL). Themed to match the
 * dark brand.
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
  const sep = url.includes('?') ? '&' : '?';
  const themed =
    `${url}${sep}` +
    'embed_domain=mavlers.ai&embed_type=Inline&hide_gdpr_banner=1' +
    '&background_color=0a0e1a&text_color=e7ecf3&primary_color=ffcb2e';

  return (
    <div className="rounded-[18px] border border-white/9 bg-white/[0.03] p-4 md:p-5">
      {heading && <div className="mb-1 px-1 font-display text-[16px] font-bold text-white">{heading}</div>}
      {note && <p className="m-0 mb-3 px-1 text-[12.5px] text-body-dim">{note}</p>}
      <div className="overflow-hidden rounded-[12px] border border-white/8 bg-ink">
        <iframe
          src={themed}
          title="Schedule a call"
          loading="lazy"
          style={{ width: '100%', height, border: 0 }}
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block px-1 text-[13px] font-bold text-brand hover:text-brand-300"
      >
        Open scheduler in a new tab ↗
      </a>
    </div>
  );
}
