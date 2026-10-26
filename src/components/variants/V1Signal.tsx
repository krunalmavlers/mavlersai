'use client';

import { ScrollScene } from '@/components/sections/ScrollScene';
import { PROOF, STALLS, WORK } from '@/content/variants';
import { EngineerAsk, usePlanSession, VariantNav } from './planSession';

export function V1Signal({ siteKey }: { siteKey: string }) {
  const session = usePlanSession(siteKey, 'homepage-v1');
  const open = session.phase !== 'idle';

  return (
    <div className="v1 bg-ink-900 text-white">
      <section className="v1-hero relative -mt-[calc(var(--header-h)+12px)]">
        <div aria-hidden className="v1-glow pointer-events-none absolute left-[-10%] top-[20%] h-[520px] w-[520px] rounded-full" />
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-20 pt-[calc(var(--header-h)+12px+clamp(36px,6vw,88px))] lg:grid-cols-[148px_1fr] lg:gap-8 lg:px-10">
          <nav aria-label="Stalls" className="v1-index flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {STALLS.map((stall) => {
              const on = session.problem === stall.text;
              return (
                <button
                  key={stall.n}
                  type="button"
                  onClick={() => session.reveal(stall.text)}
                  className={`v1-index-item flex shrink-0 items-center gap-3 whitespace-nowrap text-left lg:whitespace-normal ${on ? 'is-on' : ''}`}
                >
                  <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-brand">{stall.n}</span>
                  <span className="text-[13.5px] font-semibold leading-snug text-white/80">{stall.short}</span>
                </button>
              );
            })}
          </nav>

          <div>
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.22em] text-brand">Signal 01 — Next.js on Vercel</p>
            <h1 className={`v1-h1 m-0 mt-4 max-w-[12ch] font-display font-extrabold leading-[0.9] tracking-[-0.05em] ${open ? 'is-open' : ''}`}>
              Name the stall.
              <span className="mt-1 block text-brand">We draw the way through it.</span>
            </h1>
            <p className="m-0 mt-6 max-w-[42ch] text-[16px] leading-relaxed text-white/65">
              A plan for the problem you actually have. Then a Mavlers engineer, usually the same week — the same partnership agencies have used for fifteen years.
            </p>

            <form
              id="prompt"
              className="v-prompt mt-8 max-w-[720px]"
              onSubmit={(e) => {
                e.preventDefault();
                session.reveal(session.draft);
              }}
            >
              <label htmlFor="v1-stall" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                What’s in the way?
              </label>
              <div className="flex flex-col gap-3 border-b border-white/20 pb-3 focus-within:border-brand sm:flex-row sm:items-end">
                <textarea
                  id="v1-stall"
                  rows={2}
                  value={session.draft}
                  placeholder="Built it in Lovable. The preview works. It isn’t safe to launch."
                  onChange={(e) => session.setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      session.reveal(session.draft);
                    }
                  }}
                  className="min-h-[64px] w-full flex-1 resize-none bg-transparent text-[18px] leading-snug text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={session.phase === 'thinking'}
                  className="rounded-full bg-brand px-5 py-3 text-[14px] font-bold text-black hover:bg-brand-300 disabled:opacity-60"
                >
                  {session.phase === 'thinking' ? 'Drawing…' : 'Draw the plan'}
                </button>
              </div>
              {session.hint && (
                <p className="m-0 mt-3 text-[13.5px] font-semibold text-brand" role="status">
                  {session.hint}
                </p>
              )}
            </form>

            <div aria-live="polite" className="mt-10 max-w-[820px]">
              {session.phase === 'thinking' && (
                <p className="v1-wait m-0 text-[13px] font-bold uppercase tracking-[0.18em] text-white/50">Drawing four moves…</p>
              )}
              {session.phase === 'shown' && (
                <article className="v1-plan">
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Facing</p>
                  <p className="m-0 mt-2 text-[18px] font-medium leading-snug text-white/90">{session.problem}</p>
                  <h2 className="m-0 mt-6 font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                    {session.plan.title}
                  </h2>
                  <p className="m-0 mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-white/60">{session.plan.lede}</p>
                  <ol className="m-0 mt-8 list-none space-y-6 p-0">
                    {session.plan.steps.map((step) => (
                      <li key={step.n} className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/10 pt-5">
                        <span className="v1-num font-display font-extrabold leading-none">{step.n}</span>
                        <div>
                          <h3 className="m-0 font-display text-[18px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                          <p className="m-0 mt-1.5 max-w-[52ch] text-[14.5px] leading-relaxed text-white/60">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-8 border-t border-white/10 pt-5">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">{session.plan.helpTitle}</p>
                    <p className="m-0 mt-2 max-w-[52ch] text-[15px] leading-relaxed text-white/75">{session.plan.help}</p>
                    <EngineerAsk session={session} tone="dark" />
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 py-4">
        <div className="v1-marquee flex w-max gap-10">
          {[0, 1].map((copy) => (
            <p key={copy} className="m-0 flex gap-10 text-[13px] font-bold uppercase tracking-[0.18em] text-white/70">
              {PROOF.map((item) => (
                <span key={item.label} className="flex items-center gap-10">
                  <span>
                    <span className="text-brand">{item.num}</span> {item.label}
                  </span>
                  <span aria-hidden className="text-white/25">
                    /
                  </span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section className="bg-black">
        <ScrollScene className="v1-gap" mode="enter">
          <div className="mx-auto max-w-[1440px] px-6 py-[clamp(72px,12vw,140px)] lg:px-10">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em] text-brand">The production gap</p>
            <p className="v1-figure m-0 mt-3 font-display text-[clamp(120px,22vw,280px)] font-extrabold leading-[0.8] tracking-[-0.07em] text-brand">
              60%
            </p>
            <p className="m-0 mt-4 max-w-[18ch] text-[clamp(26px,3vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em]">
              of assessed vibe-coded apps leaked keys or credentials.
            </p>
            <p className="m-0 mt-5 max-w-[42ch] text-[16px] leading-relaxed text-white/60">
              That gap is the work. We close it, then stay the fifteen days after the thing is actually live.
            </p>
          </div>
        </ScrollScene>
      </section>

      <section className="bg-ink-900">
        <div className="mx-auto max-w-[1440px] px-6 py-[clamp(64px,8vw,110px)] lg:px-10">
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em] text-brand">The work</p>
          <h2 className="m-0 mt-4 max-w-[16ch] font-display text-[clamp(32px,4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Six ways a preview becomes something a team can run.
          </h2>
          <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {WORK.map((item) => (
              <article key={item.n} className="v1-cell bg-ink-900 p-7">
                <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-brand">{item.n}</span>
                <h3 className="m-0 mt-5 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em]">{item.title}</h3>
                <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-white/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand text-black">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 pb-28 pt-[clamp(56px,8vw,96px)] lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <h2 className="m-0 max-w-[14ch] font-display text-[clamp(36px,5vw,68px)] font-extrabold leading-[0.95] tracking-[-0.045em]">
            Tell us where it stalled.
          </h2>
          <div className="flex flex-wrap gap-3 pb-1">
            <a href="#prompt" className="rounded-full bg-black px-5 py-3 text-[14.5px] font-bold text-white">
              Draw the plan
            </a>
            <a href="/book-a-call" className="rounded-full border border-black/30 px-5 py-3 text-[14.5px] font-bold">
              Talk to an engineer
            </a>
          </div>
        </div>
      </section>
      <VariantNav current="v1" />
    </div>
  );
}
