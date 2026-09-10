import Link from 'next/link';
import type { PageSection } from '@/lib/types';
import { getForm, getPosts, getSettings } from '@/lib/queries';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { HeroVideo } from './HeroVideo';
import { HeroRobot } from './HeroRobot';
import { HeroAiScene } from './HeroAiScene';
import { HeroSignalLattice, HeroAssemblyFloor, HeroEmergence } from './HeroConcepts';
import { Icon, serviceIconName, connectIconName, stepIconName, engagementIconName } from './icons';
import { CountUp } from './CountUp';
import { ScrollScene } from './ScrollScene';
import { CaseStudySlider } from './CaseStudySlider';

/* ----------------------------- shared bits ------------------------------ */

const PAD = 'py-[clamp(30px,3.4vw,48px)]';
// Half-height padding for prose blocks that read as one continuous narrative.
const PAD_SM = 'py-[clamp(16px,1.8vw,26px)]';

// Brand logos for the "platforms agencies build on" marquee. Names in the CMS
// map to a self-hosted SVG; anything unmapped falls back to a text wordmark.
const PLATFORM_LOGOS: Record<string, string> = {
  salesforce: '/logos/salesforce.svg',
  microsoft: '/logos/microsoft.svg',
  braze: '/logos/braze.svg',
  zendesk: '/logos/zendesk.svg',
  shopify: '/logos/shopify.svg',
  hubspot: '/logos/hubspot.svg',
  n8n: '/logos/n8n.svg',
  slack: '/logos/slack.svg',
};
const platformLogo = (name: string) =>
  PLATFORM_LOGOS[name.toLowerCase().replace(/[^a-z0-9]/g, '')];
const H2 =
  'm-0 font-display font-extrabold leading-[1.1] tracking-[-0.03em] text-[clamp(23px,2.4vw,32px)]';

/**
 * Splits a heading into words so each can rise on its own slice of the
 * section's scroll progress. Server-rendered markup only — the motion is CSS
 * driven by --p, so there is no client cost and the plain heading is what
 * renders without JavaScript.
 *
 * `offset` delays the whole line against --p, for headings that sit lower in
 * the section than the element driving the scene.
 */
