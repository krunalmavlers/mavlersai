/**
 * Hero animation concepts for /services/ai-development, ported from the Claude
 * Design doc "AI Hero Animation Concepts" (project 66694834) — three 9s-loop
 * directions for the space beside the hero copy:
 *
 *   HeroSignalLattice  (2a) — scattered signals cluster, collapse into a
 *                             spinning core, capability chips eject, lattice draws
 *   HeroAssemblyFloor  (2b) — isometric floor: fragments arrive on intake lanes,
 *                             the engine slab absorbs them, product panels rise
 *   HeroEmergence      (2c) — cinematic push: streams pulled into a monolith,
 *                             light sweep, cards settle, horizon spreads
 *
 * Two deliberate deviations from the doc:
 *
 * 1. Palette. The doc is blue/purple/teal on white; the site is Mavlers yellow
 *    on white/black. Motion and composition are unchanged — only the accents are
 *    re-mapped: #1D6FE8 → brand yellow (fills) or orange (thin strokes, where
 *    yellow is too light on white), #7C3AED/#8B5CF6 → orange, #0D9488 → ink,
 *    #0EA5E9 → yellow. Ink/greys follow the site tokens. Type is Montserrat
 *    rather than IBM Plex Mono, matching the site's other micro-labels.
 * 2. Scale. The doc authors the stage at ~620px wide inside a 1180px hero; our
 *    hero column is ~480–560px, so each scene is authored at the doc's exact
 *    pixel geometry and scaled to the column by .hero-stage (container query
 *    units, see globals.css). Label type is set larger than the doc's so it
 *    still reads after that downscale.
 */

const A1 = '#FFDB2D'; // brand yellow — primary accent
const A2 = '#FFA300'; // brand orange — secondary accent
const A3 = '#111111'; // ink — third accent and structure

const CARD = '#FFFFFF';
const CARD_LINE = '#ECECE8';
const CARD_SHADOW = '0 10px 26px rgba(17,17,17,.09)';
const LABEL = '#25252B';

/** The five things this page sells, in the doc's order. */
const OUTPUTS = [
  { label: 'AI Agent', dot: A1 },
  { label: 'Automation', dot: A2 },
  { label: 'Dashboards', dot: A3 },
  { label: 'AI App', dot: A1 },
  { label: 'Integration', dot: A2 },
];

type Vars = Record<string, string | number>;
const v = (o: Vars) => o as React.CSSProperties;

/**
 * Fixed-size authoring box, scaled to fill the hero column.
 * `sw`/`sh` are the doc's own stage dimensions for that concept.
 */
function Stage({ sw, sh, children }: { sw: number; sh: number; children: React.ReactNode }) {
  return (
    <div className="hero-stage" style={v({ '--sw': sw, '--sh': sh, '--loop': '9s' })}>
      <div className="hero-stage-inner">{children}</div>
    </div>
  );
}

/** White capability card — the payload of all three concepts' final beat. */
function OutCard({ label, dot, size = 13 }: { label: string; dot: string; size?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '10px 13px',
        borderRadius: 11,
        background: CARD,
        border: `1px solid ${CARD_LINE}`,
        boxShadow: CARD_SHADOW,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: 2, background: dot, flexShrink: 0 }} />
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: LABEL,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 2a — Signal Lattice                                                        */
/* ========================================================================== */

