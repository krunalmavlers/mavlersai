import React from 'react';

/**
 * Circuit traces behind the centred hero.
 *
 * Two mirrored fans of PCB-style track: horizontal runs joined by 45° elbows,
 * each ending in a terminal node. They enter from the left and right edges and
 * stop well short of the middle, so the headline always sits on clean ground.
 *
 * Every path carries `pathLength="1"`, which normalises its length regardless
 * of the actual geometry. That lets one CSS rule retract all of them by the
 * same fraction — see `.ct-line` in globals.css — without measuring anything in
 * JavaScript. At rest the traces are fully drawn; scrolling withdraws them back
 * towards the edge they came from, and scrolling up draws them out again.
 */

type Trace = {
  /** path data, drawn inside a 0 0 420 600 box starting at the x=0 edge */
  d: string;
  /** terminal node position */
  cx: number;
  cy: number;
  /** hollow nodes read as vias, filled ones as pads — the reference has both */
  hollow?: boolean;
  w: number;
  o: number;
  r?: number;
};

// Hand-placed rather than generated: the reference's character comes from the
// runs being uneven, with elbows at different depths and a few straight tracks.
const TRACES: Trace[] = [
  { d: 'M0,54 H118 L150,22 H292', cx: 292, cy: 22, w: 3, o: 0.8, r: 6 },
  { d: 'M0,92 H96 L132,56 H244', cx: 244, cy: 56, w: 2.4, o: 0.5, hollow: true },
  { d: 'M0,128 H74 L114,88 H208', cx: 208, cy: 88, w: 3.2, o: 0.72, r: 6 },
  { d: 'M0,172 H156 L192,136 H326', cx: 326, cy: 136, w: 2.2, o: 0.42 },
  { d: 'M0,210 H58 L94,174 H170', cx: 170, cy: 174, w: 3, o: 0.62, hollow: true, r: 6 },
  { d: 'M0,250 H136 L172,214 H280', cx: 280, cy: 214, w: 2.6, o: 0.55 },
  { d: 'M0,296 H198', cx: 198, cy: 296, w: 3.4, o: 0.78, r: 6.5 },
  { d: 'M0,336 H108 L146,374 H256', cx: 256, cy: 374, w: 2.4, o: 0.5 },
  { d: 'M0,382 H66 L104,420 H186', cx: 186, cy: 420, w: 3, o: 0.68, r: 6, hollow: true },
  { d: 'M0,426 H168 L206,464 H308', cx: 308, cy: 464, w: 2.2, o: 0.44 },
  { d: 'M0,476 H88 L126,514 H212', cx: 212, cy: 514, w: 3.2, o: 0.6, r: 6 },
  { d: 'M0,526 H148 L186,564 H292', cx: 292, cy: 564, w: 2.5, o: 0.48, hollow: true },
];

function Fan({ side }: { side: 'l' | 'r' }) {
  // Each fan needs its own gradient id — two elements sharing one id in the
  // same document is invalid and only the first would resolve.
  const grad = `ctGrad-${side}`;
  return (
    <svg
      viewBox="0 0 420 600"
      preserveAspectRatio={side === 'l' ? 'xMinYMid meet' : 'xMaxYMid meet'}
      fill="none"
      aria-hidden
      className={`ct-fan ct-fan-${side}`}
    >
      <defs>
        {/*
          x=0 is the screen edge and x=420 the inward tip, so the sweep runs
          orange at the edge into brand yellow towards the middle.
          `userSpaceOnUse` resolves these coordinates in the user space of the
          element that references the gradient — and those paths sit inside the
          mirrored group below — so the right fan picks up the flip and lands
          its orange on the right edge. No second, reversed gradient needed.
        */}
        <linearGradient id={grad} x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F0903C" />
          <stop offset="0.34" stopColor="#FFC53A" />
          <stop offset="1" stopColor="#FFDB2D" />
        </linearGradient>
      </defs>
      {/* the right fan is the same artwork flipped, so the two read as one net */}
      <g transform={side === 'r' ? 'translate(420,0) scale(-1,1)' : undefined}>
        {TRACES.map((t, i) => (
          <g
            key={i}
            className="ct-g"
            style={{ '--i': side === 'l' ? i : TRACES.length - 1 - i } as React.CSSProperties}
          >
            <path
              d={t.d}
              pathLength="1"
              className="ct-line"
              stroke={`url(#${grad})`}
              strokeOpacity={t.o}
              strokeWidth={t.w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              className="ct-dot"
              cx={t.cx}
              cy={t.cy}
              r={t.r ?? 5}
              fill={t.hollow ? '#FFFFFF' : `url(#${grad})`}
              fillOpacity={t.hollow ? 1 : t.o}
              stroke={`url(#${grad})`}
              strokeOpacity={t.o}
              strokeWidth={t.hollow ? t.w : 0}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function HeroCircuit() {
  return (
    <div aria-hidden className="ct-wrap pointer-events-none absolute inset-0">
      <Fan side="l" />
      <Fan side="r" />
    </div>
  );
}
