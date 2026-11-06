import Link from 'next/link';
import { Code2, Compass, LifeBuoy, ListChecks, PenLine, Rocket, Server } from 'lucide-react';
import { LightWash } from './LightWash';
import {
  AUDIENCE,
  BOOK_URL,
  FAQS,
  INCLUDED,
  PRICE_CHECKS,
  PROCESS,
  SCOPE_ADD,
  SCOPE_IN,
  STACK,
  WORK,
} from '@/content/mvpHome';

const ICONS = [Compass, ListChecks, PenLine, Code2, Rocket, LifeBuoy, Server];

function Book({ children = 'Book a free call', dark = false }: { children?: string; dark?: boolean }) {
  return (
    <a
      href={BOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[14.5px] font-bold transition-colors ${
        dark ? 'bg-black text-white hover:bg-ink-900' : 'bg-brand text-black hover:bg-brand-300'
      }`}
    >
      {children}
    </a>
  );
}

function ProductMock() {
  return (
    <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
      <div className="overflow-hidden rounded-[20px] bg-ink-900 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
        <div className="flex items-center gap-1.5 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="ml-2 text-[11px] font-semibold text-white/35">app.yourproduct.com</span>
        </div>
        <div className="relative h-[210px] sm:h-[232px]">
          <div className="mvp-beat flex h-full flex-col justify-center px-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Idea</p>
            <p className="mt-2 max-w-[14ch] text-[26px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
              A booking tool for field teams.
            </p>
          </div>
          <div className="mvp-beat flex h-full flex-col justify-center gap-2.5 px-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Sketch</p>
            <div className="mt-1 h-2.5 w-2/5 rounded-full bg-white/15" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 rounded-lg border border-dashed border-white/25" />
              <div className="h-12 rounded-lg border border-dashed border-white/25" />
              <div className="h-12 rounded-lg border border-dashed border-brand/80" />
            </div>
            <div className="h-14 rounded-lg border border-dashed border-white/20" />
          </div>
          <div className="mvp-beat flex h-full flex-col px-4 pb-4 pt-3">
            <div className="flex items-center justify-between pr-[108px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Live</p>
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-black">This week</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 pr-[108px]">
              {['128', '36', '4.9'].map((n, i) => (
                <div key={n} className="rounded-lg bg-white/10 px-2.5 py-2">
                  <div className="text-[16px] font-extrabold leading-none text-white">{n}</div>
                  <div className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-white/40">
                    {['Signups', 'Jobs', 'Score'][i]}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-1 items-end gap-1.5 pr-[108px]">
              {[40, 62, 48, 80, 70, 96, 74].map((h, i) => (
                <span key={i} className={`flex-1 rounded-t ${i === 5 ? 'bg-brand' : 'bg-white/20'}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mvp-phone absolute bottom-3 right-3 w-[104px] overflow-hidden rounded-[18px] bg-black shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-white/20" />
        <div className="p-2.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">Today</p>
          <p className="mt-0.5 text-[12px] font-extrabold leading-tight text-white">3 jobs booked</p>
          <div className="mt-2 space-y-1">
            {['North route', 'Depot check', 'Invoice'].map((row, i) => (
              <div key={row} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-brand' : 'bg-white/30'}`} />
                <span className="text-[9px] font-semibold text-white/75">{row}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const frame = 'mx-auto max-w-page px-6';

export function MvpHome({ email }: { email?: string }) {
  return (
    <div className="mvp-home bg-white text-black">
      <section id="hero" className="relative flex flex-col overflow-hidden lg:min-h-[calc(100svh-7rem)]">
        <LightWash />
        <div className={`${frame} relative grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-10`}>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-ink">MVP development · 6 weeks</p>
            <h1 className="mt-3 max-w-[12em] text-[clamp(36px,4.4vw,60px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
              Your app, live in 6 weeks. Starts from <span className="hm">$4,999.</span>
            </h1>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-body-muted">
              Strategy, design, development, launch and a full year of hosting, all run by a dedicated PM who gets your idea from day one.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Book />
              <a
                href="#included"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-[14.5px] font-bold text-black transition-colors hover:border-black/30"
              >
                See what&apos;s included
              </a>
            </div>
            <ul className="mt-5 flex flex-col gap-1.5 text-[14px] font-semibold sm:flex-row sm:flex-wrap sm:gap-x-5">
              {['Starts from $4,999 · 6 weeks', '12 months of hosting included', 'You own the code'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ProductMock />
        </div>
        <div id="trust" className="scroll-mt-[var(--header-h)] border-t border-black/10 bg-[#F6F5F1]">
          <div className={`${frame} flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8`}>
          <p className="text-[13.5px] font-semibold text-body-soft">
            Built by Mavlers, part of Uplers. Trusted by agencies and brands worldwide.
          </p>
          <p className="shrink-0 text-[13px] font-bold tracking-[-0.01em]">{STACK.join('  ·  ')}</p>
          </div>
        </div>
      </section>

      <section id="problem">
        <div className={`${frame} py-16 lg:py-[4.5rem]`}>
          <h2 className="mx-auto max-w-[16em] text-center text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Building an app shouldn&apos;t mean managing five vendors.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12 lg:gap-5">
            {(
              [
                ['Freelancers disappear.', "One person can't cover strategy, design, code and hosting, and you end up as the project manager."],
                ['Agencies quote $20K+.', "Long contracts and slow timelines before you've even tested the idea."],
                ['AI-built prototypes stall.', 'Tools like Lovable or Bolt get you a demo, but not secure logins, real data or a launch you can trust.'],
              ] as const
            ).map(([title, body], i) => (
              <article
                key={title}
                className={`flex min-h-[220px] flex-col rounded-[28px] p-7 lg:p-8 ${
                  i === 2 ? 'bg-black text-white' : 'bg-[#F6F5F1]'
                }`}
              >
                <span className={`text-[13px] font-extrabold tracking-[0.16em] ${i === 2 ? 'text-brand' : 'text-brand-ink'}`}>
                  0{i + 1}
                </span>
                <h3 className="mt-8 text-[22px] font-extrabold leading-snug tracking-[-0.03em]">{title}</h3>
                <p className={`mt-3 text-[15px] leading-relaxed ${i === 2 ? 'text-white/70' : 'text-body-muted'}`}>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offer" className="bg-[#F6F5F1]">
        <div className={`${frame} flex flex-col gap-10 py-16 lg:flex-row lg:items-stretch lg:gap-0 lg:py-20`}>
          <div className="flex flex-col justify-between lg:w-[44%] lg:pr-14">
            <h2 className="max-w-[10em] text-[clamp(36px,4vw,58px)] font-extrabold leading-[0.98] tracking-[-0.035em]">
              One team. Starts from $4,999. Live in 6 weeks.
            </h2>
            <div className="mt-8">
              <Book />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between lg:border-l lg:border-black/10 lg:pl-14">
            <p className="text-[17px] leading-relaxed text-body-muted">
              Mavlers MVP Launch takes your idea from first call to a working product your users can sign up for, in about 6 weeks, starting from $4,999. A dedicated PM researches your market, plans the build with you and keeps everything on track. You get weekly preview links, so you always see where things stand.
            </p>
            <ul className="mt-8 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-3">
              {['Starts from $4,999', '6 weeks', 'Weekly preview links'].map((item) => (
                <li key={item} className={`text-[17px] font-extrabold tracking-[-0.03em] ${item.includes('$') ? 'hm' : ''}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="included">
        <div className={`${frame} py-12 lg:py-14`}>
          <h2 className="mx-auto max-w-[14em] text-center text-[clamp(32px,3.6vw,52px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Everything you need, from idea to launch.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-12 lg:gap-4">
            {INCLUDED.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <article
                  key={item.title}
                  className={`rounded-[22px] bg-[#F6F5F1] p-5 ${i < 3 ? 'lg:col-span-4' : 'lg:col-span-3'}`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-black">
                    <Icon size={16} strokeWidth={2.2} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[16px] font-extrabold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-snug text-body-muted">{item.body}</p>
                </article>
              );
            })}
          </div>
          <p className="mx-auto mt-4 max-w-[44rem] rounded-[22px] bg-black px-8 py-5 text-center text-[16px] font-semibold leading-relaxed text-white">
            Plus a dedicated project manager who understands your goals and is your single point of contact from start to finish.
          </p>
        </div>
      </section>

      <section id="process" className="bg-[#F6F5F1]">
        <div className={`${frame} py-14 lg:py-16`}>
          <h2 className="max-w-[14em] text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            From first call to live product in 6 weeks.
          </h2>
          <ol className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, i) => (
              <li key={step.when} className="border-t-[3px] border-brand pt-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-ink">
                  0{i + 1}
                  <span className="ml-2 text-black">{step.when}</span>
                </p>
                <h3 className="mt-3 text-[16px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-1.5 text-[14px] leading-snug text-body-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="for">
        <div className={`${frame} py-14 lg:py-16`}>
          <h2 className="mx-auto max-w-[14em] text-center text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Built for people with an idea and a deadline.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map((item, i) => (
              <article
                key={item.title}
                className={`rounded-[24px] p-6 ${i === AUDIENCE.length - 1 ? 'bg-black text-white' : 'bg-[#F6F5F1]'}`}
              >
                <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">{item.title}</h3>
                <p className={`mt-2 text-[14.5px] leading-relaxed ${i === AUDIENCE.length - 1 ? 'text-white/70' : 'text-body-muted'}`}>
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-black text-white">
        <div className={`${frame} flex flex-col-reverse gap-10 py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:py-16`}>
          <ul className="grid flex-1 content-start gap-2.5 sm:grid-cols-2 sm:gap-x-8">
            {PRICE_CHECKS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 border-t border-white/15 py-3 text-[15px] leading-snug">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
          <div className="lg:w-[380px] lg:text-right">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand">MVP Launch</p>
            <h2 className="mt-2 text-[clamp(32px,3.4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
              Starts from
            </h2>
            <p className="hm mt-3 text-[clamp(56px,6vw,76px)] font-extrabold leading-none tracking-[-0.045em]">$4,999</p>
            <p className="mt-2 text-[15px] font-semibold text-white">6 weeks</p>
            <p className="text-[15px] font-semibold">Includes 12 months of hosting</p>
            <div className="mt-6 lg:flex lg:justify-end">
              <Book />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/45 lg:ml-auto lg:max-w-[32ch]">
              Paid in milestones. Domain, AI model usage and payment gateway fees are billed by those providers.
            </p>
          </div>
        </div>
        <div className={`${frame} pb-12 lg:pb-14`}>
          <p className="border-t border-white/15 pt-5 text-[15px] text-white/75 lg:text-right">
            Need something bigger? We&apos;ll scope it and give you a clear quote.{' '}
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-white underline decoration-brand decoration-2 underline-offset-4">
              Talk to us
            </a>
          </p>
        </div>
      </section>

      <section id="scope" className="border-t border-white/15 bg-black text-white">
        <div className={`${frame} flex flex-col gap-8 py-12 lg:flex-row lg:items-start lg:gap-16 lg:py-14`}>
          <h2 className="text-[clamp(32px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white lg:w-[30%] lg:shrink-0">
            What fits in an MVP.
          </h2>
          <div className="grid flex-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand">Included</h3>
              <ul className="mt-3">
                {SCOPE_IN.map((item) => (
                  <li key={item} className="border-t border-white/15 py-2.5 text-[15px] leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand">Available as add-ons</h3>
              <ul className="mt-3">
                {SCOPE_ADD.map((item) => (
                  <li key={item} className="border-t border-white/15 py-2.5 text-[15px] leading-snug text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="hosting" className="border-t border-white/15 bg-black text-white">
        <div className={`${frame} flex flex-col-reverse gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-14`}>
          <p className="max-w-[58ch] text-[16px] leading-relaxed text-white/75">
            We set up, monitor and pay for Vercel and Supabase hosting for 12 months from launch. That covers secure, fast global hosting, a managed database, daily backups and room for up to 100,000 monthly active users. After the first year, keep it with us on a care plan or move it to your own account. It&apos;s your call.
          </p>
          <h2 className="text-[clamp(32px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white lg:max-w-[9em] lg:text-right">
            Your first year of hosting is on us.
          </h2>
        </div>
      </section>

      <section id="work">
        <div className={`${frame} py-14 lg:py-16`}>
          <h2 className="max-w-[13em] text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Products we&apos;ve taken from idea to launch.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {WORK.map((item, i) => (
              <article key={item.name} className={`rounded-[24px] p-6 ${i === 1 ? 'bg-black text-white' : 'bg-[#F6F5F1]'}`}>
                <p className={`text-[12px] font-extrabold ${i === 1 ? 'text-brand' : 'text-brand-ink'}`}>0{i + 1}</p>
                <h3 className="mt-4 text-[18px] font-extrabold tracking-[-0.02em]">{item.name}</h3>
                <p className={`mt-2 text-[14.5px] leading-relaxed ${i === 1 ? 'text-white/70' : 'text-body-muted'}`}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#F6F5F1]">
        <div className={`${frame} flex flex-col gap-8 py-14 lg:flex-row-reverse lg:items-start lg:gap-14 lg:py-16`}>
          <h2 className="text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.035em] lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:w-[220px] lg:shrink-0 lg:text-right">
            Questions, answered.
          </h2>
          <div className="grid min-w-0 flex-1 sm:grid-cols-2 sm:gap-x-10">
            {FAQS.map((item) => (
              <details key={item.q} className="group border-b border-black/10 py-3.5">
                <summary className="cursor-pointer list-none text-[15.5px] font-bold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.q}
                    <span aria-hidden className="text-brand-ink transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-[14.5px] leading-snug text-body-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="bg-brand">
        <div className={`${frame} py-12 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:py-14`}>
          <div>
            <h2 className="max-w-[16ch] text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Got an idea? Let&apos;s get it live.
            </h2>
            <p className="mt-3 max-w-[42ch] text-[16px] leading-relaxed text-black/75">
              Book a free 30-minute call. We&apos;ll tell you whether it fits, what it will take and when you could launch.
            </p>
          </div>
          <Book dark>Book a free call</Book>
        </div>
        <div className={`${frame} flex flex-col gap-4 border-t border-black/15 py-5 sm:flex-row sm:items-end sm:justify-between`}>
          <div>
            <p className="text-[14px] font-bold">Mavlers.ai — complete MVPs, from idea to launch.</p>
            <p className="mt-1 text-[13px] text-black/70">
              {email ? (
                <a href={`mailto:${email}`} className="font-semibold text-black">
                  {email}
                </a>
              ) : null}
              {email ? ' · ' : null}
              A Mavlers brand, part of Uplers
            </p>
          </div>
          <nav aria-label="Page" className="flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] font-semibold">
            <a href="#included">What&apos;s included</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href="/book-a-call">Contact</Link>
            <Link href="/privacy-policy">Privacy</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
