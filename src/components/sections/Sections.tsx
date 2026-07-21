import Link from 'next/link';
import type { PageSection } from '@/lib/types';
import { getForm } from '@/lib/queries';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { HeroVideo } from './HeroVideo';
import { HeroRobot } from './HeroRobot';

/* ----------------------------- shared bits ------------------------------ */

const PAD = 'py-[clamp(64px,8vw,108px)]';
const H2 =
  'm-0 font-display font-extrabold leading-[1.1] tracking-[-0.03em] text-[clamp(27px,3vw,40px)]';

function Eyebrow({ children, onDark }: { children?: React.ReactNode; onDark?: boolean }) {
  if (!children) return null;
  if (onDark) {
    return (
      <p className="m-0 text-[12px] font-bold uppercase tracking-[0.1em] text-brand">{children}</p>
    );
  }
  return (
    <p className="m-0 inline-block border-b-[3px] border-brand pb-1 text-[12px] font-bold uppercase tracking-[0.1em] text-black">
      {children}
    </p>
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
  if (!label) return null;
  if (style === 'link') {
    return (
      <Link href={href} className="hero-learn inline-flex items-center gap-2.5 text-[15.5px] font-bold text-black">
        {label}
        <span className="hero-learn-ico flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand text-black">
          →
        </span>
      </Link>
    );
  }
  if (style === 'outline' || style === 'secondary') {
    return (
      <Link
        href={href}
        className="rounded-full border-[1.5px] border-black px-[30px] py-4 text-[16px] font-bold text-black transition-colors hover:bg-black hover:text-white"
      >
        {label}
      </Link>
    );
  }
  if (style === 'brand') {
    return (
      <Link
        href={href}
        className="rounded-full bg-brand px-[30px] py-4 text-[16px] font-bold text-black transition-colors hover:bg-brand-300"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-full bg-black px-[30px] py-4 text-[16px] font-bold text-white transition-colors hover:bg-[#1a1a1a]"
    >
      {label}
    </Link>
  );
}

type Theme = 'light' | 'tint' | 'tint2' | 'dark' | 'darker';
const BG: Record<Theme, string> = {
  light: 'bg-white text-body',
  tint: 'bg-surface-tint text-body',
  tint2: 'bg-surface-tint2 text-body',
  dark: 'bg-black text-white',
  darker: 'bg-ink-900 text-white',
};

function Section({
  theme = 'light',
  children,
  narrow,
}: {
  theme?: Theme;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className={BG[theme]}>
      <div className={`mx-auto ${narrow ? 'max-w-[980px]' : 'max-w-page'} px-6 ${PAD}`}>{children}</div>
    </section>
  );
}

/* --------------------------------- Hero --------------------------------- */

function Hero({ c }: { c: any }) {
  const hasVideo = !!c.bg_video;
  const showVisual = !!c.animated && !hasVideo;
  return (
    <section className="relative overflow-hidden bg-white">
      {hasVideo && (
        <>
          <HeroVideo src={c.bg_video} poster={c.bg_video_poster} />
          <div className="pointer-events-none absolute inset-0 bg-white/70" />
        </>
      )}
      <div className="relative mx-auto max-w-page px-6 pb-[clamp(44px,5vw,76px)] pt-[clamp(56px,8vw,108px)]">
        <div className={showVisual ? 'grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]' : ''}>
          <div>
            {c.badge && (
              <div className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-black px-[15px] py-[7px] text-[12.5px] font-bold uppercase tracking-[0.01em] text-black">
                <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_3px_rgba(255,219,45,0.35)]" />
                {c.badge}
              </div>
            )}
            <h1
              className="m-0 mt-6 max-w-[17ch] font-display text-[clamp(34px,4.6vw,54px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-black [text-wrap:balance] [&_span]:bg-[linear-gradient(180deg,transparent_62%,#FFDB2D_62%)]"
              dangerouslySetInnerHTML={{ __html: c.heading_html || '' }}
            />
            {c.subhead && (
              <p className="m-0 mt-6 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-body-muted">
                {c.subhead}
              </p>
            )}
            <div className="mt-[34px] flex flex-wrap items-center gap-5">
              {c.primary_cta?.label && <CtaLink {...c.primary_cta} style={c.primary_cta.style || 'primary'} />}
              {c.secondary_cta?.label && <CtaLink {...c.secondary_cta} style={c.secondary_cta.style || 'link'} />}
            </div>
            {Array.isArray(c.trust_items) && c.trust_items.length > 0 && (
              <div className="mt-[30px] flex flex-wrap gap-2.5">
                {c.trust_items.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full border border-surface-line2 bg-surface-tint2 px-[14px] py-2 text-[13px] font-semibold text-[#222]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          {showVisual && (
            <div className="hidden lg:block">
              <HeroRobot />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Stats --------------------------------- */

function StatsBar({ c }: { c: any }) {
  return (
    <>
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-9 px-6 py-[clamp(46px,5vw,66px)]">
          {(c.stats || []).map((s: any, i: number) => (
            <div key={i}>
              <div className="font-display text-[clamp(36px,4vw,50px)] font-extrabold leading-none tracking-[-0.03em] text-brand">
                {s.num}
              </div>
              <div className="mt-1.5 text-[13.5px] font-medium text-body-onDark">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      {Array.isArray(c.logos) && c.logos.length > 0 && (
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-page px-6 py-[clamp(40px,5vw,58px)]">
            {c.logos_title && (
              <p className="m-0 mb-7 text-center text-[12px] font-bold uppercase tracking-[0.1em] text-[#999]">
                {c.logos_title}
              </p>
            )}
            <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
              <div className="flex w-max animate-marquee gap-[52px] font-display text-[22px] font-bold tracking-[-0.02em] text-[#1A1A1A]">
                {[...c.logos, ...c.logos].map((l: string, i: number) => (
                  <span key={i} className="whitespace-nowrap">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ---------------------- Feature grid (opportunity) ---------------------- */

function FeatureGrid({ c }: { c: any }) {
  const cols = Number(c.columns) === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  const numbered = (c.items || []).some((it: any) => it.n);
  return (
    <section className="bg-ink-900 text-white [background:radial-gradient(1200px_500px_at_78%_-10%,rgba(255,219,45,0.14),transparent_60%),#0A0A0A]">
      <div className={`mx-auto max-w-page px-6 ${PAD}`}>
        {c.eyebrow && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/40 px-5 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-brand">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_1px_rgba(255,219,45,0.7)]" />
            {c.eyebrow}
          </div>
        )}
        {c.heading && <h2 className={`${H2} mt-6 max-w-[20ch] text-white`}>{c.heading}</h2>}
        <div className={`mt-14 grid grid-cols-1 gap-[22px] sm:grid-cols-2 ${cols}`}>
          {(c.items || []).map((it: any, i: number) => (
            <div
              key={i}
              className="opp-card relative overflow-hidden rounded-[20px] border border-[#232323] p-8 [background:linear-gradient(180deg,#121212,#0D0D0D)]"
            >
              {numbered && (
                <span className="opp-num pointer-events-none absolute right-[22px] top-[14px] font-display text-[130px] font-extrabold leading-none tracking-[-0.04em] text-white/[0.035]">
                  {it.n || String(i + 1).padStart(2, '0')}
                </span>
              )}
              {it.tag && (
                <span className="text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-brand">{it.tag}</span>
              )}
              <h3 className="m-0 mb-3.5 mt-5 font-display text-[20px] font-bold leading-tight tracking-[-0.015em] text-white">
                {it.title}
              </h3>
              {it.body && <p className="m-0 text-[15px] leading-relaxed text-[#9A9A9A]">{it.body}</p>}
            </div>
          ))}
        </div>
        {c.callout && (
          <div className="mt-11 flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand p-[clamp(30px,4vw,48px)]">
            <p className="m-0 max-w-[40ch] font-display text-[clamp(19px,2.2vw,27px)] font-bold leading-tight tracking-[-0.02em] text-black">
              {c.callout.text}
            </p>
            {c.callout.cta?.label && <CtaLink {...c.callout.cta} style="primary" />}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------- Partnership model -------------------------- */

function Partnership({ c }: { c: any }) {
  return (
    <Section theme="light">
      <Eyebrow>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-[22px] text-black`}>{c.heading}</h2>}
      <div className="mt-12 grid grid-cols-1 gap-[22px] lg:grid-cols-2">
        <div className="rounded-[22px] border border-ink-600 bg-ink-card p-9">
          <h3 className="m-0 mb-[22px] font-display text-[20px] font-bold tracking-[-0.015em] text-white">
            {c.left_title}
          </h3>
          <div className="flex flex-col gap-3.5">
            {(c.left_items || []).map((a: string) => (
              <div key={a} className="flex items-center gap-3 text-[15.5px] text-[#D2D2D2]">
                <span className="text-[#666]">◇</span>
                {a}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[22px] bg-brand p-9">
          <h3 className="m-0 mb-[22px] font-display text-[20px] font-bold tracking-[-0.015em] text-black">
            {c.right_title}
          </h3>
          <div className="grid grid-cols-1 gap-x-5 gap-y-3.5 sm:grid-cols-2">
            {(c.right_items || []).map((m: string) => (
              <div key={m} className="flex items-center gap-2.5 text-[15px] font-semibold text-black">
                <span>✓</span>
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------- Services (what we build) --------------------- */

function ServiceCapabilities({ c }: { c: any }) {
  return (
    <Section theme="light">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          {c.heading && <h2 className={`${H2} mt-[22px] max-w-[22ch] text-black [text-wrap:balance]`}>{c.heading}</h2>}
        </div>
        {c.link?.href && (
          <Link href={c.link.href} className="border-b-2 border-brand pb-0.5 text-[15px] font-bold text-black">
            {c.link.label}
          </Link>
        )}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((s: any, i: number) => (
          <div
            key={i}
            className="svc-card relative rounded-[18px] border border-surface-line2 bg-surface-tint px-[22px] py-6"
          >
            <div className="flex items-start justify-between">
              <div className="svc-ico flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-black font-display text-[15px] font-bold text-brand">
                {s.mono}
              </div>
              <span className="svc-arrow inline-flex text-black opacity-0 [transform:translateX(-6px)]">↗</span>
            </div>
            <h3 className="m-0 mb-1.5 mt-[18px] font-display text-[16.5px] font-extrabold tracking-[-0.01em] text-black">
              {s.title}
            </h3>
            {s.body && <p className="m-0 text-[13.5px] leading-snug text-body-faint">{s.body}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- What we connect ---------------------------- */

function ConnectGrid({ c }: { c: any }) {
  return (
    <Section theme="dark">
      <Eyebrow onDark>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-[18px] text-white`}>{c.heading}</h2>}
      {c.subhead && <p className="m-0 mt-[18px] max-w-[60ch] text-[16px] leading-relaxed text-body-onDark">{c.subhead}</p>}
      <div className="mt-11 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(c.items || []).map((it: string) => (
          <div
            key={it}
            className="conn-tile flex items-center gap-3.5 rounded-[16px] border border-[#262626] bg-ink-700 px-5 py-[18px] text-[15px] font-semibold text-[#E4E4E4]"
          >
            <span className="conn-ico flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-[#1C1C1C] text-brand">
              ◈
            </span>
            {it}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- Implementations ---------------------------- */

function Implementations({ c }: { c: any }) {
  return (
    <Section theme="light">
      <div className="grid grid-cols-1 items-center gap-11 rounded-[26px] border border-surface-line2 bg-surface-tint p-[clamp(32px,5vw,62px)] lg:grid-cols-2">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          {c.heading && <h2 className={`${H2} mt-[22px] text-black [text-wrap:balance]`}>{c.heading}</h2>}
          {c.subhead && <p className="m-0 mt-5 text-[16px] leading-relaxed text-body-faint">{c.subhead}</p>}
          {c.cta?.label && (
            <Link
              href={c.cta.href || '#'}
              className="mt-7 inline-block rounded-full bg-black px-7 py-[15px] text-[15px] font-bold text-brand"
            >
              {c.cta.label} →
            </Link>
          )}
        </div>
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] border border-[#EFECE0] [background:radial-gradient(120%_120%_at_30%_20%,#FFFDF4,#FFFFFF)]">
          <HeroRobot compact />
        </div>
      </div>
    </Section>
  );
}

/* --------------------------- Engagement models -------------------------- */

function EngagementModels({ c }: { c: any }) {
  return (
    <Section theme="tint2">
      <Eyebrow>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-[22px] text-black`}>{c.heading}</h2>}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((e: any, i: number) => (
          <div
            key={i}
            className={`relative rounded-[18px] border p-[30px] ${
              e.featured ? 'border-black bg-black' : 'border-[#E7E7E3] bg-white'
            }`}
          >
            {e.featured && (
              <span className="absolute -top-[11px] left-[30px] rounded-full bg-brand px-3 py-[5px] text-[11px] font-bold uppercase tracking-[0.04em] text-black">
                Most popular
              </span>
            )}
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-brand font-display text-[15px] font-extrabold text-black">
              {e.step}
            </div>
            <h3 className={`m-0 mb-2.5 mt-4 font-display text-[20px] font-bold tracking-[-0.015em] ${e.featured ? 'text-white' : 'text-black'}`}>
              {e.title}
            </h3>
            <p className={`m-0 text-[14.5px] leading-snug ${e.featured ? 'text-body-onDark' : 'text-body-faint'}`}>
              {e.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- Delivery roadmap --------------------------- */

function ProcessTimeline({ c }: { c: any }) {
  const steps: any[] = c.steps || [];
  return (
    <Section theme="dark" narrow>
      <Eyebrow onDark>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-[18px] text-white`}>{c.heading}</h2>}
      {c.subhead && <p className="m-0 mt-[18px] max-w-[60ch] text-[16px] leading-relaxed text-body-onDark">{c.subhead}</p>}
      <div className="relative mt-14">
        <div className="absolute bottom-[26px] left-[27px] top-[26px] w-0.5 rounded [background:linear-gradient(180deg,#FFDB2D,rgba(255,219,45,0.12))]" />
        <div className="flex flex-col gap-[18px]">
          {steps.map((p, i) => (
            <div key={i} className="rm-row flex items-center gap-[22px]">
              <div className="rm-node z-[1] flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-brand font-display text-[20px] font-extrabold text-black">
                {p.n || i + 1}
              </div>
              <div className="rm-card flex flex-1 items-center gap-[18px] rounded-[16px] border border-[#262626] bg-ink-700 px-6 py-5">
                <div>
                  <div className="font-display text-[12px] font-extrabold uppercase tracking-[0.1em] text-brand">
                    Step {p.n || i + 1}
                  </div>
                  <div className="mt-1 font-display text-[18px] font-bold text-white">{p.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------- Pillars -------------------------------- */

function Pillars({ c }: { c: any }) {
  return (
    <Section theme="light">
      <Eyebrow>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-[22px] max-w-[24ch] text-black [text-wrap:balance]`}>{c.heading}</h2>}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(c.items || []).map((p: any, i: number) => (
          <div key={i} className="rounded-[18px] border border-surface-line2 bg-surface-tint p-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand font-extrabold text-black">
              ✓
            </div>
            <h3 className="m-0 mb-2 mt-[18px] font-display text-[20px] font-bold tracking-[-0.015em] text-black">
              {p.title}
            </h3>
            {p.body && <p className="m-0 text-[14.5px] leading-snug text-body-faint">{p.body}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------- CTA band ------------------------------- */

function CtaBand({ c }: { c: any }) {
  if (c.variant === 'band') {
    return (
      <Section theme="light">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand p-8 md:p-12">
          <div className="max-w-[640px]">
            <h2 className={`${H2} text-black`}>{c.heading}</h2>
            {c.body && <p className="m-0 mt-3 text-[16px] leading-relaxed text-[#1a1a1a]">{c.body}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {(c.ctas || []).map((cta: any, i: number) => (
              <CtaLink key={i} label={cta.label} href={cta.href} style={cta.style || 'primary'} />
            ))}
          </div>
        </div>
      </Section>
    );
  }
  if (c.variant === 'final') {
    // full yellow CTA section (reference footer CTA)
    return (
      <section className="bg-brand">
        <div className={`mx-auto max-w-page px-6 text-center ${PAD}`}>
          <h2 className="m-0 mx-auto max-w-[18ch] font-display text-[clamp(30px,4.4vw,58px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-black [text-wrap:balance]">
            {c.heading}
          </h2>
          {c.body && (
            <p className="m-0 mx-auto mt-[22px] max-w-[56ch] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-[#1A1A1A]">
              {c.body}
            </p>
          )}
          <div className="mt-[34px] flex flex-wrap items-center justify-center gap-3.5">
            {(c.ctas || []).map((cta: any, i: number) => (
              <CtaLink key={i} label={cta.label} href={cta.href} style={cta.style || (i === 0 ? 'primary' : 'outline')} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  // "center" / default — centered CTA on a light tint
  return (
    <Section theme="tint">
      <div className="mx-auto max-w-[800px] text-center">
        <div className="mx-auto inline-block">
          <Eyebrow>{c.eyebrow}</Eyebrow>
        </div>
        <h2 className={`${H2} mt-[22px] text-black [text-wrap:balance]`}>{c.heading}</h2>
        {c.body && (
          <p className="m-0 mx-auto mt-5 max-w-[640px] text-[17px] leading-relaxed text-body-muted">{c.body}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          {(c.ctas || []).map((cta: any, i: number) => (
            <CtaLink key={i} label={cta.label} href={cta.href} style={cta.style || 'primary'} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ Trust band ------------------------------ */

function TrustBand({ c }: { c: any }) {
  return (
    <section className="bg-black">
      <div className="mx-auto max-w-page px-6 py-14 text-center md:py-16">
        {c.eyebrow && (
          <div className="mb-3.5 inline-flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.1em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {c.eyebrow}
          </div>
        )}
        <p className="m-0 mx-auto max-w-[820px] font-display text-[22px] font-bold leading-[1.4] text-white md:text-[26px]">
          {c.text}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- Rich text ------------------------------ */

function RichText({ c }: { c: any }) {
  return (
    <Section theme="light" narrow>
      <div className="mx-auto max-w-[760px]">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && <h2 className={`${H2} mb-6 mt-[22px] text-black`}>{c.heading}</h2>}
        <div className="prose-mavlers" dangerouslySetInnerHTML={{ __html: c.html || '' }} />
      </div>
    </Section>
  );
}

/* ---------------------------------- FAQ --------------------------------- */

function Faq({ c }: { c: any }) {
  return (
    <Section theme="tint2" narrow>
      <div className="mx-auto max-w-[760px]">
        <div className="text-center">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          {c.heading && <h2 className={`${H2} mt-[22px] text-black`}>{c.heading}</h2>}
        </div>
        <div className="mt-10 flex flex-col gap-3">
          {(c.items || []).map((f: any, i: number) => (
            <details key={i} className="group rounded-[14px] border border-surface-line2 bg-white p-5 [&_summary]:cursor-pointer">
              <summary className="flex list-none items-center justify-between font-display text-[16px] font-bold text-black">
                {f.q}
                <span className="text-brand-ink transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-body-faint">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------- Services detail -------------------------- */

function ServicesDetail({ c }: { c: any }) {
  const items: any[] = c.items || [];
  const primary = c.cta_primary || { label: 'Connect with an AI expert', href: '/book-a-call' };
  const secondary = c.cta_secondary || { label: 'Submit a project brief', href: '/book-a-call' };
  return (
    <Section theme="light">
      {items.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {items.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-surface-line2 bg-surface-tint px-3.5 py-[7px] text-[12.5px] font-semibold text-body-faint transition-colors hover:border-black hover:text-black"
            >
              {s.short || s.title}
            </a>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-6">
        {items.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className="grid scroll-mt-[150px] grid-cols-1 gap-8 rounded-[22px] border border-surface-line2 bg-surface-tint p-6 md:p-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-11"
          >
            <div>
              <div className="mb-5 flex items-center gap-3.5">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-black font-display text-[16px] font-bold text-brand">
                  {s.mono}
                </div>
                {s.cat && (
                  <span className="font-display text-[12px] font-bold uppercase tracking-[0.08em] text-body-dim">
                    {s.cat}
                  </span>
                )}
              </div>
              <h2 className="m-0 mb-3.5 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-black md:text-[26px]">
                {s.title}
              </h2>
              {s.tagline && <p className="m-0 mb-5 text-[15px] leading-relaxed text-body-muted">{s.tagline}</p>}
              {Array.isArray(s.stack) && s.stack.length > 0 && (
                <div className="border-t border-surface-line2 pt-4">
                  <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.06em] text-body-dim">Typical stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.stack.map((t: string) => (
                      <span key={t} className="rounded-[7px] border border-surface-line2 bg-white px-2.5 py-[5px] text-[11.5px] font-semibold text-body-soft">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {s.outcome && (
                <div className="mt-5 rounded-[12px] border border-brand bg-brand/[0.12] p-4">
                  <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.06em] text-brand-ink">Business outcome</div>
                  <p className="m-0 text-[13.5px] leading-relaxed text-body-soft">{s.outcome}</p>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5 border-t border-surface-line2 pt-5">
                <Link href={primary.href} className="rounded-full bg-black px-4 py-2.5 text-[13px] font-bold text-brand">
                  {primary.label}
                </Link>
                <Link href={secondary.href} className="rounded-full border-[1.5px] border-black px-4 py-2.5 text-[13px] font-bold text-black">
                  {secondary.label}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-9">
              {Array.isArray(s.build) && (
                <div>
                  <div className="mb-3.5 font-display text-[12.5px] font-bold uppercase tracking-[0.05em] text-brand-ink">What we build</div>
                  <div className="flex flex-col gap-2.5">
                    {s.build.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-brand text-[10px] text-black">✓</span>
                        <span className="text-[13.5px] leading-snug text-body-soft">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(s.detail) && (
                <div>
                  <div className="mb-3.5 font-display text-[12.5px] font-bold uppercase tracking-[0.05em] text-brand-ink">Engineering detail</div>
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
    </Section>
  );
}

/* --------------------------- Comparison table --------------------------- */

function ComparisonTable({ c }: { c: any }) {
  return (
    <Section theme="tint2">
      <div className="mx-auto max-w-[640px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && <h2 className={`${H2} mt-[22px] text-black`}>{c.heading}</h2>}
      </div>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-[14px] border border-surface-line2 text-left">
          <thead>
            <tr className="bg-white">
              {(c.columns || []).map((h: string, i: number) => (
                <th
                  key={i}
                  className={`p-4 font-display text-[14px] font-bold ${i === 0 ? 'text-body-faint' : 'text-black'} ${
                    i === (c.columns.length - 1) ? '!text-brand-ink' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(c.rows || []).map((r: any, i: number) => (
              <tr key={i} className="border-t border-surface-line2 bg-white">
                <td className="p-4 text-[14px] font-semibold text-black">{r.label}</td>
                {(r.values || []).map((v: string, j: number) => (
                  <td key={j} className={`p-4 text-[14px] ${j === (r.values.length - 1) ? 'font-semibold text-brand-ink' : 'text-body-faint'}`}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ------------------------------- Packages ------------------------------- */

function Packages({ c }: { c: any }) {
  return (
    <Section theme="tint2">
      <div id="packages" className="text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && <h2 className={`${H2} mt-[22px] text-black`}>{c.heading}</h2>}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((p: any, i: number) => (
          <div key={i} className={`relative rounded-[18px] border p-7 ${p.featured ? 'border-black bg-black' : 'border-[#E7E7E3] bg-white'}`}>
            {p.featured && (
              <span className="absolute -top-[11px] left-7 rounded-full bg-brand px-3 py-[5px] text-[11px] font-bold uppercase text-black">
                Most chosen
              </span>
            )}
            <div className={`mb-1 font-display text-[13px] font-bold ${p.featured ? 'text-brand' : 'text-brand-ink'}`}>{p.duration}</div>
            <h3 className={`m-0 mb-3 font-display text-[19px] font-bold tracking-[-0.015em] ${p.featured ? 'text-white' : 'text-black'}`}>
              {p.name}
            </h3>
            <p className={`m-0 text-[14px] leading-snug ${p.featured ? 'text-body-onDark' : 'text-body-faint'}`}>{p.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------ Newsletter ------------------------------ */

function Newsletter({ c }: { c: any }) {
  return (
    <Section theme="tint2">
      <div className="mx-auto max-w-[640px] rounded-[20px] border border-surface-line2 bg-white p-10 text-center">
        <h2 className="m-0 mb-3 font-display text-[26px] font-extrabold tracking-[-0.02em] text-black">{c.heading}</h2>
        {c.body && <p className="m-0 mb-6 text-[15px] text-body-faint">{c.body}</p>}
        <form className="mx-auto flex max-w-[440px] flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder={c.placeholder || 'you@agency.com'}
            className="flex-1 rounded-full border border-surface-line2 bg-surface-tint px-5 py-3 text-[14px] text-black placeholder:text-body-dim focus:border-black focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-black px-6 py-3 text-[14px] font-bold text-white">
            {c.button || 'Subscribe'}
          </button>
        </form>
      </div>
    </Section>
  );
}

async function FormSection({ c }: { c: any }) {
  const form = c.form_key ? await getForm(c.form_key) : null;
  if (!form) {
    return (
      <Section theme="light">
        <p className="text-center text-body-dim">Form not found.</p>
      </Section>
    );
  }
  return (
    <Section theme="light">
      <DynamicForm form={form} />
    </Section>
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
    case 'implementations':
      return <Implementations c={c} />;
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
