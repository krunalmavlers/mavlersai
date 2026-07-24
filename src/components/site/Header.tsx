'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MenuItem, SiteSettings } from '@/lib/types';
import { Logo } from './Logo';

export function Header({ settings, items }: { settings: SiteSettings; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-page items-center gap-5 px-6 py-[15px]">
        <Logo settings={settings} height={31} variant="light" />
        <div className="flex-1" />

        <nav className="hidden items-center gap-[26px] lg:flex">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.target}
              className="text-[15px] font-semibold text-body-soft transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}
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
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target={item.target}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-body-soft hover:text-black"
              >
                {item.label}
              </Link>
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
