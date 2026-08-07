/**
 * Animated hero visual for /services/ai-development.
 *
 * Same visual language as the homepage mascot (brand glow, floating cards,
 * yellow accents, a caption pill, pure CSS — keyframes live in globals.css) but
 * built out of this page's own subject matter: retrieval grounded in the
 * client's knowledge, a cited model response, and the outcomes it ships as —
 * RAG, Custom AI, Agents, LLM integration and dashboards, top to bottom.
 */
import { Icon } from './icons';

const SOURCES = [
  { label: 'PDFs & docs', icon: 'file-text' },
  { label: 'Databases', icon: 'database' },
  { label: 'APIs', icon: 'share-2' },
];

const CHUNKS = ['handbook.pdf · p12', 'crm/accounts', 'api/orders'];

const OUTCOMES = [
  { label: 'Cited answers', icon: 'check-check' },
  { label: 'Agents that act', icon: 'bot' },
  { label: 'Live dashboards', icon: 'bar-chart-3' },
];

/** Stage label, in the same key as the mascot's "Data in →" flow captions. */
function Flow({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-body-dim">{children}</div>
  );
}

/** Vertical connector with a token travelling down it. */
function Pipe({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative mx-auto h-[22px] w-px bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.05))]">
      <span
        className="absolute left-1/2 top-0 h-[7px] w-[7px] rounded-full bg-brand shadow-[0_0_9px_2px_rgba(255,219,45,0.65)]"
        style={{ animation: `pipeDot 2.4s linear infinite ${delay}s` }}
      />
    </div>
  );
}

/** Small white pill used for both the inputs and the outputs. */
function Pill({ label, icon, style }: { label: string; icon: string; style?: React.CSSProperties }) {
  return (
    <div
      className="flex items-center gap-2 rounded-[12px] border border-surface-line bg-white px-2.5 py-1.5 text-[11px] font-bold text-black shadow-[0_10px_26px_rgba(0,0,0,0.09)]"
      style={style}
    >
      <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-lg bg-surface-tint2 text-black">
        <Icon name={icon} size={13} />
      </span>
      {label}
    </div>
  );
}

export function HeroAiPipeline() {
  return (
    <div className="ai-pipeline relative mx-auto w-full max-w-[480px]">
      {/* brand glow behind the stack, mirroring the mascot's halo */}
      <div className="pointer-events-none absolute inset-[-9%] rounded-full blur-[4px] [background:radial-gradient(circle_at_50%_40%,rgba(255,219,45,0.30),rgba(255,219,45,0.08)_56%,transparent_72%)]" />

      <div className="relative">
        {/* ---- knowledge in ---- */}
        <Flow>Your knowledge in ↓</Flow>
        {/* fixed 3 columns so the row never wraps as the hero column narrows */}
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {SOURCES.map(({ label, icon }, i) => (
            <Pill
              key={label}
              label={label}
              icon={icon}
              style={{ animation: `heroFloat ${4 + i * 0.3}s ease-in-out infinite ${i * 0.35}s` }}
            />
          ))}
        </div>

        <Pipe />

        {/* ---- retrieval: your data, chunked, indexed and matched ---- */}
        <div className="rounded-[16px] border border-[#EDEBE3] bg-white p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.07)]">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="inline-flex h-[24px] w-[24px] items-center justify-center rounded-lg bg-surface-tint2 text-black">
              <Icon name="database" size={13} />
            </span>
            <span className="text-[11.5px] font-extrabold tracking-[0.01em] text-[#111]">Retrieval over your data</span>
            <span className="ml-auto flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.08em] text-body-dim">
              <span className="h-1.5 w-1.5 animate-[implDot_1.4s_ease-in-out_infinite] rounded-full bg-brand" />
              indexed
            </span>
          </div>
          {/* vector index — tiles light up as the query is matched */}
          <div className="grid gap-[4px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0,1fr))' }}>
            {Array.from({ length: 32 }, (_, i) => (
              <span
                key={i}
                className="h-[8px] rounded-[3px] bg-[#F0EEE6]"
                style={{ animation: `ragChunk 3.2s ease-in-out infinite ${((i % 16) * 0.07 + Math.floor(i / 16) * 0.14).toFixed(2)}s` }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {CHUNKS.map((c, i) => (
              <span
                key={c}
                className="rounded-full border border-surface-line bg-surface-tint2 px-2 py-[3px] text-[10px] font-bold text-[#333]"
                style={{ animation: `chunkPop 3.2s ease-in-out infinite ${(0.4 + i * 0.35).toFixed(2)}s` }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <Pipe delay={0.8} />

        {/* ---- the model, answering from what came back ---- */}
        <div className="rounded-[16px] border border-[#1E1E1E] p-3.5 shadow-[0_20px_44px_rgba(0,0,0,0.30)] [background:linear-gradient(160deg,#1A1A1A,#070707)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex h-[24px] w-[24px] items-center justify-center rounded-lg bg-brand text-black">
              <Icon name="brain" size={13} />
            </span>
            <span className="text-[11.5px] font-extrabold tracking-[0.01em] text-white">LLM reasoning</span>
            <span className="ml-auto text-[9.5px] font-bold uppercase tracking-[0.08em] text-body-onDark">streaming</span>
          </div>
          <div className="flex flex-col gap-2">
            {[1, 0.82, 0.56].map((w, i) => (
              <div key={i} className="h-[6px] overflow-hidden rounded bg-white/[0.07]" style={{ width: `${w * 100}%` }}>
                <div
                  className="h-full w-full origin-left rounded bg-white/55"
                  style={{ animation: `tokenLine 3.4s ease-in-out infinite ${(i * 0.45).toFixed(2)}s` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-[12px] w-[6px] animate-[caretBlink_1s_step-end_infinite] rounded-[2px] bg-brand" />
            <span className="ml-auto rounded-full border border-brand/40 px-2 py-[3px] text-[10px] font-bold text-brand">
              3 sources cited
            </span>
          </div>
        </div>

        <Pipe delay={1.6} />

        {/* ---- what it ships as ---- */}
        <Flow>Production AI out →</Flow>
        {/* fixed 3 columns so the row never wraps as the hero column narrows */}
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {OUTCOMES.map(({ label, icon }, i) => (
            <Pill
              key={label}
              label={label}
              icon={icon}
              style={{ animation: `outcomeGlow 4.5s ease-in-out infinite ${(i * 1.5).toFixed(2)}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
