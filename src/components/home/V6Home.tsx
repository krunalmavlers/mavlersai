'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, Code2, Compass, LifeBuoy, ListChecks, PenLine, Rocket, Server } from 'lucide-react';
import { LightWash } from './LightWash';
import {
  AUDIENCE,
  BOOK_URL,
  CALL_STEPS,
  FAST,
  FAQS,
  HOSTING,
  INCLUDED,
  OFFER,
  PRICE_CHECKS,
  PROCESS,
  SCOPE_ADD,
  SCOPE_IN,
  SLOW,
  STACK,
  TICKER,
  WORK,
} from '@/content/v6Home';

const ICONS = [Compass, ListChecks, PenLine, Code2, Rocket, LifeBuoy, Server];
const FRAME = 'mx-auto max-w-page px-6';

function Book({
  children,
  dark = false,
  arrow = false,
}: {
  children: string;
  dark?: boolean;
  arrow?: boolean;
}) {
  return (
    <a
      href={BOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`v6-book inline-flex items-center justify-center rounded-full px-5 py-3 text-[14.5px] font-bold transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        dark
          ? 'bg-black text-white hover:bg-ink-900 focus-visible:outline-black'
          : 'v6-book-shine bg-brand text-black hover:bg-brand-300 focus-visible:outline-black'
      }`}
    >
      <span className="relative z-[1] inline-flex items-center gap-1.5">
        {children}
        {arrow ? <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden /> : null}
      </span>
    </a>
  );
}