/** Incoming signals: scattered start (sx,sy) → clustered hold (dx,dy). */
const A_SIGNALS: { s: [number, number]; d: [number, number]; el: React.CSSProperties }[] = [
  { s: [-250, -208], d: [-140, -125], el: { width: 7, height: 7, margin: '-3px 0 0 -3px', borderRadius: '50%', background: A1, boxShadow: `0 0 0 4px rgba(255,219,45,.22)` } },
  { s: [-196, -58], d: [-104, -96], el: { width: 44, height: 28, margin: '-14px 0 0 -22px', borderRadius: 5, background: CARD, border: `1px solid ${CARD_LINE}`, boxShadow: '0 4px 12px rgba(17,17,17,.06)' } },
  { s: [-262, 88], d: [-136, -84], el: { width: 6, height: 6, margin: '-3px 0 0 -3px', borderRadius: '50%', background: '#B4B4AE' } },
  { s: [-92, -232], d: [-116, -142], el: { width: 34, height: 22, margin: '-11px 0 0 -17px', borderRadius: '11px 11px 11px 3px', border: `1px solid rgba(255,163,0,.5)`, background: 'rgba(255,163,0,.08)' } },
  { s: [232, -202], d: [140, -110], el: { width: 40, height: 26, margin: '-13px 0 0 -20px', borderRadius: 5, background: CARD, border: `1px solid ${CARD_LINE}`, boxShadow: '0 4px 12px rgba(17,17,17,.06)' } },
  { s: [268, -40], d: [116, -70], el: { width: 7, height: 7, margin: '-3px 0 0 -3px', borderRadius: '50%', background: A3, boxShadow: '0 0 0 4px rgba(17,17,17,.08)' } },
  { s: [180, -248], d: [150, -74], el: { width: 26, height: 26, margin: '-13px 0 0 -13px', borderRadius: 5, border: `1px solid ${CARD_LINE}`, background: CARD } },
  { s: [256, 118], d: [112, -104], el: { width: 6, height: 6, margin: '-3px 0 0 -3px', borderRadius: '50%', background: '#B4B4AE' } },
  { s: [-204, 226], d: [-32, 158], el: { width: 44, height: 24, margin: '-12px 0 0 -22px', borderRadius: 5, background: CARD, border: `1px solid ${CARD_LINE}`, boxShadow: '0 4px 12px rgba(17,17,17,.06)' } },
  { s: [44, 250], d: [10, 140], el: { width: 7, height: 7, margin: '-3px 0 0 -3px', borderRadius: '50%', background: A2, boxShadow: '0 0 0 4px rgba(255,163,0,.16)' } },
  { s: [222, 228], d: [36, 166], el: { width: 30, height: 20, margin: '-10px 0 0 -15px', borderRadius: '10px 10px 10px 3px', border: `1px solid rgba(255,219,45,.75)`, background: 'rgba(255,219,45,.12)' } },
  { s: [-44, -252], d: [-14, 182], el: { width: 6, height: 6, margin: '-3px 0 0 -3px', borderRadius: '50%', background: '#B4B4AE' } },
];

/** Dashed cluster frames the signals gather into. */
const A_CLUSTERS = [
  { w: 150, h: 120, m: '-142px 0 0 -196px', border: 'rgba(255,163,0,.5)' },
  { w: 130, h: 106, m: '-140px 0 0 66px', border: 'rgba(17,17,17,.28)' },
  { w: 150, h: 100, m: '110px 0 0 -76px', border: 'rgba(255,219,45,.85)' },
];

/** Spokes from the core out to the pentagon vertices. */
const A_SPOKES = [
  { d: 'M300 280 L300 90', stroke: 'rgba(255,163,0,.75)' },
  { d: 'M300 280 L480 221', stroke: 'rgba(17,17,17,.3)' },
  { d: 'M300 280 L412 434', stroke: 'rgba(255,163,0,.6)' },
  { d: 'M300 280 L188 434', stroke: 'rgba(255,163,0,.5)' },
  { d: 'M300 280 L119 221', stroke: 'rgba(17,17,17,.24)' },
];

/** Where each capability chip lands, relative to the core. */
const A_OUT = [
  { ox: 0, oy: -190, w: 150 },
  { ox: 180, oy: -59, w: 158 },
  { ox: 112, oy: 154, w: 152 },
  { ox: -112, oy: 154, w: 152 },
  { ox: -180, oy: -59, w: 158 },
];

