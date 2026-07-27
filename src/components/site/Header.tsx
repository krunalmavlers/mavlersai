'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MenuItem, SiteSettings } from '@/lib/types';
import { Logo } from './Logo';

// The menu is stored flat; `parent_id` turns an item into a dropdown group.
function nest(items: MenuItem[]) {
  const children = new Map<string, MenuItem[]>();
  for (const it of items) {
    if (!it.parent_id) continue;
    if (!children.has(it.parent_id)) children.set(it.parent_id, []);
    children.get(it.parent_id)!.push(it);
  }
  return items
    .filter((it) => !it.parent_id)
    .map((it) => ({ item: it, children: children.get(it.id) ?? [] }));
}

export function Header({ settings, items }: { settings: SiteSettings; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const tree = nest(items);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-page items-center gap-5 px-6 py-[15px]">
        <Logo settings={settings} height={31} variant="light" />
        <div className="flex-1" />

        <nav className="hidden items-center gap-[26px] lg:flex">
          {tree.map(({ item, children }) =>
            children.length === 0 ? (
              <Link
                key={item.id}
                href={item.url}
                target={item.target}
                className="text-[15px] font-semibold text-body-soft transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.id} className="nav-dd relative">
                <Link
                  href={item.url}
                  target={item.target}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-body-soft transition-colors hover:text-black"
                >
                  {item.label}
                  <span aria-hidden className="text-[10px] leading-none opacity-60">▼</span>
                </Link>
                <div className="nav-dd-menu absolute left-1/2 top-[calc(100%+14px)] z-[60] min-w-[260px] -translate-x-1/2 rounded-[14px] border border-line bg-white p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      target={child.target}
                      className="block rounded-[10px] px-3.5 py-2.5 text-[14px] font-semibold text-[#333] transition-colors hover:bg-surface-tint hover:text-black"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )}
        </nav>

        <Link
          href="/book-a-call"
          className="hidden whitespace-nowrap rounded-full bg-brand px-[22px] py-[11px] text-[14.5px] font-bold text-black transition-colors hover:bg-brand-300 md:inline-block"
        >
          Book a Call
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-black lg:hidden"
        >
          <span className="text-lg">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {tree.map(({ item, children }) => (
              <div key={item.id}>
                <Link
                  href={item.url}
                  target={item.target}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-body-soft hover:text-black"
                >
                  {item.label}
                </Link>
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.url}
                    target={child.target}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg py-2 pl-7 pr-3 text-[14px] font-semibold text-body-dim hover:text-black"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/book-a-call"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-[15px] font-bold text-black"
            >
              Book a Call
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