function SplitHeading({ text, offset = 0 }: { text?: string; offset?: number }) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  return (
    <span className="sx" style={{ '--wo': offset, '--wn': words.length } as React.CSSProperties}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="sh-w" style={{ '--w': i } as React.CSSProperties}>
          <span className="sh-i">{w}</span>
        </span>
      ))}
    </span>
  );
}

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
          <Icon name="arrow-right" size={18} />
        </span>
      </Link>
    );
  }
  if (style === 'outline' || style === 'secondary') {
    return (
      <Link
        href={href}
        className="rounded-full border-[1.5px] border-black px-[26px] py-[13px] text-[15px] font-bold text-black transition-colors hover:bg-black hover:text-white"
      >
        {label}
      </Link>
    );
  }
  if (style === 'brand') {
    return (
      <Link
        href={href}
        className="rounded-full bg-brand px-[26px] py-[13px] text-[15px] font-bold text-black transition-colors hover:bg-brand-300"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-full bg-black px-[26px] py-[13px] text-[15px] font-bold text-white transition-colors hover:bg-[#1a1a1a]"
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
  compact,
}: {
  theme?: Theme;
  children: React.ReactNode;
  narrow?: boolean;
  compact?: boolean;
}) {
  return (
    <section className={BG[theme]}>
      <div className={`mx-auto ${narrow ? 'max-w-[980px]' : 'max-w-page'} px-6 ${compact ? PAD_SM : PAD}`}>
        {children}
      </div>
    </section>
  );
}

/* --------------------------------- Hero --------------------------------- */

/**
 * Animations available to a hero's `visual` field. Keep the keys in sync with
 * the `visual` options in src/components/admin/sectionSchemas.ts.
 */
function renderHeroVisual(visual: string) {
  switch (visual) {
    case 'ai-pipeline':
      return <HeroAiScene />;
    case 'signal-lattice':
      return <HeroSignalLattice />;
    case 'assembly-floor':
      return <HeroAssemblyFloor />;
    case 'emergence':
      return <HeroEmergence />;
    default:
      return <HeroRobot />;
  }
}

function Hero({ c }: { c: any }) {
  const hasVideo = !!c.bg_video;
  // `image` wins over the animated robot when both are set.
  const showImage = !!c.image && !hasVideo;
  // Which animation fills the space beside the copy — see HERO_VISUALS below.
  // Legacy `animated: true` still means the mascot.
  const visual: string = c.visual || (c.animated ? 'robot' : '');
  // `layout: 'centered'` drops the side visual entirely and sits the copy on a
  // spotlight-and-grid backdrop instead. See `layout` in sectionSchemas.ts.
  const centered = c.layout === 'centered';
  const showVisual = !centered && !!visual && !hasVideo && !showImage;
  const showSideImage = !centered && showImage;
  const crumbs: any[] = Array.isArray(c.breadcrumb) ? c.breadcrumb : [];
  const trust: string[] = Array.isArray(c.trust_items) ? c.trust_items : [];
  const shell = (
    <section className="relative overflow-hidden bg-white">
      {hasVideo && (
        <>
          <HeroVideo src={c.bg_video} poster={c.bg_video_poster} />
          <div className="pointer-events-none absolute inset-0 bg-white/70" />
        </>
      )}
      {centered && !hasVideo && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hero-dotgrid absolute inset-0" />
          <div className="hero-glow absolute left-1/2 top-[-32%] h-[640px] w-[1000px] -translate-x-1/2" />
        </div>
      )}
      <div
        className={`relative mx-auto max-w-page px-6 ${
          centered
            ? 'pb-[clamp(46px,5vw,66px)] pt-[clamp(44px,5.4vw,74px)]'
            : 'pb-[clamp(22px,2.6vw,34px)] pt-[clamp(24px,3vw,44px)]'
        }`}
      >
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 text-[13px] font-semibold text-body-dim">
            {crumbs.map((b: any, i: number) => (
              <span key={i}>
                {i > 0 && <span className="mx-2 opacity-50">/</span>}
                {b.href ? (
                  <Link href={b.href} className="text-body-dim transition-colors hover:text-black">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-black">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className={showVisual || showSideImage ? 'grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]' : ''}>
          <div className={centered ? 'flex flex-col items-center text-center' : ''}>
            {c.badge && (
              <div
                className="hro inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-black bg-white px-[15px] py-[7px] text-[12.5px] font-bold uppercase tracking-[0.01em] text-black"
                style={{ '--i': 0 } as React.CSSProperties}
              >
                <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_3px_rgba(255,219,45,0.35)]" />
                {c.badge}
              </div>
            )}
            <h1
              style={{ '--i': 1 } as React.CSSProperties}
              className={`hro hero-mark m-0 font-display font-extrabold tracking-[-0.035em] text-black [text-wrap:balance] ${
                centered
                  ? 'mt-7 max-w-[24ch] text-[clamp(30px,4.6vw,54px)] leading-[1.1]'
                  : 'mt-5 max-w-[17ch] text-[clamp(29px,3.7vw,44px)] leading-[1.06]'
              }`}
              dangerouslySetInnerHTML={{ __html: c.heading_html || '' }}
            />
            {c.subhead && (
              <p
                style={{ '--i': 2 } as React.CSSProperties}
                className={`hro m-0 text-[clamp(15px,1.3vw,17px)] leading-relaxed text-body-muted ${
                  centered ? 'mt-[22px] max-w-[60ch]' : 'mt-4 max-w-[54ch]'
                }`}
              >
                {c.subhead}
              </p>
            )}
            <div
              style={{ '--i': 3 } as React.CSSProperties}
              className={`hro mt-7 flex flex-wrap items-center gap-4 ${centered ? 'justify-center' : ''}`}
            >
              {c.primary_cta?.label && <CtaLink {...c.primary_cta} style={c.primary_cta.style || 'primary'} />}
              {c.secondary_cta?.label && <CtaLink {...c.secondary_cta} style={c.secondary_cta.style || 'link'} />}
            </div>
            {trust.length > 0 &&
              (centered ? (
                // Centred: one quiet credential line, dot-separated — pills here
                // wrap onto a second row and pull focus off the headline.
                <div
                  style={{ '--i': 4 } as React.CSSProperties}
                  className="hro mt-8 flex flex-wrap items-center justify-center gap-x-[18px] gap-y-2.5"
                >
                  {trust.map((t: string, i: number) => (
                    <span key={t} className="flex items-center gap-x-[18px]">
                      {i > 0 && <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand" />}
                      <span className="text-[13px] font-bold text-black">{t}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-2">
                  {trust.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-surface-line2 bg-surface-tint2 px-[14px] py-2 text-[13px] font-semibold text-[#222]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ))}
          </div>
          {showVisual && <div className="hidden lg:block">{renderHeroVisual(visual)}</div>}
          {showSideImage && (
            <div className="hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.image_alt || ''}
                className="mx-auto w-full max-w-[460px] rounded-[22px] object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // The centred hero is already on screen at rest, so it animates its exit
  // rather than an arrival — see `mode` on ScrollScene.
  // The centred hero is on screen at rest, so it animates its exit rather than
  // an arrival — see `mode` on ScrollScene. Deliberately not pinned: a pin
  // needs a 100vh sticky element, which would leave dead space around a hero
  // this compact.
  return centered ? (
    <ScrollScene className="hero-scene" mode="exit">
      {shell}
    </ScrollScene>
  ) : (
    shell
  );
}

/* -------------------------------- Stats --------------------------------- */

function StatsBar({ c }: { c: any }) {
  return (
    <>
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-7 px-6 py-[clamp(32px,3.4vw,46px)]">
          {(c.stats || []).map((s: any, i: number) => (
            <div key={i}>
              <div className="font-display text-[clamp(21px,2.2vw,29px)] font-extrabold leading-none tracking-[-0.03em] text-brand">
                <CountUp value={s.num} />
              </div>
              <div className="mt-2 text-[13px] font-medium text-body-onDark">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      {Array.isArray(c.logos) && c.logos.length > 0 && (
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-page px-6 py-[clamp(26px,2.8vw,40px)]">
            {c.logos_title && (
              <p className="m-0 mb-5 text-center text-[12px] font-bold uppercase tracking-[0.1em] text-[#999]">
                {c.logos_title}
              </p>
            )}
            <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
              <div className="flex w-max animate-marquee items-center gap-[52px]">
                {[...c.logos, ...c.logos].map((l: string, i: number) => {
                  const src = platformLogo(l);
                  return src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={l}
                      title={l}
                      className="h-[26px] w-auto shrink-0 object-contain"
                    />
                  ) : (
                    <span
                      key={i}
                      className="whitespace-nowrap font-display text-[22px] font-bold tracking-[-0.02em] text-[#1A1A1A]"
                    >
                      {l}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ---------------------- Feature grid (opportunity) ---------------------- */

/**
 * The three scenes the sticky stage moves between — one per statement, drawn
 * at full size rather than as a thumbnail. Each animates on its own `--t`,
 * which the stage sets from that statement's centredness.
 */
const VIZ_KINDS = ['gap', 'cost', 'fit'] as const;
type VizKind = (typeof VIZ_KINDS)[number];

/** Keyed off the item's `tag` like the icon helpers, with an index fallback. */
function vizKind(tag: string | undefined, index: number): VizKind {
  const t = String(tag || '').toLowerCase();
  if (t.includes('demand')) return 'gap';
  if (t.includes('cost') || t.includes('spend')) return 'cost';
  if (t.includes('fit') || t.includes('context')) return 'fit';
  return VIZ_KINDS[index] ?? 'gap';
}

function ProblemScene({ kind }: { kind: VizKind }) {
  const frame = { viewBox: '0 0 340 300', fill: 'none', className: 'h-full w-full' } as const;
  const grid = [0, 1, 2, 3].map((i) => (
    <line key={i} x1="24" y1={64 + i * 52} x2="316" y2={64 + i * 52} stroke="#1E1E1E" strokeWidth="1" />
  ));

  if (kind === 'gap') {
    return (
      <svg {...frame} aria-hidden>
        {grid}
        {/* the widening gap is the whole point, so it is drawn, not implied */}
        <path
          d="M28 250 C110 244 176 152 312 44 L312 214 C190 226 110 244 28 250 Z"
          fill="url(#gapFill)"
          className="pv-fill"
        />
        <defs>
          <linearGradient id="gapFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDB2D" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#FFDB2D" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d="M28 250 C120 244 200 226 312 214" stroke="#3C3C3C" strokeWidth="2.5" strokeLinecap="round" className="pv-line" />
        <path d="M28 250 C110 244 176 152 312 44" stroke="#FFDB2D" strokeWidth="3" strokeLinecap="round" className="pv-line" />
        <circle cx="312" cy="44" r="7" fill="#FFDB2D" className="pv-head" />
        <circle cx="312" cy="44" r="14" fill="#FFDB2D" opacity="0.16" className="pv-head" />
        <circle cx="312" cy="214" r="5" fill="#3C3C3C" className="pv-head" />
        <g className="pv-label">
          <text x="28" y="36" fill="#FFDB2D" fontSize="13" fontWeight="700" letterSpacing="1.4">DEMAND</text>
          <text x="28" y="284" fill="#6A6A6A" fontSize="13" fontWeight="700" letterSpacing="1.4">CAPABILITY</text>
        </g>
      </svg>
    );
  }

  if (kind === 'cost') {
    // the five costs the copy actually names
    const bars: [string, number][] = [
      ['HIRE', 96], ['R&D', 132], ['BUILD', 168], ['SECURE', 204], ['MAINTAIN', 236],
    ];
    return (
      <svg {...frame} aria-hidden>
        {grid}
        {bars.map(([label, h], i) => (
          <g key={label}>
            <rect
              x={30 + i * 58}
              y={258 - h}
              width="34"
              height={h}
              rx="7"
              fill={i === bars.length - 1 ? '#FFDB2D' : '#2B2B2B'}
              className="pv-bar"
              style={{ '--b': i } as React.CSSProperties}
            />
            <text
              x={47 + i * 58}
              y="278"
              fill={i === bars.length - 1 ? '#B9911F' : '#5C5C5C'}
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.6"
              textAnchor="middle"
              className="pv-label"
            >
              {label}
            </text>
          </g>
        ))}
        <line x1="24" y1="259" x2="316" y2="259" stroke="#3C3C3C" strokeWidth="1.5" strokeLinecap="round" />
        <text x="28" y="36" fill="#FFDB2D" fontSize="13" fontWeight="700" letterSpacing="1.4" className="pv-label">
          EVERY YEAR, AGAIN
        </text>
      </svg>
    );
  }

  // a set that matches, and a piece that does not belong to it
  return (
    <svg {...frame} aria-hidden>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${r}-${col}`}
            x={40 + col * 56}
            y={92 + r * 56}
            width="40"
            height="40"
            rx="10"
            fill="#232323"
          />
        )),
      )}
      {/* the slot it is meant to fill, and the piece that will not */}
      <rect x={152} y={148} width="40" height="40" rx="10" fill="none" stroke="#3C3C3C" strokeWidth="2" strokeDasharray="5 5" className="pv-slot" />
      <rect x={152} y={148} width="40" height="40" rx="10" fill="#FFDB2D" className="pv-odd" />
      <text x="40" y="52" fill="#6A6A6A" fontSize="13" fontWeight="700" letterSpacing="1.4" className="pv-label">
        YOUR DOMAIN
      </text>
      <text x="40" y="284" fill="#FFDB2D" fontSize="13" fontWeight="700" letterSpacing="1.4" className="pv-label">
        THEIR TEMPLATE
      </text>
    </svg>
  );
}

function FeatureGridCallout({ c }: { c: any }) {
  if (!c.callout) return null;
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand p-[clamp(24px,3vw,38px)]">
      <p className="m-0 max-w-[40ch] font-display text-[clamp(18px,1.9vw,23px)] font-bold leading-tight tracking-[-0.02em] text-black">
        {c.callout.text}
      </p>
      {c.callout.cta?.label && <CtaLink {...c.callout.cta} style="primary" />}
    </div>
  );
}

/**
 * The problem statement. `layout: 'split'` holds the heading in place while the
 * statements pass it, so the section reads as one argument instead of three
 * cards — see `layout` in sectionSchemas.ts. Everything else keeps the grid.
 */
function FeatureGridSplit({ c }: { c: any }) {
  const items: any[] = c.items || [];
  const n = Math.max(1, items.length);

  // No `overflow-hidden` on this section: it would make an ancestor of the
  // sticky view a scroll container, and `position: sticky` silently stops
  // working. The orb is clipped by its own wrapper instead.
  return (
    <section className="relative bg-ink-900 text-white [background:radial-gradient(1200px_500px_at_78%_-10%,rgba(255,219,45,0.10),transparent_60%),#0A0A0A]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="fg-orb left-[-16%] top-[4%] h-[620px] w-[620px] [background:radial-gradient(circle,rgba(255,219,45,0.15),transparent_66%)]"
          style={{ '--par': -1 } as React.CSSProperties}
        />
      </div>
      <ScrollScene className="fg-pin" mode="pin" style={{ '--n': n } as React.CSSProperties}>
        <div className="fg-view">
          <div className="relative mx-auto w-full max-w-page px-6 py-[clamp(24px,3vw,40px)]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                {c.eyebrow && (
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/40 px-5 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-brand">
                    <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_1px_rgba(255,219,45,0.7)]" />
                    {c.eyebrow}
                  </div>
                )}
                {c.heading && (
                  <h2 className="m-0 mt-5 max-w-[26ch] font-display text-[clamp(20px,2vw,27px)] font-bold leading-[1.2] tracking-[-0.02em] text-[#8E8E8E]">
                    {c.heading}
                  </h2>
                )}
              </div>
              {/* one segment per problem, filling as its leg of the run plays */}
              <div aria-hidden className="hidden items-center gap-2 md:flex">
                {items.map((_, i) => (
                  <span
                    key={i}
                    className="fg-seg h-[3px] w-[54px] rounded-full bg-[#2A2A2A]"
                    style={{ '--i': i, '--n': n } as React.CSSProperties}
                  >
                    <span />
                  </span>
                ))}
              </div>
            </div>

            <div className="fg-deck mt-[clamp(28px,4vw,54px)]">
              {items.map((it, i) => (
                <article
                  key={i}
                  className="fg-slide grid grid-cols-1 items-center gap-[clamp(24px,4vw,64px)] lg:grid-cols-[1.06fr_0.94fr]"
                  style={
                    {
                      '--i': i,
                      '--n': n,
                      // the first slide has nothing to cross in from, the last
                      // nothing to cross out to
                      '--fi': i === 0 ? 0 : 1,
                      '--fo': i === n - 1 ? 0 : 1,
                    } as React.CSSProperties
                  }
                >
                  <div>
                    {it.tag && (
                      <span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-brand">{it.tag}</span>
                    )}
                    <h3 className="m-0 mb-5 mt-4 max-w-[17ch] font-display text-[clamp(28px,4.2vw,58px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-white">
                      {it.title}
                    </h3>
                    {it.body && (
                      <p className="m-0 max-w-[48ch] text-[clamp(15px,1.5vw,18px)] leading-relaxed text-[#9A9A9A]">
                        {it.body}
                      </p>
                    )}
                  </div>
                  <div className="aspect-[17/14] w-full max-w-[460px] justify-self-end rounded-[22px] border border-[#232323] p-[clamp(14px,2vw,26px)] [background:radial-gradient(120%_120%_at_20%_0%,#161616,#0C0C0C)]">
                    <ProblemScene kind={vizKind(it.tag, i)} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </ScrollScene>
      <div className={`relative mx-auto max-w-page px-6 ${PAD_SM}`}>
        <FeatureGridCallout c={c} />
      </div>
    </section>
  );
}

function FeatureGridCards({ c }: { c: any }) {
  const items: any[] = c.items || [];
  // Items with nothing but a title are a list of labels, not a set of cards —
  // a card gives each one a large padded box holding a single line.
  const labelsOnly = items.length > 0 && items.every((it) => !it.body);
  const cols = Number(c.columns) === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  const numbered = !labelsOnly && items.some((it: any) => it.n);

  return (
    <section className="bg-ink-900 text-white [background:radial-gradient(1200px_500px_at_78%_-10%,rgba(255,219,45,0.14),transparent_60%),#0A0A0A]">
      <div className={`mx-auto max-w-page px-6 ${PAD}`}>
        {c.eyebrow && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/40 px-5 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-brand">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_1px_rgba(255,219,45,0.7)]" />
            {c.eyebrow}
          </div>
        )}
        {c.heading && (
          <h2 className={`${H2} mt-5 max-w-[24ch] text-white [text-wrap:balance] lg:max-w-[38ch]`}>{c.heading}</h2>
        )}
        {c.subhead && (
          <p className="m-0 mt-4 max-w-[60ch] text-[16px] leading-relaxed text-body-onDark">{c.subhead}</p>
        )}

        <ScrollScene>
          {labelsOnly ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {items.map((it, i) => (
                <span
                  key={i}
                  className="sx fgc-chip inline-flex items-center gap-3 rounded-[13px] border border-[#232323] px-[18px] py-[13px] text-[14.5px] font-semibold leading-none text-[#E4E4E4] [background:linear-gradient(180deg,#141414,#0E0E0E)]"
                >
                  <span aria-hidden className="fgc-dot h-[6px] w-[6px] flex-none rounded-full bg-brand" />
                  {it.title}
                </span>
              ))}
            </div>
          ) : (
            <div className={`mt-9 grid grid-cols-1 gap-[18px] sm:grid-cols-2 ${cols}`}>
              {items.map((it: any, i: number) => (
                <div
                  key={i}
                  className="sx opp-card relative overflow-hidden rounded-[20px] border border-[#232323] p-7 [background:linear-gradient(180deg,#121212,#0D0D0D)]"
                >
                  {numbered && (
                    <span className="opp-num pointer-events-none absolute right-[22px] top-[14px] font-display text-[110px] font-extrabold leading-none tracking-[-0.04em] text-white/[0.035]">
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
          )}
        </ScrollScene>
        <FeatureGridCallout c={c} />
      </div>
    </section>
  );
}

function FeatureGrid({ c }: { c: any }) {
  return c.layout === 'split' ? <FeatureGridSplit c={c} /> : <FeatureGridCards c={c} />;
}

function Partnership({ c }: { c: any }) {
  const left: string[] = c.left_items || [];
  const right: string[] = c.right_items || [];

  const column = (title: string, items: string[], side: -1 | 1) => (
    <div>
      <p
        className={`m-0 text-[11px] font-bold uppercase tracking-[0.16em] ${
          side === -1 ? 'text-body-dim' : 'text-black'
        }`}
      >
        {title}
      </p>
      <ul className="relative m-0 mt-6 flex list-none flex-col p-0 pl-8">
        <span aria-hidden className="pm-rail" />
        <span aria-hidden className="pm-rail-fill" />
        {items.map((label, i) => (
          <li
            key={label}
            className="sx pm-item relative border-t border-surface-line2 py-[17px] text-[clamp(15px,1.45vw,17.5px)] font-semibold leading-snug tracking-[-0.015em] text-[#161616] first:border-t-0 first:pt-0"
            style={{ '--i': i, '--side': side } as React.CSSProperties}
          >
            <span
              aria-hidden
              className={`pm-dot absolute -left-8 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-[3px] ${
                side === -1 ? 'bg-black' : 'bg-brand'
              }`}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(ellipse,rgba(255,219,45,0.12),transparent_70%)]"
      />
      <div className={`relative mx-auto max-w-page px-6 ${PAD}`}>
        <ScrollScene>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          {c.heading && (
            <h2 className={`${H2} mt-4 max-w-[24ch] text-black`}>
              <SplitHeading text={c.heading} />
            </h2>
          )}
          <div className="mx-auto mt-12 grid max-w-[940px] grid-cols-1 gap-x-[clamp(32px,7vw,110px)] gap-y-12 md:grid-cols-2">
            {column(c.left_title, left, -1)}
            {column(c.right_title, right, 1)}
          </div>
        </ScrollScene>
      </div>
    </section>
  );
}

/* ------------------------- Services (what we build) --------------------- */

function ServiceCapabilities({ c }: { c: any }) {
  return (
    <Section theme="light">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          {c.heading && <h2 className={`${H2} mt-4 max-w-[22ch] text-black [text-wrap:balance]`}>{c.heading}</h2>}
        </div>
        {c.link?.href && (
          <Link href={c.link.href} className="border-b-2 border-brand pb-0.5 text-[15px] font-bold text-black">
            {c.link.label}
          </Link>
        )}
      </div>
      <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(c.items || []).map((s: any, i: number) => (
          <div
            key={i}
            className="svc-card relative rounded-[18px] border border-surface-line2 bg-surface-tint px-[22px] py-6"
          >
            <div className="flex items-start justify-between">
              <div className="svc-ico flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-black text-brand">
                <Icon name={serviceIconName(s.title, s.icon)} size={22} />
              </div>
              <span className="svc-arrow inline-flex text-black opacity-0 [transform:translateX(-6px)]">
                <Icon name="arrow-up-right" size={18} />
              </span>
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
  const items: string[] = c.items || [];
  const half = Math.ceil(items.length / 2);
  // Each row carries its set twice and is parked at -25%, so travelling either
  // way never brings a row end into frame.
  const rows: [string[], number][] = [
    [items.slice(0, half), -1],
    [items.slice(half), 1],
  ];

  const tile = (label: string, key: string) => (
    <div
      key={key}
      className="sx cg-node flex w-[228px] flex-none items-center gap-3.5 rounded-[16px] border border-[#232323] px-4 py-[15px] [background:linear-gradient(180deg,#141414,#0E0E0E)]"
    >
      <span className="cg-ico flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#1C1C1C] text-brand">
        <Icon name={connectIconName(label)} size={19} />
      </span>
      <span className="text-[14px] font-semibold leading-tight text-[#E4E4E4]">{label}</span>
    </div>
  );

  return (
    <Section theme="dark">
      <ScrollScene>
        <Eyebrow onDark>{c.eyebrow}</Eyebrow>
        {c.heading && (
          <h2 className={`${H2} mt-[18px] text-white`}>
            <SplitHeading text={c.heading} />
          </h2>
        )}
        {c.subhead && (
          <p className="m-0 mt-[18px] max-w-[60ch] text-[16px] leading-relaxed text-body-onDark">{c.subhead}</p>
        )}

        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(ellipse,rgba(255,219,45,0.10),transparent_70%)]"
          />
          <div className="hx-mask relative flex flex-col gap-3.5 overflow-hidden">
            {rows.map(([group, dirx]) => (
              <div key={dirx} className="hx-row" style={{ '--dirx': dirx } as React.CSSProperties}>
                {group.map((l, i) => tile(l, `a-${i}`))}
                {group.map((l, i) => tile(l, `b-${i}`))}
              </div>
            ))}
          </div>
        </div>
      </ScrollScene>
    </Section>
  );
}

/* --------------------------- Implementations ---------------------------- */

async function Implementations({ c }: { c: any }) {
  // Real published case studies, newest first — the same source /implementations
  // lists from, so this can never drift from what the site actually has.
  const [posts, settings] = await Promise.all([getPosts('implementation'), getSettings()]);
  const base = `/${settings.url_config?.implementations_base || 'implementations'}`;
  const slides = posts.slice(0, 10);

  return (
    <Section theme="light">
      <div className="rounded-[26px] border border-surface-line2 bg-surface-tint p-[clamp(26px,3.6vw,46px)]">
        <div className="grid grid-cols-1 items-end gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            {c.heading && <h2 className={`${H2} mt-4 text-black [text-wrap:balance]`}>{c.heading}</h2>}
            {c.subhead && (
              <p className="m-0 mt-5 max-w-[54ch] text-[16px] leading-relaxed text-body-faint">{c.subhead}</p>
            )}
          </div>
          {c.cta?.label && (
            <div className="lg:text-right">
              <Link
                href={c.cta.href || '#'}
                className="inline-block rounded-full bg-black px-6 py-[13px] text-[15px] font-bold text-brand"
              >
                {c.cta.label} →
              </Link>
            </div>
          )}
        </div>

        {slides.length > 0 && (
          <div className="mt-9">
            <CaseStudySlider posts={slides} base={base} />
          </div>
        )}
      </div>
    </Section>
  );
}

/* --------------------------- Engagement models -------------------------- */

function EngagementModels({ c }: { c: any }) {
  const items: any[] = c.items || [];
  return (
    <Section theme="tint2">
      <Eyebrow>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-4 text-black`}>{c.heading}</h2>}
      <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((e: any, i: number) => (
          <div
            key={i}
            className={`eng-card relative rounded-[18px] border p-6 ${
              e.featured ? 'border-black bg-black' : 'border-[#E7E7E3] bg-white'
            }`}
          >
            {e.featured && (
              <span className="absolute -top-[11px] left-[30px] rounded-full bg-brand px-3 py-[5px] text-[11px] font-bold uppercase tracking-[0.04em] text-black">
                Deepest partnership
              </span>
            )}
            {/* describes the engagement rather than ranking it */}
            <span
              className={`eng-ico flex h-11 w-11 items-center justify-center rounded-[13px] ${
                e.featured ? 'bg-brand text-black' : 'bg-surface-tint2 text-black'
              }`}
            >
              <Icon name={engagementIconName(e.title, e.icon)} size={21} />
            </span>
            <h3
              className={`m-0 mb-2.5 mt-[18px] font-display text-[20px] font-bold tracking-[-0.015em] ${
                e.featured ? 'text-white' : 'text-black'
              }`}
            >
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
  const total = String(steps.length).padStart(2, '0');

  // No `overflow-hidden` on the section — it would stop the heading column
  // sticking. The orbs are clipped by their own wrapper.
  return (
    <section className="relative bg-black text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="pt-orb left-[-12%] top-[8%] h-[540px] w-[540px] [background:radial-gradient(circle,rgba(255,219,45,0.13),transparent_66%)]"
          style={{ '--par': -1 } as React.CSSProperties}
        />
        <span
          className="pt-orb bottom-[-10%] right-[-8%] h-[460px] w-[460px] [background:radial-gradient(circle,rgba(255,219,45,0.09),transparent_66%)]"
          style={{ '--par': 1 } as React.CSSProperties}
        />
      </div>

      <ScrollScene>
        <div className={`relative mx-auto max-w-page px-6 ${PAD}`}>
          <div className="grid grid-cols-1 items-start gap-[clamp(30px,5vw,80px)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="pt-head lg:sticky lg:top-[104px]">
              <Eyebrow onDark>{c.eyebrow}</Eyebrow>
              {c.heading && (
                <h2 className="m-0 mt-[18px] max-w-[17ch] font-display text-[clamp(25px,3vw,40px)] font-extrabold leading-[1.07] tracking-[-0.035em] text-white">
                  <SplitHeading text={c.heading} />
                </h2>
              )}
              {c.subhead && (
                <p className="m-0 mt-5 max-w-[46ch] text-[16px] leading-relaxed text-body-onDark">{c.subhead}</p>
              )}
              {/* how far through the sequence the reader has come */}
              <div className="mt-9 flex items-center gap-4">
                <span className="pt-prog h-[3px] w-[120px] overflow-hidden rounded-full bg-[#242424]">
                  <span />
                </span>
                <span className="font-display text-[12px] font-extrabold uppercase tracking-[0.16em] text-body-dim">
                  {total} steps
                </span>
              </div>
            </div>

            <div className="relative pl-[52px] sm:pl-[64px]">
              {/* the rail runs node-centre to node-centre, not edge to edge */}
              <span aria-hidden className="pt-rail bottom-[38px] left-[18px] top-[38px] sm:left-[24px]">
                <span className="pt-fill" />
              </span>
              <div className="pt-track flex flex-col gap-[clamp(16px,2vw,26px)]">
                {steps.map((p, i) => (
                  <div key={i} className="sx pt-step relative">
                    <span
                      aria-hidden
                      className="pt-node absolute left-[-52px] top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-brand font-display text-[15px] font-extrabold text-black sm:left-[-58px]"
                    >
                      {p.n || i + 1}
                    </span>
                    <div className="pt-card flex items-center gap-[18px] rounded-[16px] border border-[#232323] bg-ink-700 px-5 py-4">
                      <span className="pt-ico flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#1C1C1C] text-brand">
                        <Icon name={stepIconName(i)} size={22} />
                      </span>
                      <div>
                        <div className="font-display text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
                          Step {p.n || i + 1}
                        </div>
                        <div className="mt-1 font-display text-[clamp(16px,1.6vw,19px)] font-bold leading-snug text-white">
                          {p.title}
                        </div>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollScene>
    </section>
  );
}

/* ------------------------------- Pillars -------------------------------- */

function Pillars({ c }: { c: any }) {
  return (
    <Section theme="light">
      <Eyebrow>{c.eyebrow}</Eyebrow>
      {c.heading && <h2 className={`${H2} mt-4 max-w-[24ch] text-black [text-wrap:balance]`}>{c.heading}</h2>}
      <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(c.items || []).map((p: any, i: number) => (
          <div key={i} className="rounded-[18px] border border-surface-line2 bg-surface-tint p-6">
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
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand p-7 md:p-9">
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
    // Full yellow closing band. Two dark blooms drift at different rates to give
    // the flat ground depth, and the copy arrives on the same scroll scrub as
    // the sections above it.
    return (
      <section className="cta-final relative overflow-hidden bg-brand">
        <ScrollScene>
          <span
            aria-hidden
            className="cta-bloom left-[-12%] top-[-40%] h-[520px] w-[520px] [background:radial-gradient(circle,rgba(0,0,0,0.15),transparent_66%)]"
            style={{ '--par': -1 } as React.CSSProperties}
          />
          <span
            aria-hidden
            className="cta-bloom bottom-[-46%] right-[-8%] h-[460px] w-[460px] [background:radial-gradient(circle,rgba(0,0,0,0.12),transparent_66%)]"
            style={{ '--par': 1 } as React.CSSProperties}
          />
          <div className={`relative mx-auto max-w-page px-6 text-center ${PAD}`}>
            <h2
              className="sx cta-line m-0 mx-auto max-w-[22ch] font-display text-[clamp(26px,3.5vw,44px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-black [text-wrap:balance]"
              style={{ '--i': 0 } as React.CSSProperties}
            >
              <SplitHeading text={c.heading} />
            </h2>
            {c.body && (
              <p
                className="sx cta-line m-0 mx-auto mt-4 max-w-[56ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-[#1A1A1A]"
                style={{ '--i': 1 } as React.CSSProperties}
              >
                {c.body}
              </p>
            )}
            <div
              className="sx cta-line mt-7 flex flex-wrap items-center justify-center gap-3"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              {(c.ctas || []).map((cta: any, i: number) => (
                <CtaLink key={i} label={cta.label} href={cta.href} style={cta.style || (i === 0 ? 'primary' : 'outline')} />
              ))}
            </div>
          </div>
        </ScrollScene>
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
        <h2 className={`${H2} mt-4 text-black [text-wrap:balance]`}>{c.heading}</h2>
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
      <div className="mx-auto max-w-page px-6 py-10 text-center md:py-12">
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
    <Section theme="light" narrow compact>
      <div className="mx-auto max-w-[760px]">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && <h2 className={`${H2} mb-6 mt-4 text-black`}>{c.heading}</h2>}
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
          {c.heading && <h2 className={`${H2} mt-4 text-black`}>{c.heading}</h2>}
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

/* -------------------- Service categories (services hub) ----------------- */

// The three capability cards on /services, each linking to its own sub-page.
function ServiceCategories({ c }: { c: any }) {
  const items: any[] = c.items || [];
  return (
    <section className="bg-ink-900 text-white [background:radial-gradient(1100px_520px_at_12%_-20%,rgba(255,219,45,0.16),transparent_55%),radial-gradient(900px_420px_at_100%_110%,rgba(255,219,45,0.08),transparent_50%),#0A0A0A]">
      <div className={`mx-auto max-w-page px-6 ${PAD}`}>
        {c.eyebrow && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/40 px-5 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-brand">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_1px_rgba(255,219,45,0.7)]" />
            {c.eyebrow}
          </div>
        )}
        {c.heading && <h2 className={`${H2} mt-5 max-w-[18ch] text-white`}>{c.heading}</h2>}
        {c.subhead && (
          <p className="m-0 mt-4 max-w-[54ch] text-[16px] leading-relaxed text-body-onDark">{c.subhead}</p>
        )}
        <div className="mt-10 grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {items.map((it: any, i: number) => (
            <Link
              key={it.href || i}
              href={it.href || '#'}
              className="cat-card relative flex flex-col overflow-hidden rounded-[22px] border border-[#262626] p-7 text-inherit [background:linear-gradient(180deg,#141414,#0E0E0E)]"
            >
              <span className="cat-num pointer-events-none absolute right-[18px] top-2 font-display text-[86px] font-extrabold leading-none tracking-[-0.05em] text-white/[0.035]">
                {it.n || String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative z-[1] mb-6 flex items-center justify-between">
                <div className="cat-ico flex h-[52px] w-[52px] items-center justify-center rounded-[15px] border border-[#2A2A2A] bg-[#1C1C1C] text-brand">
                  <Icon name={serviceIconName(it.title, it.icon)} size={22} />
                </div>
                {it.tag && (
                  <span className="text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-brand">{it.tag}</span>
                )}
              </div>
              <h3 className="relative z-[1] m-0 mb-3 font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-white">
                {it.title}
              </h3>
              {it.kicker && (
                <p className="relative z-[1] m-0 mb-3.5 text-[12px] font-bold uppercase tracking-[0.04em] text-[#B98D1E]">
                  {it.kicker}
                </p>
              )}
              {it.body && (
                <p className="relative z-[1] m-0 mb-5 flex-1 text-[14.5px] leading-relaxed text-[#9A9A9A]">{it.body}</p>
              )}
              {Array.isArray(it.chips) && it.chips.length > 0 && (
                <div className="relative z-[1] mb-6 flex flex-wrap gap-[7px]">
                  {it.chips.map((chip: string) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[#2E2E2E] bg-[#161616] px-[11px] py-1.5 text-[11.5px] font-semibold text-[#B8B8B8]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
              {it.cta_label && (
                <span className="relative z-[1] inline-flex items-center gap-2.5 self-start rounded-full bg-brand px-5 py-3 text-[14px] font-bold text-black">
                  {it.cta_label}
                  <span className="cat-arrow inline-flex">
                    <Icon name="arrow-right" size={16} />
                  </span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Services detail -------------------------- */

function ServicesDetail({ c }: { c: any }) {
  const items: any[] = c.items || [];
  const primary = c.cta_primary || { label: 'Connect with an AI expert', href: '/book-a-call' };
  const secondary = c.cta_secondary || { label: 'Submit a project brief', href: '/book-a-call' };
  const num = (i: number) => String(i + 1).padStart(2, '0');
  return (
    <>
      {items.length > 1 && (
        <div className="sticky top-[73px] z-40 border-b border-line bg-white/92 backdrop-blur-md">
          <div className="mx-auto max-w-page px-6 py-3.5">
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="jump-pill rounded-full border border-surface-line2 bg-surface-tint px-3.5 py-2 text-[12.5px] font-semibold text-body-dim"
                >
                  {s.short || s.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      <Section theme="light">
        <div className="flex flex-col gap-[22px]">
          {items.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="svc-detail scroll-mt-[160px] rounded-[22px] border border-surface-line2 bg-white p-[clamp(24px,3.2vw,40px)]"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex h-[34px] min-w-[48px] items-center justify-center rounded-[9px] bg-black px-3 font-display text-[12.5px] font-extrabold tracking-[0.04em] text-brand">
                  {s.mono}
                </span>
                {s.cat && (
                  <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-body-dim">{s.cat}</span>
                )}
              </div>
              <h2 className="m-0 mb-3 font-display text-[clamp(22px,2.4vw,29px)] font-extrabold leading-[1.12] tracking-[-0.03em] text-black">
                {s.title}
              </h2>
              {s.tagline && (
                <p className="m-0 max-w-[70ch] text-[16px] leading-relaxed text-body-muted">{s.tagline}</p>
              )}

              <div className="mt-7 grid grid-cols-1 items-start gap-7 md:grid-cols-[1.1fr_1fr]">
                {Array.isArray(s.stack) && s.stack.length > 0 && (
                  <div>
                    <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.08em] text-body-dim">
                      Typical stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.stack.map((t: string) => (
                        <span
                          key={t}
                          className="svc-stack inline-flex items-center rounded-full border border-surface-line2 bg-surface-tint px-3 py-[7px] text-[12.5px] font-semibold text-body-soft"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {s.outcome && (
                  <div className="border-l-[3px] border-brand py-0.5 pl-4">
                    <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.08em] text-body-dim">
                      Business outcome
                    </div>
                    <p className="m-0 text-[15px] font-medium leading-relaxed text-[#222]">{s.outcome}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-[clamp(24px,4vw,48px)] border-t border-surface-line2 pt-7 md:grid-cols-2">
                {Array.isArray(s.build) && s.build.length > 0 && (
                  <div>
                    <div className="mb-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-black">
                      What we build
                    </div>
                    <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
                      {s.build.map((b: string, i: number) => (
                        <li key={i} className="grid grid-cols-[2.2ch_1fr] items-start gap-3.5">
                          <span className="pt-px text-[13px] font-extrabold tracking-[0.04em] text-[#B5B5B0]">{num(i)}</span>
                          <span className="text-[15px] font-medium leading-snug text-[#2E2E2E]">{b}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {Array.isArray(s.detail) && s.detail.length > 0 && (
                  <div>
                    <div className="mb-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-black">
                      Engineering detail
                    </div>
                    <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
                      {s.detail.map((d: string, i: number) => (
                        <li key={i} className="grid grid-cols-[2.2ch_1fr] items-start gap-3.5">
                          <span className="pt-px text-[13px] font-extrabold tracking-[0.04em] text-[#B5B5B0]">{num(i)}</span>
                          <span className="text-[15px] font-medium leading-snug text-[#2E2E2E]">{d}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {s.cross_link?.label && (
                <Link
                  href={s.cross_link.href || '#'}
                  className="cross-link mt-5 inline-flex items-center gap-1.5 border-b-[1.5px] border-brand pb-px text-[13.5px] font-bold text-black"
                >
                  {s.cross_link.label}
                </Link>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-surface-line2 pt-6">
                <Link
                  href={primary.href}
                  className="svc-cta-primary inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-brand px-[22px] py-3 text-[14.5px] font-bold leading-none text-black"
                >
                  {primary.label}
                </Link>
                <Link
                  href={secondary.href}
                  className="svc-cta-secondary inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-white px-[22px] py-3 text-[14.5px] font-bold leading-none text-black"
                >
                  {secondary.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}

/* --------------------------- Comparison table --------------------------- */

function ComparisonTable({ c }: { c: any }) {
  return (
    <Section theme="tint2">
      <div className="mx-auto max-w-[640px] text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        {c.heading && <h2 className={`${H2} mt-4 text-black`}>{c.heading}</h2>}
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
        {c.heading && <h2 className={`${H2} mt-4 text-black`}>{c.heading}</h2>}
      </div>
      <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
  const settings = await getSettings();
  return (
    <Section theme="light">
      <DynamicForm form={form} siteKey={settings.recaptcha_site_key || undefined} />
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
    case 'service_categories':
      return <ServiceCategories c={c} />;
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
