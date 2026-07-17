import type { MenuItem } from '@/lib/types';

export function UtilityBanner({ items }: { items: MenuItem[] }) {
  if (!items.length) return null;
  return (
    <div className="flex items-center justify-center gap-2.5 border-b border-line bg-ink-900 px-6 py-[9px] text-[12.5px] tracking-[0.01em] text-body-dim">
      <span className="text-[#6B7688]">Part of the Mavlers group</span>
      {items.map((it) => (
        <span key={it.id} className="flex items-center gap-2.5">
          <span className="text-[#2A3346]">·</span>
          <a href={it.url} target={it.target || '_blank'} rel="noreferrer" className="text-body-muted">
            {it.label}
          </a>
        </span>
      ))}
    </div>
  );
}
