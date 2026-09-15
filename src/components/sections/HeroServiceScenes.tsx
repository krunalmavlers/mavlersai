/**
 * Hero animations for the two service pages that had none.
 *
 *   HeroAutomationFlow  (/services/automation-integration) — source systems on
 *     the left feed an orchestration slab, which fans the work out to the tools
 *     a team actually works in. Packets run the rails continuously; the rails
 *     themselves draw in once per loop.
 *
 *   HeroValidationLoop  (/services/product-development) — a build/test/learn
 *     orbit. A marker travels the ring lighting each station as it passes, while
 *     the product card in the middle gains fidelity and its version ticks up.
 *
 * Both are authored against the same contract as HeroConcepts: a fixed `Stage`
 * box scaled to the hero column by `.hero-stage`, the same yellow/orange/ink
 * palette, and one shared loop length so the two pages feel like siblings.
 * Keyframes live in globals.css under the `hs-` prefix.
 */

const A1 = '#FFDB2D'; // brand yellow
const A2 = '#FFA300'; // brand orange
const A3 = '#111111'; // ink

const CARD = '#FFFFFF';
const CARD_LINE = '#ECECE8';
const CARD_SHADOW = '0 10px 26px rgba(17,17,17,.09)';
const LABEL = '#25252B';
const RAIL = 'rgba(17,17,17,.14)';

type Vars = Record<string, string | number>;
const v = (o: Vars) => o as React.CSSProperties;

function Stage({ sw, sh, children }: { sw: number; sh: number; children: React.ReactNode }) {
  return (
    <div className="hero-stage" style={v({ '--sw': sw, '--sh': sh, '--loop': '9s' })}>
      <div className="hero-stage-inner">{children}</div>
    </div>
  );
}

/** Small white system tile — the vocabulary both scenes share with the site. */
function Tile({
  label,
  dot,
  x,
  y,
  w = 150,
  delay = 0,
}: {
  label: string;
  dot: string;
  x: number;
  y: number;
  w?: number;
  delay?: number;
}) {
  return (
    <div
      className="hs-tile"
      style={v({
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '11px 13px',
        borderRadius: 11,
        background: CARD,
        border: `1px solid ${CARD_LINE}`,
        boxShadow: CARD_SHADOW,
        animationDelay: `${delay}s`,
      })}
    >
      <span style={{ width: 8, height: 8, borderRadius: 2, background: dot, flexShrink: 0 }} />
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 800,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: LABEL,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* Automation & Integration — systems in, orchestration, tools out            */
/* ========================================================================== */

const SOURCES = [
  { label: 'CRM', dot: A1, y: 96 },
  { label: 'ERP', dot: A3, y: 244 },
  { label: 'Forms', dot: A2, y: 392 },
];
const TARGETS = [
  { label: 'Slack', dot: A2, y: 96 },
  { label: 'Sheets', dot: A1, y: 244 },
  { label: 'Email', dot: A3, y: 392 },
];

/**
 * Rail geometry, defined once and used twice — the drawn path and the packet
 * that rides it. Previously the packets were positioned independently and ran
 * a straight horizontal leg, which left the rail the moment it began to curve.
 * A single `d` string per rail makes that impossible.
 */
const inRail = (y: number) => {
  const a = y + 21;
  return `M168 ${a} H214 Q238 ${a} 238 ${(a + 280) / 2} Q238 280 262 280`;
};
const outRail = (y: number) => {
  const b = y + 21;
  return `M358 280 Q382 280 382 ${(280 + b) / 2} Q382 ${b} 406 ${b} H452`;
};

export function HeroAutomationFlow() {
  return (
    <Stage sw={620} sh={560}>
      {/* faint grid, masked well before the edge */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(17,17,17,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(17,17,17,.05) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(400px 320px at 50% 50%,#000,transparent 78%)',
          WebkitMaskImage: 'radial-gradient(400px 320px at 50% 50%,#000,transparent 78%)',
        }}
      />

      {/* wash behind the orchestrator */}
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 280,
          width: 420,
          height: 420,
          margin: '-210px 0 0 -210px',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,219,45,.22),transparent 58%)',
          animation: 'hs-breathe 7s ease-in-out infinite',
        }}
      />

      {/* rails: each draws in once per loop, then holds while packets run it */}
      <svg
        viewBox="0 0 620 560"
        fill="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden
      >
        {SOURCES.map((s, i) => (
          <path
            key={`in-${i}`}
            className="hs-rail"
            style={v({ '--d': `${i * 0.18}s` })}
            d={inRail(s.y)}
            stroke={RAIL}
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
          />
        ))}
        {TARGETS.map((t, i) => (
          <path
            key={`out-${i}`}
            className="hs-rail"
            style={v({ '--d': `${0.9 + i * 0.18}s` })}
            d={outRail(t.y)}
            stroke={RAIL}
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
          />
        ))}
      </svg>

      {/* Packets ride the rail. The stage is authored at its real pixel size —
          `.hero-stage-inner` is exactly 620x560px before it is scaled — so an
          SVG user unit and a CSS pixel are the same thing here, and the same
          `d` string drives both the drawn path and `offset-path`. */}
      {SOURCES.map((s, i) => (
        <span
          key={`pin-${i}`}
          className="hs-packet"
          style={v({ offsetPath: `path('${inRail(s.y)}')`, '--d': `${i * 0.7}s`, background: s.dot })}
        />
      ))}
      {TARGETS.map((t, i) => (
        <span
          key={`pout-${i}`}
          className="hs-packet"
          style={v({ offsetPath: `path('${outRail(t.y)}')`, '--d': `${1.6 + i * 0.7}s`, background: t.dot })}
        />
      ))}

      {SOURCES.map((s, i) => (
        <Tile key={s.label} label={s.label} dot={s.dot} x={18} y={s.y} delay={i * 0.12} />
      ))}
      {TARGETS.map((t, i) => (
        <Tile key={t.label} label={t.label} dot={t.dot} x={452} y={t.y} delay={0.5 + i * 0.12} />
      ))}

      {/* the orchestrator */}
      <div
        className="hs-core"
        style={{
          position: 'absolute',
          left: 310,
          top: 280,
          width: 96,
          height: 96,
          margin: '-48px 0 0 -48px',
          borderRadius: 26,
          background: CARD,
          border: `1px solid ${CARD_LINE}`,
          boxShadow: '0 14px 34px rgba(17,17,17,.12)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `linear-gradient(150deg, ${A1}, ${A2})`,
            display: 'block',
            animation: 'hs-pulse 3.2s ease-in-out infinite',
          }}
        />
      </div>
      <span
        aria-hidden
        className="hs-ring"
        style={{ position: 'absolute', left: 310, top: 280, width: 96, height: 96, margin: '-48px 0 0 -48px' }}
      />

      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 356,
          transform: 'translateX(-50%)',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: LABEL,
          whiteSpace: 'nowrap',
        }}
      >
        Orchestration
      </div>
    </Stage>
  );
}

