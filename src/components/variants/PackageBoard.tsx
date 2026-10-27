'use client';

import { useState } from 'react';
import { CARE, OFFERING_NOTE, PACKAGES, hoursLabel, packageGroups } from '@/content/packages';

type Ask = (text: string) => void;

export function PackageBoard({ tone, onAsk }: { tone: 'signal' | 'field' | 'instrument' | 'line'; onAsk: Ask }) {
  if (tone === 'signal') return <SignalBoard onAsk={onAsk} />;
  if (tone === 'field') return <FieldBoard onAsk={onAsk} />;
  if (tone === 'instrument') return <InstrumentBoard onAsk={onAsk} />;
  return <LineBoard onAsk={onAsk} />;
}

function SignalBoard({ onAsk }: { onAsk: Ask }) {
  return (
    <section id="offerings" className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-[clamp(64px,8vw,110px)] lg:px-10">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em] text-brand">The slate</p>
        <h2 className="m-0 mt-4 max-w-[14ch] font-display text-[clamp(32px,4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
          Nine ways through. Two ways to stay.
        </h2>
        <p className="m-0 mt-4 max-w-[46ch] text-[16px] leading-relaxed text-white/60">
          Each engagement is a fixed scope. Pick one and the plan draws at the top of the page.
        </p>
        <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
          {PACKAGES.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onAsk(item.prompt)}
              className="v1-cell flex h-full cursor-pointer flex-col bg-ink-900 p-7 text-left text-white"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-brand">{item.pillar}</span>
                <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-white/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="mt-8 font-display text-[clamp(32px,3vw,44px)] font-extrabold leading-none tracking-[-0.045em] text-brand">
                {item.timeline}
              </span>
              <h3 className="m-0 mt-4 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em]">{item.name}</h3>
              <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-white/60">{item.included}</p>
              <span className="mt-auto flex items-center justify-between gap-4 pt-6 text-[13px] font-bold">
                <span className="text-white/45">{hoursLabel(item.hours)}</span>
                <span className="text-brand">Draw this →</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-px grid gap-px bg-white/10 md:grid-cols-2">
          {CARE.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onAsk(item.prompt)}
              className="v1-cell flex cursor-pointer flex-col bg-ink-900 p-7 text-left text-white md:p-9"
            >
              <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-brand">After launch</span>
              <span className="mt-4 font-display text-[clamp(72px,8vw,104px)] font-extrabold leading-none tracking-[-0.06em] text-brand">
                {item.hours}
              </span>
              <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">hours a month</span>
              <h3 className="m-0 mt-5 font-display text-[24px] font-extrabold tracking-[-0.03em]">{item.name}</h3>
              <p className="m-0 mt-2 max-w-[36ch] text-[14.5px] leading-relaxed text-white/60">{item.summary}</p>
              <span className="mt-6 text-[13px] font-bold text-brand">Draw this →</span>
            </button>
          ))}
        </div>
        <p className="m-0 mt-8 max-w-[72ch] text-[13px] leading-relaxed text-white/40">{OFFERING_NOTE}</p>
      </div>
    </section>
  );
}

function FieldBoard({ onAsk }: { onAsk: Ask }) {
  return (
    <section id="offerings" className="border-t border-black/10 bg-[#F4F1EA] text-black">
      <div className="mx-auto max-w-[1240px] px-6 py-[clamp(64px,8vw,110px)]">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em]">
          Contents <span className="text-black/35">/ what we take on</span>
        </p>
        <h2 className="m-0 mt-5 max-w-[16ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          The engagement, written out.
        </h2>
        <div className="mt-14 space-y-14">
          {packageGroups().map((group, gi) => (
            <div key={group.pillar} className="grid gap-6 lg:grid-cols-[140px_1fr] lg:gap-10">
              <p className="m-0 font-display text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-ink lg:pt-6">
                {String(gi + 1).padStart(2, '0')} {group.pillar}
              </p>
              <div>
                {group.items.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onAsk(item.prompt)}
                    className="group block w-full cursor-pointer border-t border-black/15 py-6 text-left"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-[clamp(20px,2vw,26px)] font-extrabold tracking-[-0.03em]">{item.name}</span>
                      <span aria-hidden className="mb-1 hidden h-px flex-1 border-b border-dotted border-black/30 sm:block" />
                      <span className="shrink-0 text-[13px] font-bold underline decoration-brand decoration-[3px] underline-offset-[5px]">
                        {item.timeline}
                      </span>
                    </span>
                    <span className="mt-3 block max-w-[68ch] text-[15px] leading-relaxed text-black/65">{item.included}</span>
                    <span className="mt-3 flex items-center justify-between gap-4 text-[13px] font-bold">
                      <span className="text-black/45">{hoursLabel(item.hours)}</span>
                      <span className="transition-transform group-hover:translate-x-0.5">Start from this →</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-black px-6 py-10 text-white sm:px-10">
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-brand">After the last page</p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {CARE.map((item) => (
              <button key={item.name} type="button" onClick={() => onAsk(item.prompt)} className="cursor-pointer text-left">
                <span className="block font-display text-[clamp(64px,7vw,88px)] font-extrabold leading-none tracking-[-0.06em] text-brand">
                  {item.hours}
                </span>
                <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">hours a month</span>
                <span className="mt-4 block font-display text-[22px] font-extrabold">{item.name}</span>
                <span className="mt-2 block max-w-[36ch] text-[15px] leading-relaxed text-white/70">{item.summary}</span>
                <span className="mt-4 block text-[13px] font-bold text-brand">Start from this →</span>
              </button>
            ))}
          </div>
        </div>
        <p className="m-0 mt-8 max-w-[72ch] text-[13.5px] leading-relaxed text-black/45">{OFFERING_NOTE}</p>
      </div>
    </section>
  );
}