function LaunchStage() {
  return (
    <div className="relative min-w-0">
      <p className="sr-only">
        An example of the six weeks: a sentence becomes screens, then a build with login and a database, then a live product.
      </p>
      <div className="v6-stage relative mx-auto w-full max-w-[520px]" aria-hidden>
      <div className="v6-halo pointer-events-none absolute -inset-8" aria-hidden />
      <div className="relative overflow-hidden rounded-[28px] bg-[#141414] shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
            <span className="v6-live h-1.5 w-1.5 rounded-full bg-brand" />
            Example product
          </span>
          <span className="truncate text-[11px] font-semibold text-white/35">app.yourproduct.com</span>
        </div>
        <div className="relative h-[228px] sm:h-[248px]">
          <div className="v6-beat flex flex-col justify-center px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">The sentence</p>
            <p className="mt-3 max-w-[14ch] text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[32px]">
              A booking tool for field teams.
              <span className="v6-caret" aria-hidden />
            </p>
          </div>
          <div className="v6-beat flex flex-col justify-center gap-2.5 px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Eight screens</p>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`h-12 rounded-lg border ${i === 5 ? 'border-brand bg-brand/15' : 'border-dashed border-white/25'}`}
                />
              ))}
            </div>
            <div className="h-8 rounded-lg border border-dashed border-white/15" />
          </div>
          <div className="v6-beat flex flex-col justify-center px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">In build</p>
            <ul className="mt-4 space-y-2.5">
              {['Secure login', 'Database and admin', 'The one integration'].map((row, i) => (
                <li key={row} className="flex items-center gap-3">
                  <span className={`v6-tick v6-tick-${i} flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-black`}>
                    ✓
                  </span>
                  <span className="text-[15px] font-bold text-white">{row}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="v6-beat flex flex-col px-5 pb-2 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Live</p>
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-black">Week 6</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['128', 'Signups'],
                ['36', 'Jobs'],
                ['4.9', 'Score'],
              ].map(([n, label]) => (
                <div key={label} className="rounded-xl bg-white/10 px-2.5 py-2">
                  <div className="text-[18px] font-extrabold leading-none text-white">{n}</div>
                  <div className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-white/40">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex h-14 items-end gap-1.5">
              {[40, 62, 48, 80, 70, 100, 74, 88].map((h, i) => (
                <span
                  key={i}
                  className={`v6-bar flex-1 rounded-t ${i === 5 ? 'bg-brand' : 'bg-white/20'}`}
                  style={{ '--h': `${h}%` } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 px-5 pb-4 pt-1">
          {['Idea', 'Design', 'Build', 'Live'].map((label) => (
            <div key={label} className="v6-pip min-w-0">
              <span className="v6-pipbar" />
              <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="v6-chip v6-chip-a absolute -left-2 top-14 hidden rounded-2xl bg-brand px-3 py-2 text-[12px] font-extrabold text-black shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:block">
        From $5,000
      </p>
      <p className="v6-chip v6-chip-b absolute -right-1 bottom-14 hidden rounded-2xl bg-white px-3 py-2 text-[12px] font-extrabold text-black shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:block">
        Preview every week
      </p>
      </div>
    </div>
  );
}

function Rise({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`v6-rise ${className}`} style={delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}

function MobileDock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const cta = document.getElementById('cta');
      if (!hero || !cta) return;
      const pastHero = hero.getBoundingClientRect().bottom < 64;
      const ctaNear = cta.getBoundingClientRect().top < window.innerHeight - 24;
      setShow(pastHero && !ctaNear);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="v6-dock fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full bg-black py-1.5 pl-4 pr-1.5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] lg:hidden">
      <p className="min-w-0 text-[13px] font-bold leading-tight">
        From $5,000
        <span className="mt-0.5 block text-[11px] font-semibold text-white/55">Live in about 6 weeks</span>
      </p>
      <a
        href={BOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-full bg-brand px-4 py-2.5 text-[13px] font-extrabold text-black"
      >
        Book a free call
      </a>
    </div>
  );
}

export function V6Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll<HTMLElement>('[data-v6]')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      nodes.forEach((n) => n.classList.add('is-on'));
      root.classList.add('v6-ready');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-on');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) node.classList.add('is-on');
      else io.observe(node);
    });
    root.classList.add('v6-ready');
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="v6-home bg-white text-black">
      <section id="hero" className="relative overflow-hidden bg-white text-black">
        <LightWash />
        <div className={`${FRAME} relative grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-16`}>
          <div className="v6-hero-copy">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-black">
                6 weeks
              </span>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-black/45">MVP development</p>
            </div>
            <h1 className="mt-5 max-w-[11em] text-[clamp(40px,5vw,68px)] font-extrabold leading-[0.96] tracking-[-0.045em] text-black">
              Six weeks from a sentence to a product people can use.
            </h1>
            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-black/45">Starts from</span>
              <span className="price-hot text-[clamp(40px,4.5vw,56px)] font-extrabold leading-none tracking-[-0.045em]">$5,000</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-[16.5px] leading-relaxed text-body-muted">
              One team plans it, designs it, builds it and launches it. A Next.js app, a project manager who stays on it, and twelve months of hosting. The code is yours from day one.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Book arrow>Book a free call</Book>
              <a
                href="#runway"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-[14.5px] font-bold text-black transition-colors hover:border-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                See the six weeks
              </a>
            </div>
            <p className="mt-3 text-[13px] font-medium text-black/45">
              Free, 30 minutes. You leave with a yes, a no, or a tighter scope.
            </p>
            <ul className="mt-7 flex flex-col gap-2 text-[14px] font-semibold sm:flex-row sm:flex-wrap sm:gap-x-5">
              {['Starts from $5,000', 'Weekly preview links', 'You own the code'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LaunchStage />
        </div>
      </section>

      <div className="overflow-hidden border-y border-black/10 bg-[#F6F5F1] text-black motion-reduce:hidden" aria-hidden>
        <div className="v6-marquee flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {TICKER.map((item) => (
                <li key={`${copy}-${item}`} className="flex items-center px-4 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.16em]">
                  <span className="mr-4 h-1.5 w-1.5 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <ul className="hidden flex-wrap justify-center gap-x-4 border-y border-black/10 bg-[#F6F5F1] px-6 py-3 text-[12px] font-extrabold uppercase tracking-[0.14em] motion-reduce:flex">
        {TICKER.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <section id="path">
        <div className={`${FRAME} py-16 lg:py-20`} data-v6>
          <Rise>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-ink">The fork in the road</p>
            <h2 className="mt-3 max-w-[14em] text-[clamp(32px,4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              The long way around. Or one kickoff.
            </h2>
          </Rise>
          <div className="mt-10 grid overflow-hidden rounded-[28px] lg:grid-cols-2">
            <div className="bg-[#F3F1EA] p-6 sm:p-8">
              <Rise>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-black/45">The long way</p>
              </Rise>
              <ul className="mt-6 space-y-5">
                {SLOW.map((item, i) => (
                  <li key={item.title}>
                    <Rise delay={80 + i * 70}>
                      <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">{item.title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-body-muted">{item.body}</p>
                    </Rise>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative bg-white p-6 text-black sm:p-8">
              <span className="v6-draw absolute inset-x-0 top-0 h-[3px] bg-brand" aria-hidden />
              <Rise>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-ink">The six-week way</p>
              </Rise>
              <ul className="mt-6 space-y-5">
                {FAST.map((item, i) => (
                  <li key={item.title}>
                    <Rise delay={140 + i * 80}>
                      <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">{item.title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-body-muted">{item.body}</p>
                    </Rise>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="offer" className="bg-[#F6F5F1]">
        <div className={`${FRAME} py-16 lg:py-20`} data-v6>
          <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Rise>
              <h2 className="max-w-[12em] text-[clamp(34px,4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                One team. A date you can put on a calendar.
              </h2>
            </Rise>
            <Rise delay={80}>
              <p className="text-[16.5px] leading-relaxed text-body-muted">{OFFER}</p>
              <div className="mt-6">
                <Book>Book a free call</Book>
              </div>
            </Rise>
          </div>
          <dl className="mt-12 grid border-t border-black/10 sm:grid-cols-3">
            {[
              ['From $5,000', 'Milestone billing. The number is the floor, not a surprise.'],
              ['About 6 weeks', 'Kickoff to a product on your domain.'],
              ['Every week', 'A preview link, so you are never waiting on a reveal.'],
            ].map(([title, body], i) => (
              <div key={title} className="border-b border-black/10 py-6 sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <Rise delay={i * 70}>
                  <dt className="text-[clamp(26px,3vw,36px)] font-extrabold tracking-[-0.04em]">
                    {title}
                  </dt>
                  <dd className="mt-2 max-w-[28ch] text-[14.5px] leading-relaxed text-body-muted">{body}</dd>
                </Rise>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="included">
        <div className={`${FRAME} py-16 lg:py-20`} data-v6>
          <Rise>
            <h2 className="max-w-[14em] text-[clamp(32px,3.8vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Everything between the idea and the URL.
            </h2>
          </Rise>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((item, i) => {
              const Icon = ICONS[i];
              const lead = i === 0;
              return (
                <Rise key={item.title} delay={i * 45} className={lead ? 'sm:col-span-2' : ''}>
                  <article
                    className="v6-card h-full rounded-[22px] bg-[#F6F5F1] p-5 sm:p-6"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-black">
                      <Icon size={16} strokeWidth={2.2} aria-hidden />
                    </span>
                    <h3 className={`mt-5 font-extrabold tracking-[-0.03em] ${lead ? 'text-[26px]' : 'text-[17px]'}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-2 text-[14.5px] leading-relaxed text-body-muted ${lead ? 'max-w-[36ch]' : ''}`}>
                      {item.body}
                    </p>
                  </article>
                </Rise>
              );
            })}
          </div>
          <Rise delay={120}>
            <p className="mt-3 rounded-[22px] border border-black/10 bg-[#F6F5F1] px-6 py-5 text-[15.5px] font-semibold leading-relaxed text-black sm:px-8">
              A dedicated project manager learns the goal on day one and stays the only person you have to chase.
            </p>
          </Rise>
        </div>
      </section>

      <section id="runway" className="bg-[#F6F5F1]">
        <div className={`${FRAME} py-16 lg:py-20`} data-v6>
          <Rise>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-ink">The runway</p>
            <h2 className="mt-3 max-w-[13em] text-[clamp(32px,3.8vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Six weeks, with the lights on.
            </h2>
          </Rise>
          <div className="relative mt-12">
            <div className="v6-track pointer-events-none absolute inset-x-0 top-0 hidden lg:block" aria-hidden>
              <span className="v6-comet" />
            </div>
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, i) => (
              <li key={step.when} className="border-t-[3px] border-black/10 pt-4 lg:border-transparent lg:pt-8">
                <Rise delay={i * 60}>
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-ink">
                    0{i + 1}
                    <span className="ml-2 text-black">{step.when}</span>
                  </p>
                  <h3 className="mt-3 text-[17px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-body-muted">{step.body}</p>
                </Rise>
              </li>
            ))}
            </ol>
          </div>
          <Rise delay={80}>
            <p className="mt-10 text-[14.5px] font-semibold text-black/70">
              Built on {STACK.join(' · ')}.
            </p>
          </Rise>
        </div>
      </section>

      <section id="fit">
        <div className={`${FRAME} py-16 lg:py-20`} data-v6>
          <Rise>
            <h2 className="max-w-[16em] text-[clamp(32px,3.8vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              If this sounds like you, the call is short.
            </h2>
          </Rise>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map((item, i) => {
              const last = i === AUDIENCE.length - 1;
              return (
                <Rise key={item.title} delay={i * 60}>
                  <article className={`v6-card h-full rounded-[24px] p-6 ${last ? 'bg-brand text-black' : 'bg-[#F6F5F1]'}`}>
                    <p className={`text-[12px] font-extrabold tracking-[0.14em] ${last ? 'text-black/50' : 'text-brand-ink'}`}>0{i + 1}</p>
                    <h3 className="mt-6 text-[20px] font-extrabold tracking-[-0.03em]">{item.title}</h3>
                    <p className={`mt-2 text-[14.5px] leading-relaxed ${last ? 'text-black/75' : 'text-body-muted'}`}>{item.body}</p>
                  </article>
                </Rise>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#F6F5F1] text-black">
        <div className={`${FRAME} py-16 lg:py-20`}>
          <div data-v6>
            <Rise>
              <h2 className="max-w-[12em] text-[clamp(32px,3.8vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                One fare. The whole path.
              </h2>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-body-muted">
                Paid in milestones. Domain registration, AI model usage, and payment-gateway fees are billed by those providers.
              </p>
            </Rise>
          </div>
          <div className="v6-pass relative mt-8 grid overflow-visible rounded-[28px] border border-black/10 bg-white text-black shadow-[0_24px_60px_rgba(0,0,0,0.06)] lg:grid-cols-[1.45fr_0.8fr]" data-v6>
            <div className="v6-pass-main relative p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-black/45">Boarding pass · MVP Launch</p>
              <div className="mt-6 grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/40">From</p>
                  <p className="mt-1 text-[clamp(26px,3vw,36px)] font-extrabold leading-none tracking-[-0.04em]">A sentence</p>
                </div>
                <span className="mb-1 hidden h-8 w-8 items-center justify-center rounded-full bg-brand text-[16px] font-bold sm:flex" aria-hidden>
                  →
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/40">To</p>
                  <p className="mt-1 text-[clamp(26px,3vw,36px)] font-extrabold leading-none tracking-[-0.04em]">A live product</p>
                </div>
              </div>
              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {PRICE_CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 border-t border-black/10 py-2.5 text-[14px] font-semibold leading-snug">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-black/45">Starts from</p>
                  <span className="v6-stamp">Cleared</span>
                </div>
                <p className="mt-3 text-[clamp(52px,6vw,76px)] font-extrabold leading-none tracking-[-0.05em]">$5,000</p>
                <p className="mt-3 text-[15px] font-bold">About 6 weeks</p>
                <p className="text-[15px] font-semibold text-black/60">12 months of hosting included</p>
              </div>
              <div className="mt-8">
                <Book arrow>Book a free call</Book>
                <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-black/10 pt-4">
                  {[
                    ['Gate', 'Week 6'],
                    ['Seat', 'You own it'],
                    ['Hold', '12 months'],
                  ].map(([dt, dd]) => (
                    <div key={dt}>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">{dt}</dt>
                      <dd className="mt-1 text-[13px] font-extrabold">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <span className="v6-notch left-[64.4%] top-0" aria-hidden />
            <span className="v6-notch left-[64.4%] bottom-0" aria-hidden />
          </div>
        </div>
      </section>

      <section id="scope" className="bg-white text-black">
        <div className={`${FRAME} grid gap-10 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:py-16`} data-v6>
          <Rise>
            <h2 className="max-w-[8em] text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              What fits in the box.
            </h2>
          </Rise>
          <div className="grid gap-10 sm:grid-cols-2">
            <Rise>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-ink">In the six weeks</h3>
              <ul className="mt-3">
                {SCOPE_IN.map((item) => (
                  <li key={item} className="border-t border-black/10 py-2.5 text-[15px] leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </Rise>
            <Rise delay={80}>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-ink">Quoted separately</h3>
              <ul className="mt-3">
                {SCOPE_ADD.map((item) => (
                  <li key={item} className="border-t border-black/10 py-2.5 text-[15px] leading-snug text-body-muted">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-body-muted">
                Bigger than this? We say so on the call, then quote it plainly.
              </p>
            </Rise>
          </div>
        </div>
      </section>

      <section id="hosting" className="border-t border-black/10 bg-[#F6F5F1]">
        <div className={`${FRAME} grid items-center gap-6 py-16 lg:grid-cols-[auto_1fr] lg:gap-12 lg:py-20`} data-v6>
          <Rise>
            <p className="text-[clamp(96px,14vw,168px)] font-extrabold leading-none tracking-[-0.07em]">12</p>
          </Rise>
          <Rise delay={80}>
            <h2 className="max-w-[14em] text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              months of hosting, already in the price.
            </h2>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-body-muted">{HOSTING}</p>
          </Rise>
        </div>
      </section>

      <section id="work" className="bg-white">
        <div className={`${FRAME} py-16 lg:py-20`} data-v6>
          <Rise>
            <h2 className="max-w-[14em] text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              What “live” has looked like.
            </h2>
          </Rise>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {WORK.map((item, i) => (
                <Rise key={item.name} delay={i * 70}>
                  <article className="v6-card h-full rounded-[24px] bg-[#F6F5F1] p-6">
                    <p className="text-[12px] font-extrabold tracking-[0.14em] text-brand-ink">0{i + 1}</p>
                    <h3 className="mt-8 text-[20px] font-extrabold tracking-[-0.03em]">{item.name}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-body-muted">{item.body}</p>
                  </article>
                </Rise>
            ))}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className={`${FRAME} grid gap-8 py-16 lg:grid-cols-[220px_1fr] lg:gap-14 lg:py-20`} data-v6>
          <Rise>
            <h2 className="text-[clamp(32px,3.6vw,48px)] font-extrabold leading-[1.02] tracking-[-0.04em] lg:sticky lg:top-[calc(var(--header-h)+28px)]">
              Ask it before the call.
            </h2>
          </Rise>
          <div className="grid min-w-0 sm:grid-cols-2 sm:gap-x-10">
            {FAQS.map((item) => (
              <details key={item.q} className="group border-b border-black/10 py-4">
                <summary className="cursor-pointer list-none text-[15.5px] font-bold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.q}
                    <span aria-hidden className="text-brand-ink transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <div className="v6-faq">
                  <p className="text-[14.5px] leading-relaxed text-body-muted">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="bg-brand text-black">
        <div className={`${FRAME} py-14 lg:py-16`} data-v6>
          <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Rise>
              <h2 className="max-w-[12em] text-[clamp(36px,4.4vw,60px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                Bring the idea. Leave with a date.
              </h2>
            </Rise>
            <Rise delay={80}>
              <p className="max-w-[40ch] text-[16px] leading-relaxed text-black/75">
                Starts from $5,000, live in about six weeks. Thirty minutes on a call, and you leave knowing whether it fits, what it will take, and the week it could go live.
              </p>
            </Rise>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            {CALL_STEPS.map((step, i) => (
              <li key={step.n}>
                <Rise delay={i * 70}>
                  <p className="text-[12px] font-extrabold tracking-[0.16em] text-black/45">{step.n}</p>
                  <h3 className="mt-3 text-[18px] font-extrabold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-black/70">{step.body}</p>
                </Rise>
              </li>
            ))}
          </ol>
          <Rise delay={120}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Book dark arrow>
                Book a free call
              </Book>
              <p className="text-[13px] font-semibold text-black/60">No deck required.</p>
            </div>
          </Rise>
        </div>
      </section>
      <MobileDock />
    </div>
  );
}