export function HeroSignalLattice() {
  return (
    <Stage sw={620} sh={560}>
      {/* masked grid — fades out well before the stage edge, as in the doc */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(17,17,17,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(17,17,17,.055) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(420px 330px at 48% 50%,#000,transparent 78%)',
          WebkitMaskImage: 'radial-gradient(420px 330px at 48% 50%,#000,transparent 78%)',
        }}
      />

      {/* breathing wash behind the core */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 280,
          width: 520,
          height: 520,
          margin: '-260px 0 0 -260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,219,45,.22),transparent 56%)',
          animation: 'hc-breathe 7s ease-in-out infinite',
        }}
      />

      {/* signals + cluster frames */}
      <div style={{ position: 'absolute', left: 300, top: 280, width: 0, height: 0 }}>
        {A_SIGNALS.map((s, i) => (
          <div
            key={i}
            style={v({
              position: 'absolute',
              '--sx': `${s.s[0]}px`,
              '--sy': `${s.s[1]}px`,
              '--dx': `${s.d[0]}px`,
              '--dy': `${s.d[1]}px`,
              animation: 'hc-a-signal var(--loop) cubic-bezier(.65,0,.35,1) infinite',
              ...s.el,
            })}
          />
        ))}
        {A_CLUSTERS.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: c.w,
              height: c.h,
              margin: c.m,
              borderRadius: 14,
              border: `1px dashed ${c.border}`,
              animation: 'hc-a-cluster var(--loop) ease-in-out infinite',
            }}
          />
        ))}
      </div>

      {/* spokes + closing pentagon */}
      <svg width="620" height="560" viewBox="0 0 620 560" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g fill="none" strokeLinecap="round">
          {A_SPOKES.map((s, i) => (
            <path
              key={i}
              d={s.d}
              stroke={s.stroke}
              strokeWidth={1.3}
              strokeDasharray={210}
              style={{ animation: 'hc-a-spoke var(--loop) ease-in-out infinite' }}
            />
          ))}
          <path
            d="M300 90 L480 221 L412 434 L188 434 L119 221 Z"
            stroke="rgba(17,17,17,.2)"
            strokeWidth={1}
            strokeDasharray={1130}
            style={{ animation: 'hc-a-ring var(--loop) ease-in-out infinite' }}
          />
        </g>
      </svg>

      {/* core */}
      <div style={{ position: 'absolute', left: 300, top: 280, width: 0, height: 0 }}>
        <div
          style={{
            position: 'absolute',
            width: 170,
            height: 170,
            margin: '-85px 0 0 -85px',
            borderRadius: '50%',
            border: `1px solid rgba(255,163,0,.5)`,
            animation: 'hc-a-burst var(--loop) ease-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 132,
            height: 132,
            margin: '-66px 0 0 -66px',
            animation: 'hc-a-core var(--loop) cubic-bezier(.4,0,.2,1) infinite',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(255,219,45,.35),rgba(255,163,0,.14) 55%,transparent 72%)',
            }}
          />
          <svg width="132" height="132" viewBox="0 0 132 132" style={{ position: 'absolute', inset: 0, animation: 'hc-spin 26s linear infinite' }}>
            <polygon points="66,10 114,38 114,94 66,122 18,94 18,38" fill="rgba(255,255,255,.92)" stroke="rgba(17,17,17,.24)" strokeWidth={1} />
          </svg>
          <svg width="132" height="132" viewBox="0 0 132 132" style={{ position: 'absolute', inset: 0, animation: 'hc-spinr 18s linear infinite' }}>
            <polygon points="66,30 100,50 100,90 66,110 32,90 32,50" fill="none" stroke="rgba(255,163,0,.7)" strokeWidth={1} strokeDasharray="4 6" />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 20,
              height: 20,
              margin: '-10px 0 0 -10px',
              borderRadius: 5,
              background: `linear-gradient(140deg,${A1},${A2})`,
              boxShadow: '0 6px 18px rgba(255,163,0,.5)',
            }}
          />
        </div>
      </div>

      {/* capability chips ejecting outward */}
      <div style={{ position: 'absolute', left: 300, top: 280, width: 0, height: 0 }}>
        {A_OUT.map((o, i) => (
          <div
            key={OUTPUTS[i].label}
            style={v({
              position: 'absolute',
              width: o.w,
              margin: `-20px 0 0 -${o.w / 2}px`,
              '--ox': `${o.ox}px`,
              '--oy': `${o.oy}px`,
              animation: `hc-a-out var(--loop) cubic-bezier(.34,1.3,.5,1) ${i * 0.06}s infinite`,
            })}
          >
            <OutCard {...OUTPUTS[i]} />
          </div>
        ))}
      </div>
    </Stage>
  );
}

/* ========================================================================== */
/* 2b — Assembly Floor                                                        */
/* ========================================================================== */