/* ========================================================================== */
/* Product & Validation — build, test, learn                                  */
/* ========================================================================== */

const STATIONS = [
  { label: 'Build', angle: -90, dot: A1 },
  { label: 'Test', angle: 30, dot: A2 },
  { label: 'Learn', angle: 150, dot: A3 },
];
const R = 176;

export function HeroValidationLoop() {
  return (
    <Stage sw={620} sh={560}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(17,17,17,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(17,17,17,.05) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(400px 330px at 50% 50%,#000,transparent 78%)',
          WebkitMaskImage: 'radial-gradient(400px 330px at 50% 50%,#000,transparent 78%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 280,
          width: 440,
          height: 440,
          margin: '-220px 0 0 -220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,219,45,.2),transparent 58%)',
          animation: 'hs-breathe 7s ease-in-out infinite',
        }}
      />

      {/* the loop itself: a dashed ring that rotates slowly, so the cycle reads
          as continuous rather than as three separate stops */}
      <svg
        viewBox="0 0 620 560"
        fill="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden
      >
        <circle
          cx="310"
          cy="280"
          r={R}
          stroke="rgba(17,17,17,.16)"
          strokeWidth="2"
          strokeDasharray="6 12"
          strokeLinecap="round"
          style={{ transformOrigin: '310px 280px', animation: 'hs-spin 40s linear infinite' }}
        />
        <circle
          cx="310"
          cy="280"
          r={R}
          className="hs-arc"
          stroke={A1}
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          style={{ transformOrigin: '310px 280px', transform: 'rotate(-90deg)' }}
        />
      </svg>

      {/* the marker orbiting the ring */}
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 280,
          width: 0,
          height: 0,
          animation: 'hs-spin 9s linear infinite',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: -R,
            width: 15,
            height: 15,
            margin: '-7.5px 0 0 -7.5px',
            borderRadius: '50%',
            background: A2,
            boxShadow: `0 0 0 6px rgba(255,163,0,.18)`,
          }}
        />
      </div>

      {/* stations */}
      {STATIONS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        return (
          <div
            key={s.label}
            className="hs-station"
            style={v({
              position: 'absolute',
              left: 310 + Math.cos(rad) * R,
              top: 280 + Math.sin(rad) * R,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '10px 14px',
              borderRadius: 999,
              background: CARD,
              border: `1px solid ${CARD_LINE}`,
              boxShadow: CARD_SHADOW,
              '--d': `${i * 3}s`,
            })}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: LABEL,
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}

      {/* the product gaining fidelity in the middle */}
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 280,
          width: 170,
          height: 128,
          margin: '-64px 0 0 -85px',
          borderRadius: 16,
          background: CARD,
          border: `1px solid ${CARD_LINE}`,
          boxShadow: '0 14px 34px rgba(17,17,17,.12)',
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: A1 }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(17,17,17,.15)' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(17,17,17,.15)' }} />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="hs-bar"
            style={v({
              display: 'block',
              height: 9,
              borderRadius: 4,
              marginBottom: 9,
              width: [96, 128, 74, 110][i],
              background: i === 0 ? `linear-gradient(90deg, ${A1}, ${A2})` : 'rgba(17,17,17,.1)',
              '--d': `${i * 0.4}s`,
            })}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 486,
          transform: 'translateX(-50%)',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: LABEL,
          whiteSpace: 'nowrap',
        }}
      >
        Ship · Measure · Iterate
      </div>
    </Stage>
  );
}
