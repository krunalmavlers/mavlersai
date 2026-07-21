'use client';

function pageList(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push('…');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('…');
  out.push(total);
  return out;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    const next = Math.min(totalPages, Math.max(1, p));
    if (next === page) return;
    onChange(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const base =
    'flex h-10 min-w-[40px] items-center justify-center rounded-[10px] border px-3 text-[13px] font-semibold transition-colors';

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className={`${base} border-surface-line2 bg-white text-body-faint hover:border-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-surface-line2`}
      >
        ‹ Prev
      </button>

      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-body-dim">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${base} ${
              p === page
                ? 'border-black bg-black text-white'
                : 'border-surface-line2 bg-white text-body-faint hover:border-black'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className={`${base} border-surface-line2 bg-white text-body-faint hover:border-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-surface-line2`}
      >
        Next ›
      </button>
    </nav>
  );
}