function InstrumentBoard({ onAsk }: { onAsk: Ask }) {
  const groups = packageGroups();
  const modes = ['All', ...groups.map((group) => group.pillar), 'Care'];
  const [mode, setMode] = useState('All');
  const visible = mode === 'All' || mode === 'Care' ? groups : groups.filter((group) => group.pillar === mode);
  const showCare = mode === 'All' || mode === 'Care';

  return (
    <section id="offerings" className="border-t border-white/10 bg-[#070707] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-[clamp(64px,8vw,100px)] lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Manifest</p>
            <h2 className="m-0 mt-4 max-w-[16ch] font-display text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Scope, on the instrument.
            </h2>
          </div>
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {String(PACKAGES.length).padStart(2, '0')} engagements / {String(CARE.length).padStart(2, '0')} care
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Offering groups">
          {modes.map((name) => {
            const on = mode === name;
            return (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setMode(name)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] ${
                  on ? 'border-brand text-brand' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {mode !== 'Care' && (
          <div className="mt-8">
            {visible.map((group) => (
              <div key={group.pillar}>
                {group.items.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onAsk(item.prompt)}
                    className="grid w-full cursor-pointer grid-cols-1 gap-3 border-t border-white/10 py-5 text-left hover:bg-white/[0.03] sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-start sm:gap-6"
                  >
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-brand">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {item.pillar}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[18px] font-extrabold tracking-[-0.02em]">{item.name}</span>
                      <span className="mt-1.5 block max-w-[68ch] text-[14.5px] leading-relaxed text-white/60">{item.included}</span>
                    </span>
                    <span className="grid grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-[0.08em] sm:text-right">
                      <span>
                        <span className="block text-white/35">Hrs</span>
                        <span className="mt-1 block text-white">{item.hours}</span>
                      </span>
                      <span>
                        <span className="block text-white/35">Window</span>
                        <span className="mt-1 block text-white">{item.timeline}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {showCare && (
          <div className={`grid gap-3 md:grid-cols-2 ${mode === 'Care' ? 'mt-8' : 'mt-3'}`}>
            {CARE.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onAsk(item.prompt)}
                className="cursor-pointer border border-white/15 p-5 text-left hover:border-brand"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">Care / monthly</span>
                <span className="mt-4 flex items-end gap-3">
                  <span className="font-display text-[64px] font-extrabold leading-none tracking-[-0.05em]">{item.hours}</span>
                  <span className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">hours a month</span>
                </span>
                <span className="mt-3 block font-display text-[18px] font-extrabold">{item.name}</span>
                <span className="mt-2 block text-[14px] leading-relaxed text-white/60">{item.summary}</span>
              </button>
            ))}
          </div>
        )}
        <p className="m-0 mt-8 max-w-[72ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-white/35">
          {OFFERING_NOTE}
        </p>
      </div>
    </section>
  );
}

function LineBoard({ onAsk }: { onAsk: Ask }) {
  return (
    <section id="offerings" className="bg-[#070708] text-black">
      <div className="mx-auto max-w-[1100px] px-6 py-[clamp(64px,8vw,104px)] lg:px-10">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-brand">Engagements</p>
        <h2 className="m-0 mt-3 max-w-[16ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
          The scope, opened like the plan.
        </h2>
        <div className="mt-10 overflow-hidden rounded-[22px] bg-[#F6F5F1] text-[#0A0A0A] shadow-[0_40px_80px_-36px_rgba(0,0,0,0.65)]">
          <header className="flex items-center justify-between gap-3 border-b border-black/10 px-6 py-3.5 sm:px-8">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]">Fixed scope</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/40">Nine engagements</span>
          </header>
          <div>
            {packageGroups().map((group) =>
              group.items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onAsk(item.prompt)}
                  className="grid w-full cursor-pointer gap-3 border-b border-black/10 px-6 py-5 text-left last:border-b-0 hover:bg-black/[0.03] sm:px-8 lg:grid-cols-[110px_minmax(0,1fr)_120px] lg:items-start lg:gap-6"
                >
                  <span className="w-fit rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-black/55">
                    {item.pillar}
                  </span>
                  <span>
                    <span className="block font-display text-[20px] font-extrabold leading-tight tracking-[-0.03em]">{item.name}</span>
                    <span className="mt-2 block max-w-[62ch] text-[14.5px] leading-relaxed text-black/65">{item.included}</span>
                  </span>
                  <span className="text-[13px] font-semibold leading-relaxed text-black/55 lg:text-right">
                    <span className="block text-brand-ink">{item.timeline}</span>
                    <span className="mt-1 block">{hoursLabel(item.hours)}</span>
                  </span>
                </button>
              )),
            )}
          </div>
          <footer className="grid gap-8 border-t border-black/10 bg-[#111] px-6 py-8 text-white sm:px-8 md:grid-cols-2">
            {CARE.map((item) => (
              <button key={item.name} type="button" onClick={() => onAsk(item.prompt)} className="cursor-pointer text-left">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand">After launch</span>
                <span className="mt-3 flex items-end gap-3">
                  <span className="font-display text-[64px] font-extrabold leading-none tracking-[-0.05em] text-brand">{item.hours}</span>
                  <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">hours a month</span>
                </span>
                <span className="mt-2 block font-display text-[20px] font-extrabold">{item.name}</span>
                <span className="mt-2 block text-[14.5px] leading-relaxed text-white/70">{item.summary}</span>
                <span className="mt-4 block text-[13px] font-bold text-brand">Open this in the plan →</span>
              </button>
            ))}
          </footer>
        </div>
        <p className="m-0 mt-6 max-w-[72ch] text-[13px] leading-relaxed text-white/40">{OFFERING_NOTE}</p>
      </div>
    </section>
  );
}
