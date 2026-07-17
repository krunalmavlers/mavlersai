import Link from 'next/link';
import type { PageSection } from '@/lib/types';
import { getForm } from '@/lib/queries';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { HeroCanvas } from './HeroCanvas';
import { HeroVideo } from './HeroVideo';

/* ----------------------------- shared bits ------------------------------ */

function Eyebrow({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{children}</div>
  );
}

function CtaLink({
  label,
  href,
  style = 'primary',
}: {
  label: string;
  href: string;
  style?: string;
}) {
  if (style === 'link') {
    return (
      <Link href={href} className="text-[15px] font-bold text-body-soft hover:text-white">
        {label}
      </Link>
    );
  }
  if (style === 'outline' || style === 'secondary') {
    return (
      <Link
        href={href}
        className="rounded-xl border border-white/16 bg-white/5 px-7 py-4 text-[16px] font-bold text-body transition-colors hover:bg-white/10"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-xl bg-brand px-7 py-4 text-[16px] font-bold text-ink shadow-[0_10px_30px_rgba(255,203,46,0.4)] transition-colors hover:bg-brand-300"
    >
      {label}
    </Link>
  );
}

function SectionShell({
  bg,
  children,
  bordered,
}: {
  bg?: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`py-14 md:py-20 ${bordered ? 'border-y border-line' : ''}`}
      style={bg ? { background: bg } : undefined}
    >
      <div className="mx-auto max-w-page px-5 md:px-10">{children}</div>
    </section>
  );
}

/* ------------------------------ sections -------------------------------- */

