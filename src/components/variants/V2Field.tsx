'use client';

import { STALLS, WORK } from '@/content/variants';
import { EngineerAsk, usePlanSession, VariantNav } from './planSession';

export function V2Field({ siteKey }: { siteKey: string }) {
  const session = usePlanSession(siteKey, 'homepage-v2');

  return (
    <div className="v2 bg-[#F4F1EA] text-black">
      <article className="mx-auto max-w-[1240px] px-6 pb-24 pt-[clamp(28px,5vw,64px)]">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em]">
          Field notes <span className="text-black/35">/ Next.js on Vercel</span>
        </p>
        <h1 className="v2-h1 m-0 mt-6 max-w-[16ch] font-display font-extrabold leading-[0.92] tracking-[-0.05em]">
          A build is not a product until someone else can run it.
        </h1>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="v2-essay order-2 lg:order-1">
            <p>
              Most of what arrives here started in a tool that was supposed to be the product. The preview works. The keys are in the browser. Marketing files a ticket to change a sentence.
            </p>
            <p>
              The agencies we already work with know the shape of this. They have brought us WordPress and Shopify for fifteen years, white-label, and stayed. Next.js on Vercel is that same partnership, on the stack their clients are asking for now.
            </p>
            <p>
              You don’t need a menu. You need the next four moves, written against the problem in front of you, and a person who is still here fifteen days after it ships.
            </p>
            <p className="v2-sign">
              Mavlers. Same week, most of the time.
            </p>
          </div>

          <aside id="prompt" className="v-prompt order-1 lg:sticky lg:top-[calc(var(--header-h)+20px)] lg:order-2">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">If this is the stall</p>
            <ul className="m-0 mt-4 list-none p-0">
              {STALLS.map((stall) => {
                const on = session.problem === stall.text;
                return (
                  <li key={stall.n} className="border-t border-black/10">
                    <button
                      type="button"
                      onClick={() => session.reveal(stall.text)}
                      className={`flex w-full items-baseline gap-4 py-3 text-left ${on ? 'text-black' : 'text-black/70 hover:text-black'}`}
                    >
                      <span className="w-8 font-display text-[12px] font-extrabold text-brand-ink">{stall.n}</span>
                      <span className={`text-[16px] font-semibold leading-snug ${on ? 'border-b-2 border-brand' : ''}`}>
                        {stall.short}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                session.reveal(session.draft);
              }}
            >
              <label htmlFor="v2-stall" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-black/45">
                Or say it in your words
              </label>
              <textarea
                id="v2-stall"
                rows={3}
                value={session.draft}
                onChange={(e) => session.setDraft(e.target.value)}
                placeholder="The preview works. Marketing still can’t touch a sentence."
                className="w-full resize-none border-0 border-b border-black/20 bg-transparent py-2 text-[16px] leading-snug placeholder:text-black/30 focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={session.phase === 'thinking'}
                className="mt-4 text-[14px] font-bold underline decoration-brand decoration-[3px] underline-offset-[6px] disabled:opacity-50"
              >
                {session.phase === 'thinking' ? 'Writing the plan…' : 'Write the plan →'}
              </button>
              {session.hint && (
                <p className="m-0 mt-2 text-[13px] font-semibold" role="status">
                  {session.hint}
                </p>
              )}
            </form>

            <div aria-live="polite">
              {session.phase === 'shown' && (
                <div className="v2-plan mt-8 border-t-2 border-black pt-6">
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-black/40">A proposed plan</p>
                  <p className="m-0 mt-3 text-[15px] italic leading-relaxed text-black/70">“{session.problem}”</p>
                  <h2 className="m-0 mt-4 font-display text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em]">
                    {session.plan.title}
                  </h2>
                  <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-black/65">{session.plan.lede}</p>
                  <ol className="m-0 mt-5 list-none space-y-4 p-0">
                    {session.plan.steps.map((step) => (
                      <li key={step.n}>
                        <h3 className="m-0 text-[15px] font-extrabold">
                          <span className="mr-2 text-brand-ink">{step.n}</span>
                          {step.title}
                        </h3>
                        <p className="m-0 mt-1 text-[14px] leading-relaxed text-black/60">{step.body}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="m-0 mt-5 text-[11px] font-bold uppercase tracking-[0.16em]">How Mavlers helps</p>
                  <p className="m-0 mt-2 text-[14.5px] leading-relaxed">{session.plan.help}</p>
                  <EngineerAsk session={session} tone="light" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      <section className="bg-brand text-black">
        <div className="mx-auto max-w-[1240px] px-6 py-[clamp(64px,10vw,120px)]">
          <p className="m-0 font-display text-[clamp(96px,18vw,220px)] font-extrabold leading-[0.8] tracking-[-0.07em]">60%</p>
          <p className="m-0 mt-4 max-w-[22ch] text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.03em]">
            of assessed vibe-coded apps leaked keys or credentials. We start there.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F1EA]">
        <div className="mx-auto max-w-[1240px] px-6 py-[clamp(64px,8vw,110px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="m-0 max-w-[14ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              What we actually take on.
            </h2>
            <p className="m-0 max-w-[32ch] text-[15px] leading-relaxed text-black/60">
              You bring the prototype, the repo, or the client relationship. We bring the production layer.
            </p>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-0 md:grid-cols-2">
            {WORK.map((item) => (
              <article key={item.n} className="group border-t border-black/15 py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="m-0 font-display text-[20px] font-extrabold tracking-[-0.03em]">{item.title}</h3>
                  <span className="font-display text-[12px] font-extrabold text-brand-ink">{item.n}</span>
                </div>
                <p className="m-0 mt-2 max-w-[46ch] text-[14.5px] leading-relaxed text-black/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#F4F1EA]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-6 pb-28 pt-[clamp(56px,8vw,96px)] md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-black/45">The person on the call</p>
            <p className="m-0 mt-3 font-display text-[clamp(28px,3vw,40px)] font-extrabold tracking-[-0.03em]">Krunal Bakraniya</p>
            <p className="m-0 mt-1 text-[14px] font-bold uppercase tracking-[0.14em] text-brand-ink">Expert AI Consultant</p>
            <p className="m-0 mt-4 max-w-[42ch] text-[16px] leading-relaxed text-black/70">
              Thirty minutes. Bring the repo or the dashboard. The plan you just read is what we start from.
            </p>
          </div>
          <a href="#prompt" className="rounded-full bg-black px-6 py-3.5 text-center text-[14.5px] font-bold text-white">
            Start from the stall
          </a>
        </div>
      </section>
      <VariantNav current="v2" />
    </div>
  );
}
