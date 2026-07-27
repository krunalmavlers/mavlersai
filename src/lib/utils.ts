import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Build a DPR-aware `srcset` for media served through our own `/images/` route
 * (which resizes via `?w=`). Handing the browser an asset near its display size
 * — properly resampled by sharp — is far crisper than letting it downscale a
 * full-resolution original in-place, and much lighter to download.
 *
 * `displayWidth` is the CSS width the image occupies. Returns `undefined` for
 * anything we can't resize (external hosts, SVG, /public assets), so callers can
 * spread it onto an <img> and fall back to plain `src`.
 */
export function retinaSrcSet(
  src: string | undefined | null,
  displaySize: number,
  { axis = 'w', densities = [1, 2, 3] }: { axis?: 'w' | 'h'; densities?: number[] } = {},
): string | undefined {
  if (!src || !src.startsWith('/images/')) return undefined;
  if (/\.svg($|\?)/i.test(src)) return undefined;
  const sep = src.includes('?') ? '&' : '?';
  return densities
    .map((d) => `${src}${sep}${axis}=${Math.round(displaySize * d)} ${d}x`)
    .join(', ');
}

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
