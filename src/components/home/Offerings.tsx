import { PromptFill } from './LaunchPrompt';

const H2 =
  'm-0 font-display font-extrabold leading-[1.05] tracking-[-0.035em] text-[clamp(28px,3.6vw,48px)]';

type Offer = {
  name?: string;
  summary?: string;
  hours?: string;
  timeline?: string;
  prompt?: string;
};

type Group = {
  id?: string;
  label?: string;
  items?: Offer[];
};

type Care = {
  name?: string;
  hours?: string;
  summary?: string;
  prompt?: string;
};

export function Offerings({ c }: { c: any }) {
  const groups: Group[] = Array.isArray(c.groups) ? c.groups : [];
  const care: Care[] = Array.isArray(c.care) ? c.care : [];

  return (
    <section id="offerings" className="bg-[#F6F5F1] text-black">
      <div className="mx-auto max-w-page px-6 py-[clamp(56px,7vw,100px)]">
        {c.eyebrow && (
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.16em]">
            <span className="border-b-[3px] border-brand pb-1">{c.eyebrow}</span>
          </p>
        )}
        {c.heading && <h2 className={`${H2} mt-5 max-w-[16ch]`}>{c.heading}</h2>}
        {c.subhead && <p className="m-0 mt-4 max-w-[54ch] text-[16px] leading-relaxed text-body-muted">{c.subhead}</p>}

        {groups.length > 0 && (
          <nav aria-label="Offering groups" className="mt-8 flex flex-wrap gap-2">
            {groups.map((group) => (
              <a
                key={group.id || group.label}
                href={`#offer-${group.id || ''}`}
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-bold tracking-[-0.01em] hover:border-black"
              >
                {group.label}
              </a>
            ))}
            {care.length > 0 && (
              <a href="#offer-care" className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-bold hover:border-black">
                Care
              </a>
            )}
          </nav>
        )}

        <div className="mt-12">
          {groups.map((group, gi) => (
            <article key={group.id || gi} id={`offer-${group.id || gi}`} className="scroll-mt-28 border-t border-black/10 py-10 first:border-t-0 first:pt-0">
              <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:gap-12">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="m-0 font-display text-[12px] font-extrabold tracking-[0.18em] text-brand-ink">
                    {String(gi + 1).padStart(2, '0')}
                  </p>
                  <h3 className="m-0 mt-2 font-display text-[28px] font-extrabold tracking-[-0.04em]">{group.label}</h3>
                </div>
                <div>
                  {(group.items || []).map((item, i) => (
                    <PromptFill
                      key={item.name || i}
                      text={item.prompt || item.name || ''}
                      className="of-row group block w-full border-t border-l-2 border-black/10 border-l-transparent py-6 pl-4 text-left transition-colors first:border-t-0 first:pt-0 hover:border-l-brand"
                    >
                      <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <span className="font-display text-[clamp(20px,2vw,26px)] font-extrabold tracking-[-0.03em]">{item.name}</span>
                        <span className="flex flex-wrap items-center gap-2 text-[12.5px] font-bold">
                          {item.timeline && <span className="rounded-full bg-brand px-2.5 py-1 text-black">{item.timeline}</span>}
                          {item.hours && <span className="text-body-dim">{item.hours}</span>}
                        </span>
                      </span>
                      {item.summary && (
                        <span className="mt-3 block max-w-[62ch] text-[15px] leading-relaxed text-body-muted">{item.summary}</span>
                      )}
                      <span className="mt-4 block text-[13px] font-bold">Tell us about this →</span>
                    </PromptFill>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {care.length > 0 && (
        <div id="offer-care" className="scroll-mt-28 bg-ink-900 text-white">
          <div className="mx-auto max-w-page px-6 py-[clamp(48px,6vw,80px)]">
            <p className="m-0 text-[12px] font-bold uppercase tracking-[0.16em] text-brand">After launch</p>
            <h3 className={`${H2} mt-4 max-w-[16ch] text-white`}>Someone still here, every month.</h3>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {care.map((item, i) => (
                <PromptFill
                  key={item.name || i}
                  text={item.prompt || item.name || ''}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-7 text-left transition-colors hover:border-brand"
                >
                  <span className="block font-display text-[clamp(56px,6vw,80px)] font-extrabold leading-none tracking-[-0.05em] text-brand">
                    {item.hours}
                  </span>
                  <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">hours a month</span>
                  <span className="mt-4 block font-display text-[22px] font-extrabold tracking-[-0.03em]">{item.name}</span>
                  {item.summary && <span className="mt-3 block text-[15px] leading-relaxed text-white/70">{item.summary}</span>}
                  <span className="mt-5 block text-[13px] font-bold text-brand">Tell us about this →</span>
                </PromptFill>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* {c.footnote && (
        <div className="mx-auto max-w-page px-6 py-8">
          <p className="m-0 max-w-[78ch] text-[13.5px] leading-relaxed text-body-dim">{c.footnote}</p>
        </div>
      )} */}
    </section>
  );
}
