import { ScrollScene } from '@/components/sections/ScrollScene';
import { PromptFill } from './LaunchPrompt';

const H2 =
  'm-0 font-display font-extrabold leading-[1.05] tracking-[-0.035em] text-[clamp(28px,3.6vw,48px)]';

export function LeadDoors({ c }: { c: any }) {
  const items = Array.isArray(c.items) ? c.items : [];
  return (
    <section className="bg-white text-black">
      <div className="mx-auto max-w-page px-6 py-[clamp(56px,7vw,96px)]">
        {c.eyebrow && (
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em] text-black">
            <span className="border-b-[3px] border-brand pb-1">{c.eyebrow}</span>
          </p>
        )}
        {c.heading && <h2 className={`${H2} mt-5 max-w-[16ch]`}>{c.heading}</h2>}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item: any, i: number) => (
            <PromptFill
              key={item.title || i}
              text={item.prompt || item.title || ''}
              className="group flex h-full flex-col rounded-[28px] border border-[#E7E7E3] bg-surface-tint p-7 text-left transition-colors hover:border-black md:p-9"
            >
              {item.kicker && (
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-ink">{item.kicker}</span>
              )}
              <span className="mt-4 font-display text-[clamp(26px,2.6vw,36px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                {item.title}
              </span>
              {item.body && <span className="mt-4 text-[15.5px] leading-relaxed text-body-muted">{item.body}</span>}
              <span className="mt-8 flex items-center justify-between gap-4">
                <span className="text-[13.5px] font-bold">See a plan</span>
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand text-[18px] font-bold text-black transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </PromptFill>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PinnedStat({ c }: { c: any }) {
  return (
    <section className="gap-band relative bg-black text-white">
      <ScrollScene className="gap-pin" mode="pin">
        <div className="gap-view mx-auto grid max-w-page items-center gap-10 px-6 py-[clamp(56px,8vw,100px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.88fr)] lg:gap-x-16">
          <div>
            {c.eyebrow && (
              <p className="m-0 text-[12px] font-bold uppercase tracking-[0.16em] text-brand">{c.eyebrow}</p>
            )}
            {c.figure && (
              <p className="gap-figure m-0 mt-4 font-display text-[clamp(88px,14vw,200px)] font-extrabold leading-[0.85] tracking-[-0.06em]">
                <span className="hm">{c.figure}</span>
              </p>
            )}
            {c.sentence && (
              <p className="m-0 mt-6 max-w-[22ch] text-[clamp(22px,2.4vw,34px)] font-semibold leading-[1.15] tracking-[-0.03em] text-white/90">
                {c.sentence}
              </p>
            )}
          </div>

          <aside className="gap-aside" aria-label="Where that figure shows up">
            <div className="gap-sheet">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-[#ff7a18]" />
                </span>
                <span className="ml-1 font-mono text-[11px] tracking-[0.06em] text-white/45">app/client.tsx</span>
                <span className="ml-auto text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand">In the bundle</span>
              </div>
              <div className="px-4 py-5" aria-hidden>
                <div className="h-2 w-[72%] rounded-full bg-white/10" />
                <div className="mt-2.5 h-2 w-[48%] rounded-full bg-white/10" />
                <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/[0.05] px-3 py-3 ring-1 ring-[#ffdd2f]/70">
                  <span className="font-mono text-[12.5px] font-bold text-[#ffdd2f]">API_KEY</span>
                  <span className="font-mono text-[12.5px] text-white/35">=</span>
                  <span className="font-mono text-[12.5px] text-white/85">&quot;sk_live_••••••••&quot;</span>
                </div>
                <div className="mt-3 h-2 w-[61%] rounded-full bg-white/10" />
                <div className="mt-2.5 h-2 w-[34%] rounded-full bg-white/10" />
              </div>
              <div className="border-t border-white/10 px-5 py-5">
                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">May 2025 study</p>
                <p className="m-0 mt-2 font-display text-[clamp(40px,4.4vw,56px)] font-extrabold leading-none tracking-[-0.045em]">
                  <span className="hm">170</span>
                  <span className="mx-2 text-[0.42em] font-semibold text-white/35">of</span>
                  1,645
                </p>
                <p className="m-0 mt-3 max-w-[34ch] text-[14.5px] leading-relaxed text-white/65">
                  These had personal data in the open. The preview worked. The boundary did not.
                </p>
              </div>
            </div>
            <PromptFill
              text="The prototype isn’t safe to launch"
              className="mt-4 flex w-full items-center justify-between rounded-full border border-white/15 px-5 py-3.5 text-left text-[14px] font-bold text-white transition-colors hover:border-brand"
            >
              <span>This is the rescue</span>
              <span className="text-brand">→</span>
            </PromptFill>
          </aside>
        </div>
      </ScrollScene>
    </section>
  );
}

export function PillarRail({ c }: { c: any }) {
  const items = Array.isArray(c.items) ? c.items : [];
  return (
    <section className="bg-surface-tint text-black">
      <ScrollScene className="pillar-pin" mode="pin">
        <div className="pillar-view mx-auto max-w-page px-6 py-[clamp(56px,7vw,96px)]">
          {c.eyebrow && (
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em]">
              <span className="border-b-[3px] border-brand pb-1">{c.eyebrow}</span>
            </p>
          )}
          {c.heading && <h2 className={`${H2} mt-5 max-w-[18ch]`}>{c.heading}</h2>}
          {c.subhead && <p className="m-0 mt-4 max-w-[52ch] text-[16px] leading-relaxed text-body-muted">{c.subhead}</p>}
          <div className="pillar-scroller mt-10">
            <div className="pillar-track">
              {items.map((item: any, i: number) => {
                const hot = item.kicker === 'Lead' || item.kicker === 'Entry';
                const card = (
                  <>
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[13px] font-extrabold tracking-[0.14em] text-brand-ink">
                        {item.n || String(i + 1).padStart(2, '0')}
                      </span>
                      {item.kicker && (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${hot ? 'bg-brand text-black' : 'text-black/45'}`}>
                          {item.kicker}
                        </span>
                      )}
                    </span>
                    <span className="mt-5 block font-display text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em]">
                      {item.title}
                    </span>
                    {item.body && <span className="mt-3 block text-[15px] leading-relaxed text-body-muted">{item.body}</span>}
                    {item.prompt && <span className="mt-auto pt-6 text-[13.5px] font-bold">See a plan →</span>}
                  </>
                );
                const className = `pillar-card flex min-h-[320px] cursor-pointer flex-col rounded-[24px] border bg-white p-7 text-left text-black ${hot ? 'border-brand' : 'border-[#E7E7E3]'}`;
                return item.prompt ? (
                  <PromptFill key={item.title || i} text={item.prompt} className={className}>
                    {card}
                  </PromptFill>
                ) : (
                  <article key={item.title || i} className={className}>
                    {card}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollScene>
      {Array.isArray(c.features) && c.features.length > 0 && (
        <div className="mx-auto max-w-page px-6 pb-[clamp(48px,6vw,80px)]">
          <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-ink">Named on the build</p>
          <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
            {c.features.map((name: string) => (
              <li key={name} className="rounded-full border border-[#E7E7E3] bg-white px-3 py-1.5 text-[13px] font-semibold">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function PackageGrid({ c }: { c: any }) {
  const items = Array.isArray(c.items) ? c.items : [];
  const retainers = Array.isArray(c.retainers) ? c.retainers : [];
  return (
    <section id="packages" className="bg-white text-black">
      <div className="mx-auto max-w-[1440px] px-6 py-[clamp(56px,7vw,96px)] lg:px-10">
        {c.eyebrow && (
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em]">
            <span className="border-b-[3px] border-brand pb-1">{c.eyebrow}</span>
          </p>
        )}
        {c.heading && <h2 className={`${H2} mt-5 max-w-[18ch]`}>{c.heading}</h2>}
        {c.subhead && <p className="m-0 mt-4 max-w-[52ch] text-[16px] leading-relaxed text-body-muted">{c.subhead}</p>}
        {items.some((p: any) => p.pillar) ? (
          <RateTable items={items} />
        ) : (
          <div className="mt-10 border-t border-[#E7E7E3]">
            {items.map((p: any, i: number) => (
              <article key={p.name || i} className="grid gap-3 border-b border-[#E7E7E3] py-6 md:grid-cols-[1.4fr_1.6fr_auto] md:items-center md:gap-8 md:py-7">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.featured && (
                      <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-black">
                        Lead
                      </span>
                    )}
                    <h3 className="m-0 font-display text-[20px] font-extrabold tracking-[-0.03em]">{p.name}</h3>
                  </div>
                  {(p.hours || p.duration) && (
                    <p className="m-0 mt-1 text-[13px] font-semibold text-body-dim">
                      {[p.hours && `${p.hours} hrs`, p.duration].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                {p.desc && <p className="m-0 text-[15px] leading-relaxed text-body-muted">{p.desc}</p>}
                {p.price && (
                  <p className="m-0 font-display text-[22px] font-extrabold tracking-[-0.03em] md:text-right">
                    {p.price}
                    {p.price_note && <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.12em] text-body-dim">{p.price_note}</span>}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {retainers.length > 0 && (
          <div className="mt-12">
            <h3 className="m-0 font-display text-[22px] font-extrabold tracking-[-0.03em]">Vercel Care</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {retainers.map((r: any, i: number) => (
                <article key={r.name || i} className="rounded-[24px] bg-ink-900 p-7 text-white">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="m-0 font-display text-[20px] font-extrabold">{r.name}</h4>
                    {r.price && <p className="m-0 font-display text-[20px] font-extrabold text-brand">{r.price}</p>}
                  </div>
                  {r.desc && <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-white/70">{r.desc}</p>}
                </article>
              ))}
            </div>
          </div>
        )}

        {c.footnote && <p className="m-0 mt-8 max-w-[70ch] text-[13.5px] leading-relaxed text-body-dim">{c.footnote}</p>}
      </div>
    </section>
  );
}

function RateTable({ items }: { items: any[] }) {
  return (
    <>
      <div className="mt-10 space-y-4 lg:hidden">
        {items.map((p, i) => (
          <article key={p.name || i} className="rounded-[24px] border border-[#E7E7E3] bg-surface-tint p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                {p.pillar && (
                  <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-ink">{p.pillar}</p>
                )}
                <h3 className="m-0 mt-2 font-display text-[20px] font-extrabold tracking-[-0.03em]">{p.name}</h3>
              </div>
              <p className="m-0 text-right font-display text-[20px] font-extrabold tracking-[-0.03em]">
                {p.price}
                {p.price_note && <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.1em] text-body-dim">{p.price_note}</span>}
              </p>
            </div>
            {p.desc && <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-body-muted">{p.desc}</p>}
            <p className="m-0 mt-4 text-[13px] font-semibold text-body-dim">
              {[p.hours && `${p.hours} ${p.hours === '1' ? 'hour' : 'hours'}`, p.duration].filter(Boolean).join(' · ')}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-10 hidden lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Packages and pricing</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[9%]" />
            <col className="w-[37%]" />
            <col className="w-[9%]" />
            <col className="w-[16%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#E7E7E3] text-[11px] font-bold uppercase tracking-[0.14em] text-body-dim">
              <th className="py-3 pr-4 font-bold">Package</th>
              <th className="py-3 pr-4 font-bold">Pillar</th>
              <th className="py-3 pr-4 font-bold">What’s included</th>
              <th className="py-3 pr-4 font-bold">Hours</th>
              <th className="py-3 pr-4 font-bold">Price (USD)</th>
              <th className="py-3 font-bold">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={p.name || i} className="border-b border-[#E7E7E3] align-top">
                <th className="py-5 pr-4 font-display text-[16px] font-extrabold leading-snug tracking-[-0.02em]">{p.name}</th>
                <td className="py-5 pr-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-brand-ink">{p.pillar}</td>
                <td className="py-5 pr-6 text-[14.5px] font-medium leading-relaxed text-body-muted">{p.desc}</td>
                <td className="py-5 pr-4 text-[14px] font-semibold">{p.hours}</td>
                <td className="py-5 pr-4 font-display text-[16px] font-extrabold leading-snug tracking-[-0.02em]">
                  {p.price}
                  {p.price_note && <span className="mt-1 block font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-body-dim">{p.price_note}</span>}
                </td>
                <td className="py-5 text-[14px] font-semibold">{p.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
