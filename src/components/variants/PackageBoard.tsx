import { PACKAGES, hoursLabel, packageGroups } from '@/content/packages';

const INTRO = 'Hours, the price in USD, and how long it takes. The bill check is free.';

export function PackageBoard({ tone }: { tone: 'signal' | 'field' | 'instrument' | 'line' }) {
  if (tone === 'signal') return <SignalBoard />;
  if (tone === 'field') return <FieldBoard />;
  if (tone === 'instrument') return <InstrumentBoard />;
  return <LineBoard />;
}

function SignalBoard() {
  return (
    <section id="packages" className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-[clamp(64px,8vw,110px)] lg:px-10">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em] text-brand">Packages and pricing</p>
        <h2 className="m-0 mt-4 max-w-[16ch] font-display text-[clamp(32px,4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
          The work, with a number on it.
        </h2>
        <p className="m-0 mt-4 max-w-[42ch] text-[16px] leading-relaxed text-white/60">{INTRO}</p>
        <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
          {PACKAGES.map((item) => (
            <article key={item.name} className="v1-cell flex flex-col bg-ink-900 p-7">
              <span className="font-display text-[12px] font-extrabold tracking-[0.16em] text-brand">{item.pillar}</span>
              <h3 className="m-0 mt-5 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em]">{item.name}</h3>
              <p className="m-0 mt-4 font-display text-[28px] font-extrabold leading-none tracking-[-0.04em] text-brand">{item.price}</p>
              {item.priceNote && <p className="m-0 mt-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white/45">{item.priceNote}</p>}
              <p className="m-0 mt-4 text-[14.5px] leading-relaxed text-white/60">{item.included}</p>
              <p className="m-0 mt-auto pt-6 text-[13px] font-semibold text-white/45">
                {hoursLabel(item.hours)}
                <span aria-hidden className="px-2 text-white/25">/</span>
                {item.timeline}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FieldBoard() {
  return (
    <section id="packages" className="border-t border-black/10 bg-[#F4F1EA] text-black">
      <div className="mx-auto max-w-[1240px] px-6 py-[clamp(64px,8vw,110px)]">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.2em]">Packages and pricing</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 max-w-[14ch] font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            What it costs to take it on.
          </h2>
          <p className="m-0 max-w-[32ch] text-[15px] leading-relaxed text-black/60">{INTRO}</p>
        </div>
        <div className="mt-14 space-y-12">
          {packageGroups().map((group) => (
            <div key={group.pillar}>
              <h3 className="m-0 font-display text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-ink">{group.pillar}</h3>
              <div className="mt-2">
                {group.items.map((item) => (
                  <article key={item.name} className="grid gap-3 border-t border-black/15 py-6 md:grid-cols-[1fr_auto] md:items-start md:gap-10">
                    <div>
                      <h4 className="m-0 font-display text-[22px] font-extrabold tracking-[-0.03em]">{item.name}</h4>
                      <p className="m-0 mt-2 max-w-[62ch] text-[15px] leading-relaxed text-black/65">{item.included}</p>
                      <p className="m-0 mt-3 text-[13px] font-semibold text-black/45">
                        {hoursLabel(item.hours)} · {item.timeline}
                      </p>
                    </div>
                    <p className="m-0 font-display text-[26px] font-extrabold tracking-[-0.03em] md:text-right">
                      {item.price}
                      {item.priceNote && (
                        <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.12em] text-black/45">{item.priceNote}</span>
                      )}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstrumentBoard() {
  return (
    <section id="packages" className="border-t border-white/10 bg-[#070707] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-[clamp(64px,8vw,100px)] lg:px-10">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Packages and pricing</p>
        <h2 className="m-0 mt-4 max-w-[16ch] font-display text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
          Scope, hours, price.
        </h2>
        <p className="m-0 mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-white/60">{INTRO}</p>

        <div className="mt-10 space-y-3 lg:hidden">
          {PACKAGES.map((item) => (
            <article key={item.name} className="border border-white/15 p-4">
              <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-brand">{item.pillar}</p>
              <h3 className="m-0 mt-2 font-display text-[18px] font-extrabold tracking-[-0.02em]">{item.name}</h3>
              <p className="m-0 mt-2 text-[14px] leading-relaxed text-white/65">{item.included}</p>
              <dl className="m-0 mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-3 font-mono text-[11px] uppercase tracking-[0.08em]">
                <div>
                  <dt className="text-white/35">Hrs</dt>
                  <dd className="m-0 mt-1 text-white">{item.hours}</dd>
                </div>
                <div>
                  <dt className="text-white/35">USD</dt>
                  <dd className="m-0 mt-1 text-brand">
                    {item.price}
                    {item.priceNote && <span className="mt-1 block normal-case tracking-normal text-white/45">{item.priceNote}</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/35">Time</dt>
                  <dd className="m-0 mt-1 text-white">{item.timeline}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <caption className="sr-only">Packages and pricing</caption>
            <thead>
              <tr className="border-b border-white/15 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                <th className="py-3 pr-4 font-medium">Package</th>
                <th className="py-3 pr-4 font-medium">Pillar</th>
                <th className="py-3 pr-4 font-medium">What’s included</th>
                <th className="py-3 pr-4 font-medium">Hours</th>
                <th className="py-3 pr-4 font-medium">Price (USD)</th>
                <th className="py-3 font-medium">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGES.map((item) => (
                <tr key={item.name} className="border-b border-white/10 align-top">
                  <th className="py-4 pr-4 font-display text-[15px] font-extrabold tracking-[-0.02em]">{item.name}</th>
                  <td className="py-4 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-brand">{item.pillar}</td>
                  <td className="max-w-[36ch] py-4 pr-6 text-[14px] leading-relaxed text-white/65">{item.included}</td>
                  <td className="py-4 pr-4 font-mono text-[13px]">{item.hours}</td>
                  <td className="py-4 pr-4 font-mono text-[13px] text-brand">
                    {item.price}
                    {item.priceNote && <span className="mt-1 block font-sans text-[11px] normal-case tracking-normal text-white/45">{item.priceNote}</span>}
                  </td>
                  <td className="py-4 font-mono text-[13px] text-white/80">{item.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function LineBoard() {
  return (
    <section id="packages" className="border-t border-black/10 bg-white text-black">
      <div className="mx-auto max-w-[1440px] px-6 py-[clamp(64px,8vw,104px)] lg:px-10">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.18em]">Packages and pricing</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 max-w-[14ch] font-display text-[clamp(32px,4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            The line, with a number on it.
          </h2>
          <p className="m-0 max-w-[36ch] text-[15.5px] leading-relaxed text-black/60">{INTRO}</p>
        </div>
        <div className="mt-12 border-t border-black/10">
          {PACKAGES.map((item) => (
            <article key={item.name} className="grid gap-4 border-b border-black/10 py-6 lg:grid-cols-[140px_minmax(0,1fr)_150px_180px] lg:items-start lg:gap-8 lg:py-7">
              <span className="w-fit rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-black/60">
                {item.pillar}
              </span>
              <div>
                <h3 className="m-0 font-display text-[22px] font-extrabold leading-tight tracking-[-0.03em]">{item.name}</h3>
                <p className="m-0 mt-2 max-w-[62ch] text-[15px] leading-relaxed text-black/65">{item.included}</p>
              </div>
              <p className="m-0 text-[13.5px] font-semibold leading-relaxed text-black/55">
                {hoursLabel(item.hours)}
                <span className="mt-1 block">{item.timeline}</span>
              </p>
              <p className="m-0 font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] lg:text-right">
                {item.price}
                {item.priceNote && (
                  <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-brand-ink">{item.priceNote}</span>
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
