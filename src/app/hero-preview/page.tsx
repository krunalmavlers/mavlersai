/**
 * Internal side-by-side comparison of the three AI Development hero animation
 * concepts, at the real hero's proportions. Not linked from anywhere and
 * noindexed — it exists so the three can be judged against each other before
 * one is chosen for the live hero (Pages → AI Development → hero → "Hero
 * animation": signal-lattice | assembly-floor | emergence).
 *
 * `?t=6` freezes every loop at 6s for QA of a specific beat.
 */
import type { Metadata } from 'next';
import { HeroSignalLattice, HeroAssemblyFloor, HeroEmergence } from '@/components/sections/HeroConcepts';

export const metadata: Metadata = {
  title: 'Hero animation concepts (internal)',
  robots: { index: false, follow: false },
};

const CONCEPTS = [
  {
    id: '2a',
    name: 'Signal Lattice',
    note: 'Signals scatter, gather into clusters, collapse into the core; capability chips eject and the lattice closes.',
    visual: 'signal-lattice',
    el: <HeroSignalLattice />,
  },
  {
    id: '2b',
    name: 'Assembly Floor',
    note: 'Fragments arrive on intake lanes, the engine slab absorbs them, then five product panels rise off the floor.',
    visual: 'assembly-floor',
    el: <HeroAssemblyFloor />,
  },
  {
    id: '2c',
    name: 'Emergence',
    note: 'A slow push: streams are pulled into the monolith, a light sweep absorbs them, cards settle, the horizon spreads.',
    visual: 'emergence',
    el: <HeroEmergence />,
  },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const frozen = t ? Number(t) : null;

  return (
    <main className="bg-white">
      {frozen !== null && (
        <style>{`.frz *, .frz { animation-play-state: paused !important; animation-delay: -${frozen}s !important; }`}</style>
      )}
      <div className="mx-auto max-w-page px-6 pt-10">
        <h1 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.02em] text-black">
          AI Development hero — animation concepts
        </h1>
        <p className="m-0 mt-2 text-[14px] text-body-muted">
          Three 9s-loop directions in the brand palette. Set the winner on the hero section&apos;s
          <span className="font-semibold text-black"> Hero animation</span> field.
          {frozen !== null && <> Frozen at t = {frozen}s.</>}
        </p>
      </div>

      {CONCEPTS.map((c) => (
        <section key={c.id} className="border-b border-line">
          <div className="mx-auto max-w-page px-6 py-8">
            <div className="mb-1 flex flex-wrap items-baseline gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-body-dim">{c.id}</span>
              <span className="font-display text-[17px] font-bold tracking-[-0.015em] text-black">{c.name}</span>
              <code className="rounded bg-surface-tint2 px-2 py-1 text-[11.5px] font-semibold text-body-soft">
                visual: {c.visual}
              </code>
            </div>
            <p className="m-0 mb-6 max-w-[70ch] text-[13.5px] leading-relaxed text-body-muted">{c.note}</p>

            {/* same grid as the real hero, so proportions match */}
            <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="text-[13px] font-semibold text-body-dim">Services / AI Development</div>
                <h2 className="m-0 mt-5 max-w-[17ch] font-display text-[clamp(29px,3.7vw,44px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-black">
                  AI Development
                </h2>
                <p className="m-0 mt-4 max-w-[54ch] text-[clamp(15px,1.3vw,17px)] leading-relaxed text-body-muted">
                  Building intelligence. From retrieval systems grounded in your own trusted knowledge to autonomous
                  agents that complete real work, we architect and ship production-grade AI your users actually adopt.
                </p>
              </div>
              <div className={`hidden lg:block ${frozen !== null ? 'frz' : ''}`}>{c.el}</div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
