'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendlyEmbed } from '@/components/forms/CalendlyEmbed';
import { useRecaptcha } from '@/components/forms/useRecaptcha';
import { pickPlan, type Plan, STATIC_DIAGNOSIS } from '@/content/diagnosis';

const CALENDLY = 'https://calendly.com/mavlers-ai/30min';
const HOST = { name: 'Krunal Bakraniya', role: 'Expert AI Consultant', photo: '' };

type Phase = 'idle' | 'thinking' | 'shown';

function reduced() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function usePlanSession(siteKey: string, source: string) {
  const executeRecaptcha = useRecaptcha(siteKey);
  const [draft, setDraft] = useState('');
  const [problem, setProblem] = useState('');
  const [plan, setPlan] = useState<Plan>(STATIC_DIAGNOSIS);
  const [phase, setPhase] = useState<Phase>('idle');
  const [hint, setHint] = useState('');
  const [askOpen, setAskOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [booked, setBooked] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

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
    if (reduced()) {
      setPhase('shown');
      return;
    }
    setPhase('thinking');
    timer.current = window.setTimeout(() => setPhase('shown'), 720);
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
          form_key: 'homepage-diagnosis',
          data: { name: who, email: mail, problem, offer: plan.label, source },
          recaptcha_token: token,
          company_url: companyUrl,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) throw new Error(json.error || 'Could not save that. Try the booking page.');
      setBooked(true);
    } catch (err: any) {
      setFormError(err.message || 'Could not save that. Try the booking page.');
    } finally {
      setSubmitting(false);
    }
  }

  const schedulerUrl = (() => {
    try {
      const u = new URL(CALENDLY);
      if (name.trim()) u.searchParams.set('name', name.trim());
      if (email.trim()) u.searchParams.set('email', email.trim());
      return u.toString();
    } catch {
      return CALENDLY;
    }
  })();

  return {
    draft,
    setDraft,
    problem,
    plan,
    phase,
    hint,
    reveal,
    askOpen,
    setAskOpen,
    name,
    setName,
    email,
    setEmail,
    companyUrl,
    setCompanyUrl,
    submitting,
    formError,
    booked,
    onBook,
    schedulerUrl,
    host: HOST,
    duration: '30 minutes',
  };
}

export type PlanSession = ReturnType<typeof usePlanSession>;

/** Small close under a plan: one button, then a name and an email, then the calendar. */
export function EngineerAsk({
  session,
  tone = 'light',
}: {
  session: PlanSession;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  const label = session.plan.cta;

  if (session.booked) {
    return (
      <div className={`mt-5 rounded-2xl p-4 ${dark ? 'bg-white text-black' : 'bg-white'}`}>
        <p className="m-0 mb-3 text-[14.5px] font-semibold">Pick a time. The plan stays on this page.</p>
        <CalendlyEmbed
          url={session.schedulerUrl}
          host={session.host}
          duration={session.duration}
          facts={['No obligation', 'Bring the repo or the dashboard', 'Most calls are the same week']}
          note="You can open the scheduler in a new tab if the frame is awkward here."
        />
      </div>
    );
  }

  if (!session.askOpen) {
    return (
      <button
        type="button"
        onClick={() => session.setAskOpen(true)}
        className="mt-4 rounded-full bg-brand px-4 py-2.5 text-[13.5px] font-bold text-black transition-transform hover:-translate-y-0.5 hover:bg-brand-300"
      >
        {label}
      </button>
    );
  }

  return (
    <form onSubmit={session.onBook} className="mt-4 max-w-[420px]">
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Company website
        <input
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={session.companyUrl}
          onChange={(e) => session.setCompanyUrl(e.target.value)}
        />
      </label>
      <div className="grid gap-2">
        <input
          name="name"
          autoComplete="name"
          value={session.name}
          onChange={(e) => session.setName(e.target.value)}
          placeholder="Your name"
          className={`w-full rounded-xl border px-3.5 py-2.5 text-[14.5px] focus:outline-none ${
            dark
              ? 'border-white/15 bg-black/40 text-white placeholder:text-white/35 focus:border-brand'
              : 'border-black/10 bg-white text-black placeholder:text-black/35 focus:border-black'
          }`}
        />
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={session.email}
          onChange={(e) => session.setEmail(e.target.value)}
          placeholder="Work email"
          className={`w-full rounded-xl border px-3.5 py-2.5 text-[14.5px] focus:outline-none ${
            dark
              ? 'border-white/15 bg-black/40 text-white placeholder:text-white/35 focus:border-brand'
              : 'border-black/10 bg-white text-black placeholder:text-black/35 focus:border-black'
          }`}
        />
      </div>
      {session.formError && (
        <p className={`m-0 mt-2 text-[13px] font-semibold ${dark ? 'text-brand' : 'text-black'}`} role="alert">
          {session.formError}{' '}
          <a href="/book-a-call" className="underline decoration-brand decoration-2 underline-offset-2">
            Open the booking page
          </a>
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={session.submitting}
          className="rounded-full bg-brand px-4 py-2.5 text-[13.5px] font-bold text-black hover:bg-brand-300 disabled:opacity-60"
        >
          {session.submitting ? 'Saving…' : 'Book a time'}
        </button>
        <button
          type="button"
          onClick={() => session.setAskOpen(false)}
          className={`text-[13px] font-semibold underline underline-offset-4 ${dark ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'}`}
        >
          Keep reading
        </button>
      </div>
    </form>
  );
}

const STUDIES = [
  { href: '/', id: 'live', label: 'Live' },
  { href: '/v1', id: 'v1', label: '01 Signal' },
  { href: '/v2', id: 'v2', label: '02 Field' },
  { href: '/v3', id: 'v3', label: '03 Instrument' },
  { href: '/v4', id: 'v4', label: '04 Line' },
] as const;

export function VariantNav({ current }: { current: 'v1' | 'v2' | 'v3' | 'v4' }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Homepage studies"
      className="flex flex-wrap items-center justify-center gap-1 border-t border-white/10 bg-ink-900 px-4 py-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
    >
      {STUDIES.map((item) => {
        const on = item.id === 'live' ? pathname === '/' : item.id === current;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? 'page' : undefined}
            className={`rounded-full px-3 py-1.5 ${on ? 'bg-brand text-black' : 'text-white/75 hover:text-white'}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
