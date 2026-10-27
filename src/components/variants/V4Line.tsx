'use client';

import { ScrollScene } from '@/components/sections/ScrollScene';
import { LINE, STALLS, WORK } from '@/content/variants';
import { PackageBoard } from './PackageBoard';
import { EngineerAsk, usePlanSession, VariantNav } from './planSession';

const AUDIENCES = [
  {
    n: '01',
    title: 'An MVP that has to become a product',
    body: 'Founders and product teams with an AI idea, auth still missing, and a demo that cannot take a customer.',
    prompt: 'We need to launch the MVP',
  },
  {
    n: '02',
    title: 'A prototype that has hit the wall',
    body: 'The tool got you a preview. Security, structure, and integrations are the part it does not finish.',
    prompt: 'The prototype isn’t safe to launch',
  },
  {
    n: '03',
    title: 'A Next.js site marketing cannot run',
    body: 'The site is live. Every sentence is a ticket. The missing piece is an editor, roles, and a handover.',
    prompt: 'Marketing can’t edit the site',
  },
  {
    n: '04',
    title: 'A Vercel bill that keeps climbing',
    body: 'Usage is uncapped once the included credit is gone. The first conversation is why, not a rebuild.',
    prompt: 'The Vercel bill jumped',
  },
];

const SURFACE = [
  { name: 'AI SDK', body: 'Chat, agents, and the limits around them.' },
  { name: 'Firewall and Bot Protection', body: 'In front of the app before it is public.' },
  { name: 'Fluid compute and spend management', body: 'Where the spend actually comes from, and the ceiling on it.' },
  { name: 'ISR and Cache Components', body: 'Work that should not run on every visit.' },
  { name: 'Preview Deployments', body: 'A URL the team can click before DNS moves.' },
  { name: 'Speed Insights and Analytics', body: 'What the launch did to the page, measured.' },
  { name: 'Vercel storage', body: 'Postgres, Blob, Edge Config, Redis — named, not implied.' },
];

