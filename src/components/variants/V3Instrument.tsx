'use client';

import { LINE, STALLS, SURFACE, WORK } from '@/content/variants';
import { PackageBoard } from './PackageBoard';
import { EngineerAsk, usePlanSession, VariantNav } from './planSession';

const TRACE = [
  { n: '01', line: 'Read the words against a plan we already know how to run.' },
  { n: '02', line: 'Secrets off the client, an editor in, or the domain last — whichever the plan named.' },
  { n: '03', line: 'A security pass before anyone calls it launched.' },
  { n: '04', line: 'A handover a new hire can follow without the Slack thread.' },
  { n: '05', line: 'Fifteen days beside the team after it is actually live.' },
  { n: '06', line: 'An engineer picks the thread up the same week.' },
];

export function V3Instrument({ siteKey }: { siteKey: string }) {
  const session = usePlanSession(siteKey, 'homepage-v3');
  const live = session.phase === 'shown';

  function ask(text: string) {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('prompt')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    session.reveal(text);
  }

  return (
    <div className="v3 bg-[#070707] text-white">
      <section className="v3-frame relative -mt-[calc(var(--header-h)+12px)]">
        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+18px)] z-10 flex justify-between px-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 lg:px-7">
          <span>Mavlers.ai / Next.js / Vercel</span>
          <span>{live ? 'Session — plan ready' : session.phase === 'thinking' ? 'Session — drawing' : 'Session — unsent'}</span>
        </div>
        <span aria-hidden className="v3-tick v3-tick-tl" />
        <span aria-hidden className="v3-tick v3-tick-tr" />
        <span aria-hidden className="v3-tick v3-tick-bl" />
        <span aria-hidden className="v3-tick v3-tick-br" />

        <div className="grid min-h-[100svh] lg:grid-cols-[minmax(320px,0.86fr)_1.14fr]">
          <div className="flex flex-col justify-end px-6 pb-10 pt-[calc(var(--header-h)+64px)] lg:px-10 lg:pb-14">
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Instrument</p>
            <h1 className="m-0 mt-4 max-w-[11ch] font-display text-[clamp(40px,4.6vw,68px)] font-extrabold leading-[0.92] tracking-[-0.045em]">
              Describe the break.
            </h1>
            <p className="m-0 mt-4 max-w-[36ch] text-[15.5px] leading-relaxed text-white/60">
              The plan draws beside this brief. Four moves, then a person who will take them the rest of the way.
            </p>

            <form
              id="prompt"
              className="v-prompt mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                session.reveal(session.draft);
              }}
            >
              <label htmlFor="v3-stall" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Input — the stall
              </label>
              <textarea
                id="v3-stall"
                rows={3}
                value={session.draft}
                onChange={(e) => session.setDraft(e.target.value)}
                placeholder="The prototype isn’t safe to launch."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    session.reveal(session.draft);
                  }
                }}
                className="w-full resize-none border border-white/15 bg-white/[0.03] px-4 py-3 font-display text-[16px] leading-snug text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={session.phase === 'thinking'}
                  className="rounded-full bg-brand px-5 py-2.5 text-[13.5px] font-bold text-black hover:bg-brand-300 disabled:opacity-60"
                >
                  {session.phase === 'thinking' ? 'Drawing…' : 'Draw'}
                </button>
                {session.hint && (
                  <p className="m-0 text-[13px] font-semibold text-brand" role="status">
                    {session.hint}
                  </p>
                )}
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {STALLS.map((stall) => (
                <button
                  key={stall.n}
                  type="button"
                  onClick={() => session.reveal(stall.text)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] ${
                    session.problem === stall.text
                      ? 'border-brand text-brand'
                      : 'border-white/15 text-white/65 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {stall.n} {stall.short}
                </button>
              ))}
            </div>
          </div>

          <div className={`v3-canvas relative min-h-[320px] text-black lg:min-h-full ${live || session.phase === 'thinking' ? 'is-live' : ''}`} aria-live="polite">
            {session.phase === 'idle' && (
              <div className="flex h-full min-h-[320px] flex-col justify-end p-8 lg:min-h-[100svh] lg:p-12">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">Canvas</p>
                <p className="m-0 mt-3 max-w-[16ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                  The plan draws here.
                </p>
                <p className="m-0 mt-3 max-w-[32ch] text-[15px] leading-relaxed text-black/55">Four moves. Then how we help.</p>
              </div>
            )}

            {session.phase === 'thinking' && (
              <div className="flex h-full min-h-[320px] flex-col justify-center gap-4 p-10 lg:min-h-[100svh]">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="v3-bar h-16 rounded-2xl bg-black/[0.05]" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            )}

            {live && (
              <div className="relative p-8 lg:p-12">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">{session.plan.label}</p>
                  <p className="m-0 text-[12px] font-semibold text-black/40">Draft</p>
                </div>
                <h2 className="m-0 mt-4 max-w-[18ch] font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                  {session.plan.title}
                </h2>
                <p className="m-0 mt-3 max-w-[48ch] text-[14.5px] leading-relaxed text-black/60">
                  <span className="font-semibold text-black/80">Facing: </span>
                  {session.problem}
                </p>
                <div className="relative mt-8">
                  <span aria-hidden className="v3-spine" />
                  <ol className="m-0 list-none space-y-5 p-0">
                    {session.plan.steps.map((step, i) => (
                      <li key={step.n} className="v3-node relative grid grid-cols-[28px_1fr] gap-4" style={{ animationDelay: `${120 + i * 110}ms` }}>
                        <span className="relative z-[1] mt-1 h-3 w-3 rounded-full bg-brand ring-4 ring-[#F7F6F2]" />
                          <div className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm">
                          <p className="m-0 font-mono text-[11px] font-bold text-brand-ink">{step.n}</p>
                          <h3 className="m-0 mt-1 font-display text-[16.5px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                          <p className="m-0 mt-1 text-[14px] leading-relaxed text-black/60">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="v3-node ml-11 mt-6 max-w-[460px]" style={{ animationDelay: '620ms' }}>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-black/45">{session.plan.helpTitle}</p>
                  <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-black/75">{session.plan.help}</p>
                  <EngineerAsk session={session} tone="light" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-[clamp(64px,8vw,100px)] lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Trace</p>
            <h2 className="m-0 mt-4 font-display text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              What happens after the drawing.
            </h2>
          </div>
          <ol className="m-0 list-none p-0">
            {TRACE.map((row) => (
              <li key={row.n} className="grid grid-cols-[48px_1fr] gap-4 border-t border-white/10 py-4">
                <span className="font-mono text-[12px] text-brand">{row.n}</span>
                <p className="m-0 text-[16px] leading-snug text-white/80">{row.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PackageBoard tone="instrument" onAsk={ask} />

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-[clamp(64px,8vw,100px)] lg:px-10">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">The line</p>
          <h2 className="m-0 mt-4 max-w-[16ch] font-display text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Six services. Two of them open the door.
          </h2>
          <p className="m-0 mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-white/60">{LINE.subhead}</p>
          <ol className="m-0 mt-10 list-none p-0">
            {WORK.map((item) => (
              <li key={item.n} className="border-t border-white/10">
                <button type="button" onClick={() => ask(item.prompt)} className="grid w-full cursor-pointer grid-cols-[48px_minmax(0,1fr)] gap-4 py-5 text-left text-white">
                  <span className="font-mono text-[12px] text-brand">{item.n}</span>
                  <span className="min-w-0">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-[18px] font-extrabold tracking-[-0.02em]">{item.title}</span>
                      <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${item.lead ? 'text-brand' : 'text-white/40'}`}>{item.mark}</span>
                    </span>
                    <span className="mt-2 block max-w-[62ch] text-[14.5px] leading-relaxed text-white/60">{item.body}</span>
                    <span className="mt-3 block text-[13px] font-bold text-brand">Open a plan →</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="m-0 mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Named on the build</p>
          <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
            {SURFACE.map((name) => (
              <li key={name} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-white/70">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 pb-28 pt-[clamp(64px,8vw,100px)] md:grid-cols-2 lg:px-10">
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">You have</p>
            <ul className="m-0 mt-5 list-none space-y-3 p-0 text-[18px] font-medium leading-snug text-white/55">
              <li>A preview that works</li>
              <li>A file nobody else can own</li>
              <li>A bill, or a backlog, you can’t explain</li>
              <li>A marketer waiting on a ticket</li>
            </ul>
          </div>
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">What ships</p>
            <ul className="m-0 mt-5 list-none space-y-3 p-0 text-[18px] font-semibold leading-snug">
              <li>Routes and a server boundary</li>
              <li>An editor the team can run</li>
              <li>A domain, secrets, and a way back</li>
              <li>Fifteen days after launch, still here</li>
            </ul>
            <a href="#prompt" className="mt-8 inline-flex rounded-full bg-brand px-5 py-3 text-[14px] font-bold text-black">
              Draw it from your stall
            </a>
          </div>
        </div>
      </section>
      <VariantNav current="v3" />
    </div>
  );
}
