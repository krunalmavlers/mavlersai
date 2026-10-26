'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroCircuit } from '@/components/sections/HeroCircuit';
import { CalendlyEmbed } from '@/components/forms/CalendlyEmbed';
import { useRecaptcha } from '@/components/forms/useRecaptcha';
import { HERO_DEFAULTS, pickPlan, PROMPT_EVENT, STATIC_DIAGNOSIS, type Plan } from '@/content/diagnosis';

type Phase = 'idle' | 'thinking' | 'shown';

type Host = { name?: string; role?: string; photo?: string };

function headingHtml(raw: string) {
  const html = raw && raw.trim() ? raw : HERO_DEFAULTS.headingHtml;
  return html.replace(/<span(?![^>]*class=)/g, '<span class="hm"');
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Fills the homepage prompt and opens a plan beside it. Used by the sections below. */
export function PromptFill({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        document.getElementById('prompt')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        window.dispatchEvent(new CustomEvent(PROMPT_EVENT, { detail: { text } }));
      }}
    >
      {children}
    </button>
  );
}

export function LaunchPrompt({ c, siteKey }: { c: any; siteKey: string }) {
  const eyebrow = c.eyebrow || HERO_DEFAULTS.eyebrow;
  const subhead = c.subhead || HERO_DEFAULTS.subhead;
  const fieldLabel = c.field_label || HERO_DEFAULTS.fieldLabel;
  const placeholder = c.placeholder || HERO_DEFAULTS.placeholder;
  const button = c.button || HERO_DEFAULTS.button;
  const chips: string[] = Array.isArray(c.chips) && c.chips.length ? c.chips : HERO_DEFAULTS.chips;
  const formKey = c.form_key || 'homepage-diagnosis';
  const calendlyUrl = c.calendly_url || 'https://calendly.com/mavlers-ai/30min';
  const duration = c.calendly_duration || '30 minutes';
  const host: Host = {
    name: c.host_name || 'Krunal Bakraniya',
    role: c.host_role || 'Expert AI Consultant',
    photo: c.host_photo || '',
  };

  const executeRecaptcha = useRecaptcha(siteKey);
  const [draft, setDraft] = useState('');
  const [problem, setProblem] = useState('');
  const [plan, setPlan] = useState<Plan>(STATIC_DIAGNOSIS);
  const [phase, setPhase] = useState<Phase>('idle');
  const [askOpen, setAskOpen] = useState(false);
  const [hint, setHint] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [booked, setBooked] = useState(false);
  const timer = useRef<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onAsk(e: Event) {
      const text = (e as CustomEvent<{ text?: string }>).detail?.text || '';
      if (text) {
        setDraft(text);
        reveal(text);
      }
    }
    window.addEventListener(PROMPT_EVENT, onAsk);
    return () => {
      window.removeEventListener(PROMPT_EVENT, onAsk);
      if (timer.current) window.clearTimeout(timer.current);
    };
    // reveal is stable enough for the lifetime of the page; the listener
    // closes over the latest setter identity, which React keeps stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === 'idle') return;
    if (window.innerWidth >= 960) return;
    const reduce = prefersReducedMotion();
    const id = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }, reduce ? 0 : 80);
    return () => window.clearTimeout(id);
  }, [phase]);

  function reveal(raw: string) {
    const text = raw.trim();
    if (!text) {
      setHint('Describe the stall first.');
      return;
    }
    setHint('');
    setProblem(text);
    setDraft(text);
    setPlan(pickPlan(text));
    setBooked(false);
    setAskOpen(false);
    setFormError('');
    if (timer.current) window.clearTimeout(timer.current);
    if (prefersReducedMotion()) {
      setPhase('shown');
      return;
    }
    setPhase('thinking');
    timer.current = window.setTimeout(() => setPhase('shown'), 800);
  }

  function onAsk(e?: React.FormEvent) {
    e?.preventDefault();
    if (phase === 'thinking') return;
    reveal(draft);
  }

  async function onBook(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const who = name.trim();
    const mail = email.trim();
    if (who.length < 2) {
      setFormError('Add your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setFormError('Add a work email.');
      return;
    }
    setSubmitting(true);
    try {
      let token = await executeRecaptcha('homepage_diagnosis');
      if (!token && siteKey) {
        await new Promise((r) => window.setTimeout(r, 700));
        token = await executeRecaptcha('homepage_diagnosis');
      }
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_key: formKey,
          data: {
            name: who,
            email: mail,
            problem,
            offer: plan.label,
            source: 'homepage',
          },
          recaptcha_token: token,
          company_url: companyUrl,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || 'Could not save that. Try the booking page.');
      }
      setBooked(true);
    } catch (err: any) {
      setFormError(err.message || 'Could not save that. Try the booking page.');
    } finally {
      setSubmitting(false);
    }
  }

  const schedulerUrl = (() => {
    try {
      const u = new URL(calendlyUrl);
      if (name.trim()) u.searchParams.set('name', name.trim());
      if (email.trim()) u.searchParams.set('email', email.trim());
      return u.toString();
    } catch {
      return calendlyUrl;
    }
  })();

  const split = phase !== 'idle';

  return (
    <section id="prompt" className="lp-hero relative -mt-[calc(var(--header-h)+12px)] overflow-hidden bg-ink-900 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[min(100svh,960px)] overflow-hidden">
        <div className="lp-glow absolute left-1/2 top-[12%] h-[460px] w-[460px] -translate-x-1/2 rounded-full" />
        <div className="relative h-full opacity-80">
          <HeroCircuit />
        </div>
        <div className="lp-scrim absolute inset-0" />
      </div>

      <div className={`lp-stage relative z-10 mx-auto px-6 pb-[clamp(56px,8vw,96px)] pt-[calc(var(--header-h)+12px+clamp(28px,5vw,72px))]${split ? ' is-split' : ''}`}>
        <div className="lp-prompt">
          <p className="lp-eyebrow m-0 text-[12px] font-bold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
          <h1
            className="lp-h1 m-0 mt-5 font-display font-extrabold"
            dangerouslySetInnerHTML={{ __html: headingHtml(c.heading_html) }}
          />
          <p className="lp-sub m-0 mt-5 max-w-[42ch] text-[clamp(15px,1.4vw,18px)] leading-relaxed text-white/70">
            {subhead}
          </p>

          <form onSubmit={onAsk} className="lp-form mt-8 w-full">
            <label htmlFor="stall" className="mb-3 block text-[12px] font-bold uppercase tracking-[0.14em] text-brand">
              {fieldLabel}
            </label>
            <div className="lp-shell">
              <div className="lp-composer flex flex-col gap-3 rounded-[26px] bg-[#121212] p-3.5 sm:p-4">
                <textarea
                  id="stall"
                  name="problem"
                  rows={split ? 3 : 4}
                  value={draft}
                  placeholder={placeholder}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onAsk();
                    }
                  }}
                  className="min-h-[132px] w-full flex-1 resize-none bg-transparent px-3 py-2 text-[18px] leading-snug text-white placeholder:text-white/55 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={phase === 'thinking'}
                  className="rounded-full bg-brand px-6 py-3.5 text-[15.5px] font-bold text-black transition-colors hover:bg-brand-300 disabled:opacity-60"
                >
                  {phase === 'thinking' ? 'Drafting…' : button}
                </button>
              </div>
            </div>
            {hint && (
              <p className="m-0 mt-3 text-[13.5px] font-semibold text-brand" role="status">
                {hint}
              </p>
            )}
          </form>

          <div className="lp-chips mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  if (phase === 'thinking') return;
                  reveal(chip);
                }}
                className="rounded-full border border-white/15 px-3.5 py-2 text-left text-[13px] font-semibold text-white/80 transition-colors hover:border-brand hover:text-white"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {split && (
          <div ref={resultRef} className="lp-artifact" aria-live="polite">
            {phase === 'thinking' ? (
              <article className="lp-doc lp-doc-wait" aria-busy="true">
                <header className="lp-doc-bar">
                  <span>Plan</span>
                  <span className="lp-wait">Drafting</span>
                </header>
                <div className="lp-doc-body">
                  <div className="h-3 w-16 rounded-full bg-black/10" />
                  <div className="mt-4 h-7 w-4/5 rounded-full bg-black/10" />
                  <div className="mt-4 h-3 w-full rounded-full bg-black/[0.06]" />
                  <div className="mt-2 h-3 w-11/12 rounded-full bg-black/[0.06]" />
                  <div className="mt-8 space-y-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-12 rounded-xl bg-black/[0.04]" />
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <article className="lp-doc lp-card">
                <header className="lp-doc-bar">
                  <span>{plan.kicker}</span>
                  <span className="text-black/45">{plan.label}</span>
                </header>
                <div className="lp-doc-body">
                  <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em] text-black/40">Facing</p>
                  <p className="m-0 mt-1.5 text-[15px] font-medium leading-snug text-black/80">{problem}</p>
                  <h2 className="m-0 mt-6 font-display text-[clamp(24px,2.2vw,32px)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                    {plan.title}
                  </h2>
                  <p className="m-0 mt-3 text-[15px] leading-relaxed text-black/60">{plan.lede}</p>
                  <ol className="m-0 mt-7 list-none space-y-5 p-0">
                    {plan.steps.map((step) => (
                      <li key={step.n} className="grid grid-cols-[2.2rem_1fr] gap-x-2">
                        <span className="pt-0.5 font-display text-[13px] font-extrabold tracking-[0.04em] text-brand-ink">
                          {step.n}
                        </span>
                        <div>
                          <h3 className="m-0 font-display text-[16.5px] font-extrabold leading-snug tracking-[-0.02em]">
                            {step.title}
                          </h3>
                          <p className="m-0 mt-1 text-[14.5px] leading-relaxed text-black/60">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <footer className="lp-doc-foot">
                  <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-black/50">{plan.helpTitle}</p>
                  <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-black/75">{plan.help}</p>

                  {booked ? (
                    <div className="mt-5">
                      <p className="m-0 mb-3 text-[14.5px] font-semibold text-black">Pick a time. The plan stays here.</p>
                      <CalendlyEmbed
                        url={schedulerUrl}
                        host={host}
                        duration={duration}
                        facts={['No obligation', 'Bring the repo or the dashboard', 'Most calls are the same week']}
                        note="You can also open the scheduler in a new tab if the frame is awkward on this device."
                      />
                    </div>
                  ) : askOpen ? (
                    <form onSubmit={onBook} className="mt-4">
                      <label className="absolute -left-[9999px]" aria-hidden="true">
                        Company website
                        <input
                          tabIndex={-1}
                          autoComplete="off"
                          value={companyUrl}
                          onChange={(e) => setCompanyUrl(e.target.value)}
                        />
                      </label>
                      <div className="grid gap-2.5">
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">Name</span>
                          <input
                            name="name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14.5px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                            placeholder="Your name"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">Work email</span>
                          <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[14.5px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                            placeholder="you@company.com"
                          />
                        </label>
                      </div>
                      {formError && (
                        <p className="m-0 mt-2.5 text-[13px] font-semibold text-black" role="alert">
                          {formError}{' '}
                          <a href="/book-a-call" className="underline decoration-brand decoration-2 underline-offset-2">
                            Open the booking page
                          </a>
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="rounded-full bg-brand px-4 py-2.5 text-[13.5px] font-bold text-black transition-colors hover:bg-brand-300 disabled:opacity-60"
                        >
                          {submitting ? 'Saving…' : 'Book a time'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAskOpen(false)}
                          className="text-[13px] font-semibold text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black"
                        >
                          Keep reading
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAskOpen(true)}
                      className="mt-4 rounded-full bg-brand px-4 py-2.5 text-[13.5px] font-bold text-black transition-colors hover:bg-brand-300"
                    >
                      {plan.cta}
                    </button>
                  )}
                </footer>
              </article>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
