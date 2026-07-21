import type { MenuItem } from '@/lib/types';

export function UtilityBanner({ items }: { items: MenuItem[] }) {
  if (!items.length) return null;
  return (
    <div className="bg-black text-[12.5px] tracking-[0.01em] text-[#B8B8B8]">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-[18px] gap-y-1.5 px-6 py-[9px]">
        <span>Part of the Mavlers group</span>
        {items.map((it) => (
          <span key={it.id} className="flex items-center gap-x-[18px]">
            <span className="opacity-40">·</span>
            <a href={it.url} target={it.target || '_blank'} rel="noreferrer" className="text-brand">
              {it.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
