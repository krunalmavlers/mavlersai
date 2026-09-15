'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
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
  /**
   * Which dropdown is open, held in state rather than driven by CSS `:hover`.
   *
   * Hover alone could not be made to close on click. Hiding the menu on click
   * fires `mouseleave` on the group, and re-showing it on that event put a
   * visible menu back under a pointer that had not moved — so `:hover` matched
   * again and it reopened. Opening now needs a fresh `mouseenter`, which does
   * not fire while the pointer is stationary, so a click closes it for good.
   */
  const [openId, setOpenId] = useState<string | null>(null);
  const tree = nest(items);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-page items-center gap-5 px-6 py-[18px]">
        <Logo settings={settings} height={37} variant="light" />
        <div className="flex-1" />

        <nav aria-label="Primary" className="hidden items-center gap-[26px] lg:flex">
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
              <div
                key={item.id}
                className="nav-dd relative"
                data-open={openId === item.id ? '' : undefined}
                onMouseEnter={() => setOpenId(item.id)}
                onMouseLeave={() => setOpenId(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openId === item.id}
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-body-soft transition-colors hover:text-black"
                >
                  {item.label}
                  {/* A drawn chevron that turns with the menu. The previous
                      marker was a ▼ text character — it rendered in whatever
                      the system font offered, sat off the text baseline, and
                      could not animate. */}
                  <ChevronDown aria-hidden className="nav-dd-chev" size={15} strokeWidth={2.4} />
                </button>
                <div className="nav-dd-menu absolute left-1/2 top-[calc(100%+15px)] z-[60] min-w-[286px] -translate-x-1/2 rounded-[16px] border border-line bg-white p-2 shadow-[0_24px_54px_rgba(17,17,17,0.14),0_2px_6px_rgba(17,17,17,0.05)]">
                  <span aria-hidden className="nav-dd-notch" />
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      target={child.target}
                      onClick={() => setOpenId(null)}
                      className="nav-dd-item group relative flex items-center rounded-[11px] py-[11px] pl-[15px] pr-4 text-[14px] font-bold text-[#3A3A3A]"
                    >
                      <span aria-hidden className="nav-dd-rail" />
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
          {open ? <X size={19} strokeWidth={2.3} /> : <Menu size={19} strokeWidth={2.3} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-6 py-4 lg:hidden">
          <nav aria-label="Primary (mobile)" className="flex flex-col gap-1">
            {tree.map(({ item, children }) => (
              <div key={item.id}>
                {children.length === 0 ? (
                  <Link
                    href={item.url}
                    target={item.target}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-body-soft hover:text-black"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="px-3 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-body-dim">
                    {item.label}
                  </div>
                )}
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
