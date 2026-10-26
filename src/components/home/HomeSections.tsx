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
    <section className="bg-black text-white">
      <ScrollScene className="gap-pin" mode="pin">
        <div className="gap-view mx-auto flex max-w-page flex-col justify-center px-6 py-[clamp(72px,10vw,120px)]">
          {c.eyebrow && (
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.16em] text-brand">{c.eyebrow}</p>
          )}
          {c.figure && (
            <p className="gap-figure m-0 mt-4 font-display text-[clamp(96px,18vw,220px)] font-extrabold leading-[0.85] tracking-[-0.06em]">
              <span className="hm">{c.figure}</span>
            </p>
          )}
          {c.sentence && (
            <p className="m-0 mt-6 max-w-[22ch] text-[clamp(22px,2.6vw,36px)] font-semibold leading-[1.15] tracking-[-0.03em] text-white/90">
              {c.sentence}
            </p>
          )}
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
              {items.map((item: any, i: number) => (
                <article
                  key={item.title || i}
                  className="pillar-card flex min-h-[280px] flex-col rounded-[24px] border border-[#E7E7E3] bg-white p-7"
                >
                  <span className="font-display text-[13px] font-extrabold tracking-[0.14em] text-brand-ink">
                    {item.n || String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="m-0 mt-5 font-display text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  {item.body && <p className="m-0 mt-3 text-[15px] leading-relaxed text-body-muted">{item.body}</p>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </ScrollScene>
    </section>
  );
}

export function PackageGrid({ c }: { c: any }) {
  const items = Array.isArray(c.items) ? c.items : [];
  const retainers = Array.isArray(c.retainers) ? c.retainers : [];
  return (
    <section id="packages" className="bg-white text-black">
      <div className="mx-auto max-w-page px-6 py-[clamp(56px,7vw,96px)]">
        {c.eyebrow && (
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em]">
            <span className="border-b-[3px] border-brand pb-1">{c.eyebrow}</span>
          </p>
        )}
        {c.heading && <h2 className={`${H2} mt-5 max-w-[18ch]`}>{c.heading}</h2>}
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
                    {[p.hours, p.duration].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              {p.desc && <p className="m-0 text-[15px] leading-relaxed text-body-muted">{p.desc}</p>}
              {p.price && (
                <p className="m-0 font-display text-[22px] font-extrabold tracking-[-0.03em] md:text-right">{p.price}</p>
              )}
            </article>
          ))}
        </div>

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