/** Fragments sliding in along the two intake lanes. */
const B_IN: { s: [number, number]; d: [number, number]; w: number; h: number; fill: string; border: string; shadow?: string }[] = [
  { s: [-260, -250], d: [-120, -110], w: 66, h: 44, fill: CARD, border: CARD_LINE, shadow: '0 6px 16px rgba(17,17,17,.08)' },
  { s: [-160, -300], d: [-70, -140], w: 52, h: 36, fill: 'rgba(255,219,45,.16)', border: 'rgba(255,219,45,.85)' },
  { s: [-300, -120], d: [-150, -46], w: 58, h: 38, fill: CARD, border: CARD_LINE, shadow: '0 6px 16px rgba(17,17,17,.08)' },
  { s: [250, -270], d: [120, -120], w: 60, h: 40, fill: 'rgba(17,17,17,.05)', border: 'rgba(17,17,17,.28)' },
  { s: [310, -140], d: [150, -58], w: 50, h: 34, fill: CARD, border: CARD_LINE, shadow: '0 6px 16px rgba(17,17,17,.08)' },
  { s: [180, -330], d: [70, -150], w: 44, h: 30, fill: 'rgba(255,163,0,.1)', border: 'rgba(255,163,0,.5)' },
  { s: [-70, -340], d: [-14, -172], w: 38, h: 26, fill: CARD, border: CARD_LINE },
  { s: [60, -320], d: [22, -176], w: 34, h: 24, fill: 'rgba(255,219,45,.16)', border: 'rgba(255,219,45,.8)' },
];

/** Floor line work: two intake lanes, five traces out, closing loop. */
const B_LANES = [
  { d: 'M40 40 L150 150 L280 280', stroke: 'rgba(255,163,0,.6)', dash: 260, anim: 'hc-b-lane' },
  { d: 'M520 60 L400 180 L280 280', stroke: 'rgba(255,163,0,.5)', dash: 260, anim: 'hc-b-lane' },
  { d: 'M280 280 L110 190', stroke: 'rgba(255,163,0,.75)', dash: 340, anim: 'hc-b-trace' },
  { d: 'M280 280 L280 100', stroke: 'rgba(17,17,17,.34)', dash: 340, anim: 'hc-b-trace' },
  { d: 'M280 280 L450 190', stroke: 'rgba(255,163,0,.6)', dash: 340, anim: 'hc-b-trace' },
  { d: 'M280 280 L160 440', stroke: 'rgba(255,219,45,.9)', dash: 340, anim: 'hc-b-trace' },
  { d: 'M280 280 L410 440', stroke: 'rgba(17,17,17,.26)', dash: 340, anim: 'hc-b-trace' },
  { d: 'M110 190 L280 100 L450 190 L410 440 L160 440 Z', stroke: 'rgba(17,17,17,.18)', dash: 340, anim: 'hc-b-trace' },
];

/** Product panels rising off the floor, with their in-card detail. */
const B_PANELS: { x: number; y: number; z: number; w: number; label: string; accent: string; body: React.ReactNode }[] = [
  {
    x: -170,
    y: -90,
    z: 120,
    w: 132,
    label: 'AI Agent',
    accent: A2,
    body: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 9 }}>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,163,0,.75)', width: '82%' }} />
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(17,17,17,.1)', width: '60%' }} />
      </div>
    ),
  },
  {
    x: 0,
    y: -180,
    z: 150,
    w: 136,
    label: 'Automation',
    accent: A3,
    body: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <div style={{ width: 9, height: 9, borderRadius: 2, border: '1px solid rgba(17,17,17,.55)' }} />
        <div style={{ flex: 1, height: 1, background: 'rgba(17,17,17,.3)' }} />
        <div style={{ width: 9, height: 9, borderRadius: 2, border: '1px solid rgba(17,17,17,.55)' }} />
        <div style={{ flex: 1, height: 1, background: 'rgba(17,17,17,.3)' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: A1 }} />
      </div>
    ),
  },
  {
    x: 170,
    y: -90,
    z: 126,
    w: 136,
    label: 'Dashboard',
    accent: A1,
    body: (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 10, height: 24 }}>
        <div style={{ flex: 1, height: '38%', borderRadius: 2, background: 'rgba(255,219,45,.55)' }} />
        <div style={{ flex: 1, height: '66%', borderRadius: 2, background: 'rgba(255,219,45,.8)' }} />
        <div style={{ flex: 1, height: '48%', borderRadius: 2, background: 'rgba(255,219,45,.5)' }} />
        <div style={{ flex: 1, height: '100%', borderRadius: 2, background: A1 }} />
      </div>
    ),
  },
  {
    x: -120,
    y: 140,
    z: 96,
    w: 130,
    label: 'AI App',
    accent: A2,
    body: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 9 }}>
        <div style={{ height: 12, borderRadius: 3, background: 'rgba(17,17,17,.07)' }} />
        <div style={{ height: 12, borderRadius: 3, background: 'rgba(255,163,0,.45)' }} />
        <div style={{ height: 12, borderRadius: 3, background: 'rgba(17,17,17,.06)' }} />
        <div style={{ height: 12, borderRadius: 3, background: 'rgba(17,17,17,.1)' }} />
      </div>
    ),
  },
  {
    x: 120,
    y: 140,
    z: 100,
    w: 130,
    label: 'Integration',
    accent: A1,
    body: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 10 }}>
        <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid rgba(255,163,0,.75)` }} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${A1},${A2})` }} />
        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid rgba(17,17,17,.4)' }} />
      </div>
    ),
  },
];

