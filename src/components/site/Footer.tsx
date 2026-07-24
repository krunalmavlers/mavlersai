import Link from 'next/link';
import type { MenuItem, SiteSettings } from '@/lib/types';
import { Logo } from './Logo';
import { SocialIcon } from './SocialIcon';

function groupByColumn(items: MenuItem[]) {
  const groups = new Map<string, MenuItem[]>();
  for (const it of items) {
    const key = it.group_label || 'Links';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(it);
  }
  return Array.from(groups.entries());
}

export function Footer({
  settings,
  columns,
  legal,
}: {
  settings: SiteSettings;
  columns: MenuItem[];
  legal: MenuItem[];
}) {
  const cols = groupByColumn(columns);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-[#9A9A9A]">
      <div className="mx-auto max-w-page px-6 pb-10 pt-[clamp(52px,6vw,76px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-6 gap-y-10">
          <div className="min-w-[200px]">
            <Logo settings={settings} height={31} variant="dark" />
            <p className="m-0 mt-4 max-w-[34ch] text-[14px] leading-relaxed text-[#8A8A8A]">{settings.tagline}</p>
            {settings.social_links?.length > 0 && (
              <div className="mt-5 flex gap-2.5">
                {settings.social_links.map((s) => (
                  <a
                    key={s.platform || s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label || s.platform}
                    title={s.label || s.platform}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/12 text-[12px] font-bold text-[#9A9A9A] transition-colors hover:border-brand hover:text-white"
                  >
                    {s.platform ? <SocialIcon platform={s.platform} /> : s.label}
                  </a>
                ))}
              </div>
            )}
            {settings.contact?.phones && settings.contact.phones.length > 0 && (
              <div className="mt-4 flex flex-col gap-1 text-[12.5px] text-[#8A8A8A]">
                {settings.contact.phones.map((p) => (
                  <span key={p.region}>
                    <span className="text-[#6E6E6E]">{p.region}</span> {p.number}
                  </span>
                ))}
              </div>
            )}
          </div>

          {cols.map(([title, links]) => (
            <div key={title}>
              <div className="mb-4 text-[14px] font-bold text-white">{title}</div>
              <div className="flex flex-col gap-2.5 text-[14px]">
                {links.map((l) => (
                  <Link key={l.id} href={l.url} target={l.target} className="text-[#9A9A9A] transition-colors hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[#222] pt-6 text-[13px] text-[#6E6E6E]">
          <span>
            © {year} {settings.site_name}. All rights reserved.
          </span>
          <div className="flex gap-5">
            {legal.map((l) => (
              <Link key={l.id} href={l.url} className="text-[#6E6E6E] hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