function Hero({ c }: { c: any }) {
  const hasVideo = !!c.bg_video;
  return (
    <section className="relative overflow-hidden pb-16 pt-16 md:pb-20 md:pt-24">
      {hasVideo ? (
        <>
          <HeroVideo src={c.bg_video} poster={c.bg_video_poster} />
          {/* Legibility overlay: dark on the left (under the copy), fading right + a bottom fade. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg,rgba(10,14,26,0.94) 0%,rgba(10,14,26,0.6) 48%,rgba(10,14,26,0.18) 100%),linear-gradient(180deg,rgba(10,14,26,0) 55%,#0A0E1A 100%)',
            }}
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 620px at 72% 8%,rgba(255,203,46,0.16),transparent 60%),linear-gradient(180deg,rgba(10,14,26,0) 40%,#0A0E1A 100%)',
          }}
        />
      )}
      <div className="relative mx-auto max-w-page px-5 md:px-10">
        {!hasVideo && c.animated && <HeroCanvas />}
        <div className="relative z-10 max-w-[760px]">
          {c.badge && (
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-[7px] text-[12.5px] font-semibold text-brand-200">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_#FFCB2E]" />
              {c.badge}
            </div>
          )}
          <h1
            className="m-0 mb-6 font-display text-[40px] font-bold leading-[1.04] tracking-[-0.03em] text-white md:text-[64px] [&_span]:text-brand-400"
            dangerouslySetInnerHTML={{ __html: c.heading_html || '' }}
          />
          {c.subhead && (
            <p className="m-0 mb-9 max-w-[660px] text-[18px] leading-relaxed text-body-muted md:text-[19px]">
              {c.subhead}
            </p>
          )}
          <div className="mb-5 flex flex-wrap gap-3.5">
            {c.primary_cta?.label && <CtaLink {...c.primary_cta} style="primary" />}
            {c.secondary_cta?.label && <CtaLink {...c.secondary_cta} style="outline" />}
          </div>
          {c.note && <p className="m-0 text-[13.5px] text-body-dim">{c.note}</p>}
        </div>
        {Array.isArray(c.trust_items) && c.trust_items.length > 0 && (
          <div className="relative z-10 mt-12 flex flex-wrap gap-2.5">
            {c.trust_items.map((t: string) => (
              <div
                key={t}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-[15px] py-[9px] text-[13px] font-medium text-body-soft"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-brand" />
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatsBar({ c }: { c: any }) {
  return (
    <SectionShell bg="#080B14" bordered>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
        {(c.stats || []).map((s: any, i: number) => (
          <div key={i}>
            <div className="font-display text-[36px] font-bold leading-none tracking-[-0.02em] text-white">
              {s.num}
            </div>
            <div className="mt-[7px] text-[12.5px] leading-snug text-body-faint">{s.label}</div>
          </div>
        ))}
      </div>
      {Array.isArray(c.logos) && c.logos.length > 0 && (
        <div className="mt-11 border-t border-line pt-8">
          {c.logos_title && (
            <div className="mb-5 text-center text-[12px] uppercase tracking-[0.1em] text-[#5E6A7D]">
              {c.logos_title}
            </div>
          )}
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-14">
              {[...c.logos, ...c.logos].map((l: string, i: number) => (
                <span
                  key={i}
                  className="whitespace-nowrap font-display text-[20px] font-semibold text-[#4B5568]"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}

function FeatureGrid({ c }: { c: any }) {
  const cols = Number(c.columns) === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  return (
    <SectionShell bg="#0E1320">
      <div className="mb-10 max-w-[720px]">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && (
          <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
            {c.heading}
          </h2>
        )}
      </div>
      <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${cols}`}>
        {(c.items || []).map((it: any, i: number) => (
          <div key={i} className="rounded-[18px] border border-white/9 bg-white/[0.04] p-[26px]">
            {it.n && (
              <div className="mb-5 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-brand/15 font-display font-bold text-brand">
                {it.n}
              </div>
            )}
            <h3 className="m-0 mb-3 font-display text-[18px] font-semibold leading-snug text-white">
              {it.title}
            </h3>
            {it.body && <p className="m-0 text-[14.5px] leading-relaxed text-body-faint">{it.body}</p>}
          </div>
        ))}
      </div>
      {c.callout && (
        <div className="mt-9 flex flex-wrap items-center justify-between gap-5 rounded-[18px] bg-ink p-8">
          <p className="m-0 max-w-[760px] font-display text-[20px] font-semibold leading-snug text-white md:text-[22px]">
            {c.callout.text}
          </p>
          {c.callout.cta?.label && <CtaLink {...c.callout.cta} style="primary" />}
        </div>
      )}
    </SectionShell>
  );
}

function Partnership({ c }: { c: any }) {
  return (
    <SectionShell>
      <div className="mx-auto mb-10 max-w-[640px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
          {c.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-10">
          <div className="mb-6 font-display text-[22px] font-bold text-white">{c.left_title}</div>
          <div className="flex flex-col gap-4">
            {(c.left_items || []).map((a: string) => (
              <div key={a} className="flex items-center gap-3 text-[15.5px] text-body-soft">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/10 text-[12px] text-brand-200">
                  ◇
                </span>
                {a}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-brand/30 bg-gradient-to-b from-brand/15 to-brand/5 p-10">
          <div className="mb-6 font-display text-[22px] font-bold text-white">{c.right_title}</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(c.right_items || []).map((m: string) => (
              <div key={m} className="flex items-center gap-2.5 text-[14.5px] text-[#DCE4F2]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/25 text-[11px] text-brand-200">
                  ✓
                </span>
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ServiceCapabilities({ c }: { c: any }) {
  return (
    <SectionShell bg="#0B0F1B">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-[640px]">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
            {c.heading}
          </h2>
        </div>
        {c.link?.href && (
          <Link href={c.link.href} className="whitespace-nowrap text-[15px] font-bold text-brand">
            {c.link.label}
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((s: any, i: number) => (
          <div
            key={i}
            className="rounded-[18px] border border-white/9 bg-white/[0.04] p-[26px] transition-all hover:-translate-y-1 hover:border-brand/50"
          >
            <div className="mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-brand/15 font-display text-[18px] font-bold text-brand">
              {s.mono}
            </div>
            <h3 className="m-0 mb-2.5 font-display text-[17px] font-semibold leading-snug text-white">
              {s.title}
            </h3>
            {s.body && <p className="m-0 text-[13.5px] leading-relaxed text-body-faint">{s.body}</p>}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ServicesDetail({ c }: { c: any }) {
  const items: any[] = c.items || [];
  const primary = c.cta_primary || { label: 'Connect with an AI expert', href: '/book-a-call' };
  const secondary = c.cta_secondary || { label: 'Submit a project brief', href: '/book-a-call' };
  return (
    <SectionShell>
      {items.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {items.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-white/10 bg-white/5 px-3.5 py-[7px] text-[12.5px] font-semibold text-body-muted transition-colors hover:border-brand/50 hover:text-white"
            >
              {s.short || s.title}
            </a>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-7">
        {items.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className="grid scroll-mt-[150px] grid-cols-1 gap-8 rounded-[22px] border border-white/9 bg-white/[0.035] p-6 md:p-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-11"
          >
            {/* identity */}
            <div>
              <div className="mb-5 flex items-center gap-3.5">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-brand/15 font-display text-[16px] font-bold text-brand">
                  {s.mono}
                </div>
                {s.cat && (
                  <span className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6E7889]">
                    {s.cat}
                  </span>
                )}
              </div>
              <h2 className="m-0 mb-3.5 font-display text-[24px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[26px]">
                {s.title}
              </h2>
              {s.tagline && <p className="m-0 mb-5 text-[15px] leading-relaxed text-body-muted">{s.tagline}</p>}

              {Array.isArray(s.stack) && s.stack.length > 0 && (
                <div className="border-t border-white/8 pt-4">
                  <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#6E7889]">
                    Typical stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.stack.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-[7px] border border-white/8 bg-white/[0.06] px-2.5 py-[5px] text-[11.5px] font-semibold text-[#DDE4F0]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {s.outcome && (
                <div className="mt-5 rounded-[12px] border border-brand/25 bg-brand/[0.07] p-4">
                  <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.06em] text-brand">
                    Business outcome
                  </div>
                  <p className="m-0 text-[13.5px] leading-relaxed text-[#DDE4F0]">{s.outcome}</p>
                </div>
              )}

              <div className="mt-5 border-t border-white/8 pt-4">
                <div className="mb-3 text-[13.5px] font-semibold text-body">Have a similar requirement?</div>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href={primary.href}
                    className="rounded-[9px] bg-brand px-4 py-2.5 text-[13px] font-bold text-ink hover:bg-brand-300"
                  >
                    {primary.label}
                  </Link>
                  <Link
                    href={secondary.href}
                    className="rounded-[9px] border border-white/16 bg-white/5 px-4 py-2.5 text-[13px] font-bold text-body hover:bg-white/10"
                  >
                    {secondary.label}
                  </Link>
                </div>
              </div>
            </div>

            {/* technical detail */}
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-9">
              {Array.isArray(s.build) && (
                <div>
                  <div className="mb-3.5 font-display text-[12.5px] font-bold uppercase tracking-[0.05em] text-brand-400">
                    What we build
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {s.build.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-brand/[0.18] text-[10px] text-brand">
                          ✓
                        </span>
                        <span className="text-[13.5px] leading-snug text-body-soft">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(s.detail) && (
                <div>
                  <div className="mb-3.5 font-display text-[12.5px] font-bold uppercase tracking-[0.05em] text-brand-400">
                    Engineering detail
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {s.detail.map((d: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 h-[5px] w-[5px] flex-shrink-0 rounded-full bg-brand" />
                        <span className="text-[13.5px] leading-snug text-body-soft">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ConnectGrid({ c }: { c: any }) {
  return (
    <SectionShell bg="#080B14" bordered>
      <div className="mx-auto mb-10 max-w-[640px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 mb-3.5 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
          {c.heading}
        </h2>
        {c.subhead && <p className="m-0 text-[16px] text-body-faint">{c.subhead}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {(c.items || []).map((it: string) => (
          <div
            key={it}
            className="rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-[22px] text-center transition-colors hover:border-brand/50 hover:bg-brand/[0.08]"
          >
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand/15 text-[15px] text-brand-400">
              ◈
            </div>
            <div className="text-[13px] font-semibold leading-snug text-body-soft">{it}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function CtaBand({ c }: { c: any }) {
  const isFinal = c.variant === 'final';
  if (c.variant === 'band') {
    return (
      <SectionShell>
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[22px] border border-brand/30 bg-gradient-to-br from-brand/[0.12] to-brand/[0.03] p-8 md:p-12">
          <div className="max-w-[640px]">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className="m-0 mb-3 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[32px]">
              {c.heading}
            </h2>
            {c.body && <p className="m-0 text-[16px] leading-relaxed text-body-soft">{c.body}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {(c.ctas || []).map((cta: any, i: number) => (
              <CtaLink key={i} label={cta.label} href={cta.href} style={cta.style} />
            ))}
          </div>
        </div>
      </SectionShell>
    );
  }
  return (
    <section
      className="relative overflow-hidden px-5 py-16 md:px-10 md:py-20"
      style={
        isFinal
          ? { background: 'radial-gradient(700px 400px at 50% 0%,rgba(255,203,46,0.2),transparent 65%)' }
          : { background: '#0E1320' }
      }
    >
      <div className="relative mx-auto max-w-[800px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2
          className={`m-0 mb-4 font-display font-bold leading-[1.1] tracking-[-0.02em] text-white ${
            isFinal ? 'text-[34px] md:text-[50px]' : 'text-[32px] md:text-[40px]'
          }`}
        >
          {c.heading}
        </h2>
        {c.body && (
          <p className="mx-auto mb-8 max-w-[640px] text-[17px] leading-relaxed text-body-muted md:text-[18px]">
            {c.body}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {(c.ctas || []).map((cta: any, i: number) => (
            <CtaLink key={i} label={cta.label} href={cta.href} style={cta.style} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessTimeline({ c }: { c: any }) {
  return (
    <SectionShell>
      <div className="mb-10 max-w-[640px]">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
          {c.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2 lg:grid-cols-4">
        {(c.steps || []).map((p: any, i: number) => (
          <div key={i} className="relative border-t-2 border-brand/35 pb-9 pt-6">
            <div className="absolute -top-[9px] left-0 h-4 w-4 rounded-full bg-brand shadow-[0_0_0_4px_#0A0E1A,0_0_12px_rgba(255,203,46,0.6)]" />
            <div className="mb-2.5 font-display text-[13px] font-bold text-brand-400">Step {p.n}</div>
            <div className="font-display text-[16.5px] font-semibold leading-snug text-white">
              {p.title}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function EngagementModels({ c }: { c: any }) {
  return (
    <SectionShell bg="#0B0F1B">
      <div className="mx-auto mb-10 max-w-[620px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
          {c.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((e: any, i: number) => (
          <div
            key={i}
            className={`relative rounded-[18px] border p-7 ${
              e.featured ? 'border-brand bg-brand/10' : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            {e.featured && (
              <span className="absolute -top-[11px] left-7 rounded-full bg-brand px-3 py-[5px] text-[11px] font-bold text-ink">
                Most popular
              </span>
            )}
            <div className="mb-2 font-display text-[14px] font-bold text-brand">{e.step}</div>
            <h3 className="m-0 mb-3 font-display text-[19px] font-semibold leading-snug text-white">
              {e.title}
            </h3>
            <p className="m-0 text-[14px] leading-relaxed text-body-faint">{e.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Pillars({ c }: { c: any }) {
  return (
    <SectionShell bg="#0E1320">
      <div className="mb-10 max-w-[600px]">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
          {c.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(c.items || []).map((p: any, i: number) => (
          <div key={i} className="flex gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/15 text-[18px] text-brand">
              ✓
            </div>
            <div>
              <h3 className="m-0 mb-2 font-display text-[17px] font-semibold leading-snug text-white">
                {p.title}
              </h3>
              {p.body && <p className="m-0 text-[13.5px] leading-relaxed text-body-faint">{p.body}</p>}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function TrustBand({ c }: { c: any }) {
  return (
    <section
      className="border-t border-line py-12 md:py-16"
      style={{ background: 'linear-gradient(120deg,#0C111F,#0A0E1A)' }}
    >
      <div className="mx-auto max-w-page px-5 text-center md:px-10">
        {c.eyebrow && (
          <div className="mb-3.5 inline-flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.06em] text-brand-200">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {c.eyebrow}
          </div>
        )}
        <p className="mx-auto m-0 max-w-[820px] font-display text-[22px] font-semibold leading-[1.4] text-white md:text-[26px]">
          {c.text}
        </p>
      </div>
    </section>
  );
}

function RichText({ c }: { c: any }) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-[760px]">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && (
          <h2 className="m-0 mb-6 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[40px]">
            {c.heading}
          </h2>
        )}
        <div className="prose-mavlers" dangerouslySetInnerHTML={{ __html: c.html || '' }} />
      </div>
    </SectionShell>
  );
}

function Faq({ c }: { c: any }) {
  return (
    <SectionShell bg="#0B0F1B">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-10 text-center">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="m-0 font-display text-[30px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[38px]">
            {c.heading}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {(c.items || []).map((f: any, i: number) => (
            <details
              key={i}
              className="group rounded-[14px] border border-white/9 bg-white/[0.03] p-5 [&_summary]:cursor-pointer"
            >
              <summary className="flex list-none items-center justify-between font-display text-[16px] font-semibold text-white">
                {f.q}
                <span className="text-brand transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-body-faint">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function ComparisonTable({ c }: { c: any }) {
  return (
    <SectionShell bg="#0E1320">
      <div className="mx-auto mb-10 max-w-[640px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 font-display text-[30px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[40px]">
          {c.heading}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-[14px] border border-white/9 text-left">
          <thead>
            <tr className="bg-white/[0.04]">
              {(c.columns || []).map((h: string, i: number) => (
                <th
                  key={i}
                  className={`p-4 font-display text-[14px] font-bold ${i === 0 ? 'text-body-faint' : 'text-white'} ${
                    i === (c.columns.length - 1) ? 'text-brand' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(c.rows || []).map((r: any, i: number) => (
              <tr key={i} className="border-t border-white/8">
                <td className="p-4 text-[14px] font-semibold text-body-soft">{r.label}</td>
                {(r.values || []).map((v: string, j: number) => (
                  <td
                    key={j}
                    className={`p-4 text-[14px] ${
                      j === (r.values.length - 1) ? 'font-semibold text-brand-200' : 'text-body-faint'
                    }`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

function Packages({ c }: { c: any }) {
  return (
    <SectionShell bg="#0B0F1B">
      <div id="packages" className="mx-auto mb-10 max-w-[620px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="m-0 font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[44px]">
          {c.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((p: any, i: number) => (
          <div
            key={i}
            className={`relative rounded-[18px] border p-7 ${
              p.featured ? 'border-brand bg-brand/10' : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            {p.featured && (
              <span className="absolute -top-[11px] left-7 rounded-full bg-brand px-3 py-[5px] text-[11px] font-bold text-ink">
                Most chosen
              </span>
            )}
            <div className="mb-1 font-display text-[13px] font-bold text-brand">{p.duration}</div>
            <h3 className="m-0 mb-3 font-display text-[19px] font-semibold leading-snug text-white">
              {p.name}
            </h3>
            <p className="m-0 text-[14px] leading-relaxed text-body-faint">{p.desc}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Newsletter({ c }: { c: any }) {
  return (
    <SectionShell bg="#0E1320">
      <div className="mx-auto max-w-[640px] rounded-[20px] border border-white/9 bg-white/[0.03] p-10 text-center">
        <h2 className="m-0 mb-3 font-display text-[26px] font-bold text-white">{c.heading}</h2>
        {c.body && <p className="m-0 mb-6 text-[15px] text-body-faint">{c.body}</p>}
        <form className="mx-auto flex max-w-[440px] flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder={c.placeholder || 'you@agency.com'}
            className="flex-1 rounded-[10px] border border-white/12 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-body-dim"
          />
          <button
            type="submit"
            className="rounded-[10px] bg-brand px-6 py-3 text-[14px] font-bold text-ink"
          >
            {c.button || 'Subscribe'}
          </button>
        </form>
      </div>
    </SectionShell>
  );
}

async function FormSection({ c }: { c: any }) {
  const form = c.form_key ? await getForm(c.form_key) : null;
  if (!form) {
    return (
      <SectionShell>
        <p className="text-center text-body-dim">Form not found.</p>
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <DynamicForm form={form} />
    </SectionShell>
  );
}

/* ----------------------------- renderer --------------------------------- */

export async function SectionRenderer({ section }: { section: PageSection }) {
  const c = section.content || {};
  switch (section.type) {
    case 'hero':
      return <Hero c={c} />;
    case 'stats_bar':
      return <StatsBar c={c} />;
    case 'feature_grid':
      return <FeatureGrid c={c} />;
    case 'partnership':
      return <Partnership c={c} />;
    case 'service_capabilities':
      return <ServiceCapabilities c={c} />;
    case 'services_detail':
      return <ServicesDetail c={c} />;
    case 'connect_grid':
      return <ConnectGrid c={c} />;
    case 'cta_band':
      return <CtaBand c={c} />;
    case 'process_timeline':
      return <ProcessTimeline c={c} />;
    case 'engagement_models':
      return <EngagementModels c={c} />;
    case 'pillars':
      return <Pillars c={c} />;
    case 'trust_band':
      return <TrustBand c={c} />;
    case 'rich_text':
      return <RichText c={c} />;
    case 'faq':
      return <Faq c={c} />;
    case 'comparison_table':
      return <ComparisonTable c={c} />;
    case 'packages':
      return <Packages c={c} />;
    case 'newsletter':
      return <Newsletter c={c} />;
    case 'form':
      return <FormSection c={c} />;
    default:
      return null;
  }
}