export function HeroAssemblyFloor() {
  return (
    <Stage sw={620} sh={580}>
      <div style={{ position: 'absolute', inset: 0, perspective: '1300px' }}>
        <div
          style={{
            position: 'absolute',
            left: 310,
            top: 300,
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
            transform: 'rotateX(58deg) rotateZ(-40deg)',
          }}
        >
          {/* the floor itself */}
          <div
            style={{
              position: 'absolute',
              width: 560,
              height: 560,
              margin: '-280px 0 0 -280px',
              backgroundImage:
                'linear-gradient(rgba(17,17,17,.11) 1px,transparent 1px),linear-gradient(90deg,rgba(17,17,17,.11) 1px,transparent 1px)',
              backgroundSize: '56px 56px',
              border: '1px solid rgba(17,17,17,.16)',
              borderRadius: 6,
              backgroundColor: 'rgba(255,255,255,.62)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 300,
              height: 300,
              margin: '-150px 0 0 -150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(255,219,45,.42),transparent 66%)',
              animation: 'hc-breathe 7s ease-in-out infinite',
            }}
          />

          <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', margin: '-280px 0 0 -280px', overflow: 'visible' }}>
            <g fill="none" strokeLinecap="round">
              {B_LANES.map((l, i) => (
                <path
                  key={i}
                  d={l.d}
                  stroke={l.stroke}
                  strokeWidth={l.anim === 'hc-b-lane' ? 1.4 : 1.4}
                  strokeDasharray={l.dash}
                  style={{ animation: `${l.anim} var(--loop) ease-in-out infinite` }}
                />
              ))}
            </g>
          </svg>

          {/* fragments arriving */}
          {B_IN.map((f, i) => (
            <div
              key={i}
              style={v({
                position: 'absolute',
                width: f.w,
                height: f.h,
                margin: `-${f.h / 2}px 0 0 -${f.w / 2}px`,
                borderRadius: 6,
                background: f.fill,
                border: `1px solid ${f.border}`,
                boxShadow: f.shadow ?? 'none',
                '--sx': `${f.s[0]}px`,
                '--sy': `${f.s[1]}px`,
                '--dx': `${f.d[0]}px`,
                '--dy': `${f.d[1]}px`,
                animation: `hc-b-in var(--loop) cubic-bezier(.6,0,.3,1) ${i * 0.05}s infinite`,
              })}
            />
          ))}

          {/* the engine slab */}
          <div
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              margin: '-75px 0 0 -75px',
              transformStyle: 'preserve-3d',
              animation: 'hc-b-core var(--loop) cubic-bezier(.4,0,.2,1) infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 14,
                background: `linear-gradient(135deg,rgba(255,219,45,.55),rgba(255,163,0,.3)),${CARD}`,
                border: '1px solid rgba(17,17,17,.2)',
                boxShadow: '0 18px 40px rgba(255,163,0,.34)',
              }}
            />
            <div style={{ position: 'absolute', inset: 26, borderRadius: 8, border: '1px solid rgba(17,17,17,.3)', animation: 'hc-spin 22s linear infinite' }} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 24,
                height: 24,
                margin: '-12px 0 0 -12px',
                borderRadius: 6,
                background: `linear-gradient(140deg,${A1},${A2})`,
                boxShadow: '0 8px 20px rgba(255,163,0,.5)',
              }}
            />
          </div>

          {/* product panels rising, kept screen-facing so labels stay readable */}
          {B_PANELS.map((p, i) => (
            <div
              key={p.label}
              style={v({
                position: 'absolute',
                width: p.w,
                margin: `-40px 0 0 -${p.w / 2}px`,
                '--x': `${p.x}px`,
                '--y': `${p.y}px`,
                '--z': `${p.z}px`,
                animation: `hc-b-rise var(--loop) cubic-bezier(.3,1.2,.5,1) ${i * 0.07}s infinite`,
              })}
            >
              <div style={{ padding: '11px 12px', borderRadius: 11, background: CARD, border: `1px solid ${CARD_LINE}`, boxShadow: '0 18px 38px rgba(17,17,17,.14)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: p.accent === A1 ? '#8A6A00' : p.accent === A2 ? '#8A5A00' : A3 }}>
                  {p.label}
                </div>
                {p.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* ========================================================================== */
/* 2c — Emergence                                                             */
/* ========================================================================== */

/** Streaks and fragments pulled in from off-frame. */
const C_STREAMS: { s: [number, number]; m: [number, number]; el: React.CSSProperties }[] = [
  { s: [-300, -190], m: [-120, -70], el: { width: 46, height: 2, margin: '0 0 0 -23px', borderRadius: 1, background: `linear-gradient(90deg,transparent,${A2})` } },
  { s: [310, -210], m: [130, -80], el: { width: 46, height: 2, margin: '0 0 0 -23px', borderRadius: 1, background: 'linear-gradient(90deg,rgba(17,17,17,.7),transparent)' } },
  { s: [-330, 40], m: [-140, 20], el: { width: 40, height: 2, margin: '0 0 0 -20px', borderRadius: 1, background: `linear-gradient(90deg,transparent,${A1})` } },
  { s: [330, 60], m: [140, 30], el: { width: 40, height: 2, margin: '0 0 0 -20px', borderRadius: 1, background: `linear-gradient(90deg,${A2},transparent)` } },
  { s: [-250, -280], m: [-100, -120], el: { width: 56, height: 34, margin: '-17px 0 0 -28px', borderRadius: 6, background: CARD, border: `1px solid ${CARD_LINE}`, boxShadow: '0 6px 18px rgba(17,17,17,.07)' } },
  { s: [250, -290], m: [105, -125], el: { width: 44, height: 28, margin: '-14px 0 0 -22px', borderRadius: 6, background: 'rgba(255,219,45,.16)', border: `1px solid rgba(255,219,45,.85)` } },
  { s: [-180, 210], m: [-80, 100], el: { width: 36, height: 24, margin: '-12px 0 0 -18px', borderRadius: '9px 9px 9px 3px', border: `1px solid rgba(255,163,0,.5)`, background: 'rgba(255,163,0,.09)' } },
  { s: [200, 220], m: [90, 105], el: { width: 8, height: 8, margin: '-4px 0 0 -4px', borderRadius: '50%', background: A1, boxShadow: '0 0 0 5px rgba(255,219,45,.2)' } },
  { s: [-60, -300], m: [-24, -130], el: { width: 7, height: 7, margin: '-3px 0 0 -3px', borderRadius: '50%', background: A3, boxShadow: '0 0 0 5px rgba(17,17,17,.07)' } },
  { s: [90, 280], m: [36, 126], el: { width: 7, height: 7, margin: '-3px 0 0 -3px', borderRadius: '50%', background: A2, boxShadow: '0 0 0 5px rgba(255,163,0,.14)' } },
];

/** Where the five cards settle, in a shallow arc around the monolith. */
const C_PANELS = [
  { x: -172, y: -116, w: 150 },
  { x: -182, y: 64, w: 158 },
  { x: 190, y: -130, w: 152 },
  { x: 198, y: 38, w: 150 },
  { x: 0, y: 196, w: 156 },
];
/** Doc order runs agent → automation → dashboards → app → integration. */
const C_ORDER = [0, 1, 2, 3, 4];

export function HeroEmergence() {
  return (
    <Stage sw={660} sh={620}>
      {/* two slow-breathing washes */}
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: -80,
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,219,45,.17),transparent 60%)',
          filter: 'blur(8px)',
          animation: 'hc-breathe 11s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 180,
          bottom: -160,
          width: 620,
          height: 620,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,163,0,.11),transparent 60%)',
          filter: 'blur(10px)',
          animation: 'hc-breathe 13s ease-in-out infinite',
        }}
      />

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* the slow camera push runs the whole loop */}
        <div style={{ position: 'absolute', inset: 0, animation: 'hc-c-push var(--loop) ease-in-out infinite' }}>
          {/* horizon line — deployment */}
          <div
            style={{
              position: 'absolute',
              left: -40,
              right: -40,
              top: 430,
              height: 1,
              background: `linear-gradient(90deg,transparent,${A2},transparent)`,
              animation: 'hc-c-horizon var(--loop) cubic-bezier(.3,0,.2,1) infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -40,
              right: -40,
              top: 431,
              height: 120,
              background: 'linear-gradient(180deg,rgba(255,219,45,.13),transparent)',
              animation: 'hc-c-horizon var(--loop) cubic-bezier(.3,0,.2,1) infinite',
            }}
          />

          {/* streams in */}
          <div style={{ position: 'absolute', left: 330, top: 300, width: 0, height: 0 }}>
            {C_STREAMS.map((s, i) => (
              <div
                key={i}
                style={v({
                  position: 'absolute',
                  '--sx': `${s.s[0]}px`,
                  '--sy': `${s.s[1]}px`,
                  '--mx': `${s.m[0]}px`,
                  '--my': `${s.m[1]}px`,
                  animation: `hc-c-stream var(--loop) cubic-bezier(.5,0,.3,1) ${(i * 0.08).toFixed(2)}s infinite`,
                  ...s.el,
                })}
              />
            ))}
          </div>

          {/* the monolith */}
          <div style={{ position: 'absolute', left: 330, top: 300, width: 0, height: 0 }}>
            <div
              style={{
                position: 'absolute',
                width: 280,
                height: 280,
                margin: '-140px 0 0 -140px',
                borderRadius: '50%',
                border: `1px solid rgba(255,163,0,.45)`,
                animation: 'hc-c-halo var(--loop) ease-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 96,
                height: 250,
                margin: '-125px 0 0 -48px',
                borderRadius: 16,
                overflow: 'hidden',
                transformOrigin: '50% 100%',
                background: `linear-gradient(180deg,rgba(255,219,45,.72),rgba(255,163,0,.42) 62%,rgba(255,219,45,.3)),${CARD}`,
                border: '1px solid rgba(17,17,17,.2)',
                boxShadow: '0 26px 60px rgba(255,163,0,.34)',
                animation: 'hc-c-monolith var(--loop) cubic-bezier(.4,0,.2,1) infinite',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 60,
                  background: 'linear-gradient(180deg,transparent,rgba(255,255,255,.95),transparent)',
                  animation: 'hc-c-sweep var(--loop) cubic-bezier(.4,0,.2,1) infinite',
                }}
              />
              <div style={{ position: 'absolute', left: 22, right: 22, top: 38, height: 1, background: 'rgba(17,17,17,.34)' }} />
              <div style={{ position: 'absolute', left: 22, right: 22, top: 76, height: 1, background: 'rgba(17,17,17,.22)' }} />
              <div style={{ position: 'absolute', left: 22, right: 22, bottom: 52, height: 1, background: 'rgba(17,17,17,.16)' }} />
            </div>
            <div
              style={{
                position: 'absolute',
                width: 96,
                height: 96,
                margin: '126px 0 0 -48px',
                borderRadius: 16,
                background: 'linear-gradient(180deg,rgba(255,163,0,.22),transparent)',
                filter: 'blur(3px)',
                opacity: 0.5,
              }}
            />
          </div>

          {/* cards settling into the arc */}
          <div style={{ position: 'absolute', left: 330, top: 300, width: 0, height: 0 }}>
            {C_PANELS.map((p, i) => (
              <div
                key={OUTPUTS[C_ORDER[i]].label}
                style={v({
                  position: 'absolute',
                  width: p.w,
                  margin: `-26px 0 0 -${p.w / 2}px`,
                  '--x': `${p.x}px`,
                  '--y': `${p.y}px`,
                  animation: `hc-c-panel var(--loop) cubic-bezier(.25,1.1,.4,1) ${(i * 0.07).toFixed(2)}s infinite`,
                })}
              >
                <OutCard {...OUTPUTS[C_ORDER[i]]} />
              </div>
            ))}
          </div>
        </div>

        {/* left-edge fade, so the scene never crowds the headline */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg,#FFFFFF 0%,rgba(255,255,255,0) 11%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </Stage>
  );
}
