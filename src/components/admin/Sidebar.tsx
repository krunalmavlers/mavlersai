'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from './SignOutButton';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/posts', label: 'Insights & Implementations' },
  { href: '/admin/taxonomies', label: 'Categories & Tags' },
  { href: '/admin/menus', label: 'Menus' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/forms', label: 'Forms' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/settings', label: 'Settings', adminOnly: true },
  { href: '/admin/users', label: 'Users', adminOnly: true },
  { href: '/admin/account', label: 'Account' },
];

export function Sidebar({ email, role, logoUrl }: { email: string; role: string; logoUrl?: string }) {
  const pathname = usePathname();
  const nav = NAV.filter((item) => !item.adminOnly || role === 'admin');
  return (
    <aside className="flex w-[250px] flex-shrink-0 flex-col border-r border-line bg-white p-4">
      <Link href="/admin" className="mb-6 flex items-center px-2">
        {logoUrl ? (
          // The brand logo asset is white-on-transparent; invert it to black so
          // it's visible on the light admin sidebar.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Mavlers.ai"
            style={{ height: 26, width: 'auto', display: 'block', filter: 'brightness(0)' }}
          />
        ) : (
          <span className="font-display text-[20px] font-bold text-black">
            Mavlers<span className="text-brand-ink">.ai</span>
          </span>
        )}
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[9px] px-3 py-2 text-[13.5px] font-semibold transition-colors ${
                active ? 'bg-brand/15 text-brand-ink' : 'text-body-faint hover:bg-black/5 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          target="_blank"
          className="mt-1 rounded-[9px] px-3 py-2 text-[13.5px] font-semibold text-body-faint hover:bg-black/5 hover:text-black"
        >
          View site ↗
        </Link>
      </nav>
      <div className="mt-4 border-t border-line pt-4">
        <div className="mb-2 truncate px-1 text-[12px] text-body-dim">{email}</div>
        <SignOutButton />
      </div>
    </aside>
  );
}
