import Link from 'next/link';
import type { MenuItem, SiteSettings } from '@/lib/types';
import { Logo } from './Logo';

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
    <footer className="border-t border-line bg-ink-900 pb-8 pt-16">
      <div className="mx-auto max-w-page px-5 md:px-10">
        <div className="grid grid-cols-1 gap-10 border-b border-line pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-[300px]">
            <div className="mb-4">
              <Logo settings={settings} height={30} />
            </div>
            <p className="m-0 mb-5 text-[13.5px] leading-relaxed text-body-dim">{settings.tagline}</p>
            <div className="flex gap-2.5">
              {settings.social_links.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/12 text-[12px] font-bold text-body-faint transition-colors hover:border-brand hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
            {settings.contact?.phones && settings.contact.phones.length > 0 && (
              <div className="mt-5 flex flex-col gap-1 text-[12.5px] text-body-dim">
                {settings.contact.phones.map((p) => (
                  <span key={p.region}>
                    <span className="text-body-faint">{p.region}</span> {p.number}
                  </span>
                ))}
              </div>
            )}
          </div>

          {cols.map(([title, links]) => (
            <div key={title}>
              <div className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5E6A7D]">
                {title}
              </div>
              <div className="flex flex-col gap-3">
                {links.map((l) => (
                  <Link
                    key={l.id}
                    href={l.url}
                    target={l.target}
                    className="text-[13.5px] font-medium text-body-muted transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <span className="text-[12.5px] text-[#5E6A7D]">
            © {year} {settings.site_name} — part of the Mavlers group. All rights reserved.
          </span>
          <div className="flex gap-6">
            {legal.map((l) => (
              <Link key={l.id} href={l.url} className="text-[12.5px] text-body-dim hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
