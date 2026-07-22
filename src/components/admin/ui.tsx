import Link from 'next/link';

export const inputCls =
  'w-full rounded-[10px] border border-surface-line2 bg-white px-3.5 py-2.5 text-[14px] text-black placeholder:text-body-dim focus:border-brand focus:outline-none';

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-body-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-body-dim">{hint}</span>}
    </label>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] border border-surface-line2 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="m-0 font-display text-[26px] font-bold text-black">{title}</h1>
        {subtitle && <p className="m-0 mt-1 text-[14px] text-body-faint">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-[10px] bg-brand px-4 py-2.5 text-[14px] font-bold text-ink hover:bg-brand-300"
    >
      {children}
    </Link>
  );
}
