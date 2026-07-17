'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MenuItem, SiteSettings } from '@/lib/types';
import { Logo } from './Logo';

export function Header({ settings, items }: { settings: SiteSettings; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(10,14,26,0.82)] backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-page items-center justify-between px-5 md:px-10">
        <Logo settings={settings} />

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.target}
              className="rounded-lg px-3.5 py-2.5 text-[14.5px] font-semibold text-body-soft transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/book-a-call"
            className="whitespace-nowrap rounded-[10px] bg-brand px-5 py-[11px] text-[14px] font-bold text-ink shadow-[0_6px_18px_rgba(255,203,46,0.35)] transition-colors hover:bg-brand-300"
          >
            Book a Call / Submit Requirement
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
        >
          <span className="text-lg">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink-900 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target={item.target}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-body-soft hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book-a-call"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[10px] bg-brand px-5 py-3 text-center text-[15px] font-bold text-ink"
            >
              Book a Call / Submit Requirement
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