export function V4Line({ siteKey }: { siteKey: string }) {
  const session = usePlanSession(siteKey, 'homepage-v4');

  function ask(text: string) {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('prompt')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    session.reveal(text);
  }

  return (
    <div className="v4 bg-[#070708] text-white">
      <section id="prompt" className="v-prompt v4-hero relative -mt-[calc(var(--header-h)+12px)]">
        <div className="v4-hero-grid mx-auto grid min-h-[100svh] max-w-[1440px] lg:grid-cols-[minmax(340px,0.92fr)_1.08fr]">
          <div className="flex flex-col justify-center px-6 pb-10 pt-[calc(var(--header-h)+28px)] lg:px-10 lg:pb-16">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em] text-brand">Next.js on Vercel</p>
            <h1 className="m-0 mt-4 max-w-[12ch] font-display text-[clamp(40px,4.4vw,64px)] font-extrabold leading-[0.94] tracking-[-0.045em]">
              Tell us where it stalled.
            </h1>
            <p className="m-0 mt-4 max-w-[38ch] text-[16px] leading-relaxed text-white/65">
              A plan opens on the right. Four moves for the problem you named, then how a Mavlers engineer takes it from there.
            </p>

            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                session.reveal(session.draft);
              }}
            >
              <label htmlFor="v4-stall" className="mb-3 block text-[12px] font-bold uppercase tracking-[0.16em] text-brand">
                What’s in the way?
              </label>
              <div className="v4-shell">
                <div className="v4-composer rounded-[26px] bg-[#121212] p-4">
                  <textarea
                    id="v4-stall"
                    rows={6}
                    value={session.draft}
                    placeholder="The preview works. It isn’t safe to launch."
                    onChange={(e) => session.setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        session.reveal(session.draft);
                      }
                    }}
                    className="min-h-[168px] w-full resize-none bg-transparent text-[18px] leading-snug text-white placeholder:text-white/50 focus:outline-none"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={session.phase === 'thinking'}
                      className="rounded-full bg-brand px-6 py-3.5 text-[15.5px] font-bold text-black hover:bg-brand-300 disabled:opacity-60"
                    >
                      {session.phase === 'thinking' ? 'Drafting…' : 'Show me the plan'}
                    </button>
                    {session.hint && (
                      <p className="m-0 text-[13.5px] font-semibold text-brand" role="status">
                        {session.hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {STALLS.map((stall) => (
                <button
                  key={stall.n}
                  type="button"
                  onClick={() => session.reveal(stall.text)}
                  className={`rounded-full border px-3 py-1.5 text-left text-[12.5px] font-semibold ${
                    session.problem === stall.text
                      ? 'border-brand text-white'
                      : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {stall.short}
                </button>
              ))}
            </div>
          </div>

          <aside className="v4-art px-4 pb-8 lg:py-6 lg:pr-6 lg:pl-0" aria-live="polite">
            <div className="v4-doc">
              {session.phase === 'thinking' ? (
                <div className="p-7 lg:p-9" aria-busy="true">
                  <p className="v4-wait m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-black/40">Drafting</p>
                  <div className="mt-6 space-y-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-16 rounded-2xl bg-black/[0.05]" />
                    ))}
                  </div>
                </div>
              ) : session.phase === 'shown' ? (
                <div className="v4-plan">
                  <header className="flex items-center justify-between gap-3 border-b border-black/10 px-7 py-3.5 lg:px-9">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]">Proposed plan</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/40">{session.plan.label}</span>
                  </header>
                  <div className="px-7 py-6 lg:px-9">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">Facing</p>
                    <p className="m-0 mt-1.5 text-[16px] font-medium leading-snug">{session.problem}</p>
                    <h2 className="m-0 mt-5 font-display text-[clamp(24px,2.2vw,32px)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                      {session.plan.title}
                    </h2>
                    <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-black/60">{session.plan.lede}</p>
                    <ol className="m-0 mt-6 list-none space-y-4 p-0">
                      {session.plan.steps.map((step) => (
                        <li key={step.n} className="grid grid-cols-[2.2rem_1fr] gap-2 border-t border-black/10 pt-4">
                          <span className="font-display text-[13px] font-extrabold text-brand-ink">{step.n}</span>
                          <div>
                            <h3 className="m-0 font-display text-[16px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                            <p className="m-0 mt-1 text-[14px] leading-relaxed text-black/60">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <footer className="border-t border-black/10 bg-[#efeee8] px-7 py-5 lg:px-9">
                    <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-black/50">{session.plan.helpTitle}</p>
                    <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-black/75">{session.plan.help}</p>
                    <EngineerAsk session={session} tone="light" />
                  </footer>
                </div>
              ) : (
                <div className="px-7 py-8 lg:px-9 lg:py-10">
                  <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.16em] text-black/40">Proposed plan</p>
                  <h2 className="m-0 mt-4 max-w-[16ch] font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                    The plan opens in this frame.
                  </h2>
                  <p className="m-0 mt-3 max-w-[42ch] text-[15px] leading-relaxed text-black/55">
                    Name the stall. You get the moves, then a way to hand them to an engineer. Most of those conversations are the same week.
                  </p>
                  <ol className="m-0 mt-8 list-none space-y-3 p-0">
                    {['The problem, in your words', 'Four moves, written as a plan', 'How Mavlers takes it from there', 'A time, if you want one'].map((line, i) => (
                      <li key={line} className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white/60 px-4 py-3">
                        <span className="font-display text-[12px] font-extrabold text-brand-ink">0{i + 1}</span>
                        <span className="text-[14.5px] font-semibold">{line}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black">
        <ScrollScene className="v4-who" mode="pin">
          <div className="v4-who-view mx-auto max-w-[1440px] px-6 py-[clamp(56px,8vw,88px)] lg:px-10">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-brand">Who it’s for</p>
            <h2 className="m-0 mt-3 max-w-[18ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              Four stalls. Same production gap.
            </h2>
            <div className="v4-who-scroller mt-10">
              <div className="v4-who-track">
                {AUDIENCES.map((item) => (
                  <button
                    key={item.n}
                    type="button"
                    onClick={() => ask(item.prompt)}
                    className="v4-who-card group text-left"
                  >
                    <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-brand">{item.n}</span>
                    <span className="mt-6 block font-display text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em]">{item.title}</span>
                    <span className="mt-4 block text-[15px] leading-relaxed text-white/60">{item.body}</span>
                    <span className="mt-8 block text-[13px] font-bold text-brand">See a plan →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollScene>
      </section>

      <section className="bg-[#070708]">
        <ScrollScene className="v4-gap" mode="pin">
          <div className="v4-gap-view mx-auto flex max-w-[1440px] flex-col justify-center px-6 lg:px-10">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-brand">The production gap</p>
            <div className="v4-gap-stage relative mt-4">
              <div className="v4-beat v4-beat-a">
                <p className="hm m-0 font-display text-[clamp(96px,16vw,200px)] font-extrabold leading-[0.82] tracking-[-0.06em]">60%</p>
                <p className="m-0 mt-4 max-w-[20ch] text-[clamp(22px,2.6vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em]">
                  of assessed vibe-coded apps leaked keys or credentials.
                </p>
              </div>
              <div className="v4-beat v4-beat-b">
                <p className="m-0 font-display text-[clamp(72px,10vw,132px)] font-extrabold leading-[0.88] tracking-[-0.05em]">
                  170 <span className="text-white/35">of</span> 1,645
                </p>
                <p className="m-0 mt-4 max-w-[26ch] text-[clamp(20px,2.2vw,30px)] font-semibold leading-[1.2] tracking-[-0.03em] text-white/85">
                  Vibe-coded apps, in a May 2025 study, exposed personal data.
                </p>
              </div>
            </div>
            <p className="m-0 mt-8 max-w-[62ch] text-[16px] leading-relaxed text-white/60">
              The category is already huge, and most of these projects are built by people who are not engineers. Maintenance, security, and integrations are the harder problem. That gap is the offer.
            </p>
          </div>
        </ScrollScene>
      </section>

      <PackageBoard tone="line" onAsk={ask} />

      <section className="border-t border-white/10 bg-white text-black">
        <div className="mx-auto max-w-[1440px] px-6 py-[clamp(64px,8vw,104px)] lg:px-10">
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em]">Two ways in</p>
          <h2 className="m-0 mt-3 max-w-[16ch] font-display text-[clamp(32px,4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Start with the site you already have.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <button type="button" onClick={() => ask('Marketing can’t edit the Next.js site. We need a CMS they can run.')} className="v4-door text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-ink">Lead · CMS</span>
              <span className="mt-4 block font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                A CMS your team can actually use.
              </span>
              <span className="mt-4 block max-w-[42ch] text-[15.5px] leading-relaxed text-black/65">
                Payload by default, Sanity when you want a hosted studio. Draft previews, scheduled publishing, roles, and a handover marketing can run without filing a ticket.
              </span>
              <span className="mt-8 block text-[14px] font-bold">Describe this stall →</span>
            </button>
            <button type="button" onClick={() => ask('The Vercel bill jumped and we need to know why.')} className="v4-door v4-door-dark text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Lead · Cost</span>
              <span className="mt-4 block font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                Read the bill before you change the site.
              </span>
              <span className="mt-4 block max-w-[42ch] text-[15.5px] leading-relaxed text-white/70">
                A line-by-line look at usage, what is still rendering on every request, what can be cached, and the limits that stop the next jump from being a surprise.
              </span>
              <span className="mt-8 block text-[14px] font-bold text-brand">Describe this stall →</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#F4F1EA] text-black">
        <ScrollScene className="v4-line" mode="pin">
          <div className="v4-line-view mx-auto max-w-[1440px] px-6 py-[clamp(56px,7vw,88px)] lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em]">The line</p>
                <h2 className="m-0 mt-3 max-w-[16ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                  From a preview to something your team can run.
                </h2>
              </div>
              <p className="m-0 max-w-[36ch] text-[15px] leading-relaxed text-black/60">{LINE.subhead}</p>
            </div>
            <div className="v4-line-scroller mt-10">
              <div className="v4-line-track">
                {WORK.map((item) => (
                  <button key={item.n} type="button" onClick={() => ask(item.prompt)} className="v4-line-card cursor-pointer text-left text-black">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[12px] font-extrabold tracking-[0.14em] text-brand-ink">{item.n}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${item.lead ? 'bg-brand text-black' : 'bg-black/5 text-black/55'}`}>
                        {item.mark}
                      </span>
                    </span>
                    <span className="mt-5 block font-display text-[26px] font-extrabold leading-tight tracking-[-0.03em]">{item.title}</span>
                    <span className="mt-3 block text-[14.5px] leading-relaxed text-black/65">{item.body}</span>
                    <span className="m-0 mt-5 list-none space-y-2 p-0">
                      {item.points.map((point) => (
                        <span key={point} className="block border-t border-black/10 pt-2 text-[13.5px] font-semibold leading-snug">
                          {point}
                        </span>
                      ))}
                    </span>
                    <span className="mt-auto pt-6 text-[13px] font-bold">Describe this stall →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollScene>
      </section>

      <section className="bg-black">
        <ScrollScene className="v4-spec" mode="enter">
          <div className="mx-auto max-w-[1440px] px-6 py-[clamp(64px,8vw,110px)] lg:px-10">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-brand">What we name</p>
            <h2 className="m-0 mt-3 max-w-[18ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              The Vercel surface, said out loud.
            </h2>
            <p className="m-0 mt-4 max-w-[54ch] text-[16px] leading-relaxed text-white/60">
              Not a platform tour. These are the pieces a production build actually touches.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SURFACE.map((item, i) => (
                <article key={item.name} className="v4-spec-card rounded-2xl border border-white/10 p-5" style={{ '--i': i } as React.CSSProperties}>
                  <h3 className="m-0 font-display text-[18px] font-extrabold tracking-[-0.02em]">{item.name}</h3>
                  <p className="m-0 mt-2 text-[14px] leading-relaxed text-white/60">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </ScrollScene>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-[clamp(64px,8vw,110px)] lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em]">Why this line</p>
            <h2 className="m-0 mt-3 font-display text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              A focused practice, not a general Next.js shop.
            </h2>
          </div>
          <div className="space-y-6 text-[16.5px] leading-relaxed text-black/75">
            <p className="m-0">
              The top of this market belongs to enterprise integrators. The mid-market, and the agencies who already send us WordPress and Shopify, are not who those firms are built for.
            </p>
            <p className="m-0">
              We deliver white-label, on a fixed scope, and we stay fifteen business days after every build. The same partnership, on the stack their clients are now asking for.
            </p>
            <p className="m-0">
              Rescue is the way into the rest of the line. A hardened prototype becomes platform ops, and platform ops is how a team stops starting over every weekend.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand text-black">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-[clamp(56px,8vw,96px)] lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em]">Same week, most of the time</p>
            <h2 className="m-0 mt-3 max-w-[14ch] font-display text-[clamp(36px,5vw,64px)] font-extrabold leading-[0.95] tracking-[-0.045em]">
              Name the stall. Keep the plan.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#prompt" className="rounded-full bg-black px-5 py-3.5 text-[14.5px] font-bold text-white">
              Show me the plan
            </a>
            <a href="/book-a-call" className="rounded-full border border-black/30 px-5 py-3.5 text-[14.5px] font-bold">
              Talk to an engineer
            </a>
          </div>
        </div>
      </section>
      <VariantNav current="v4" />
    </div>
  );
}
