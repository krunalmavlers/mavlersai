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

// The bundled brand logo, pre-resampled at build time into /public/logo. The
// source is 938x227 but it renders into slots ~107-165px wide, so handing the
// browser the original means a ~7x in-place downscale — which is what reads as
// soft on a retina panel. These variants let it pick one near the real size.
const BRAND_LOGO = '/mavlers-ai-logo.png';
const BRAND_LOGO_WIDTHS = [128, 192, 256, 384, 512];
const BRAND_LOGO_ASPECT = 938 / 227;

/**
 * `srcset` + `sizes` for a logo rendered at a fixed CSS `height` with width
 * auto. Handles both the bundled brand asset and CMS logos served through
 * `/images/`. Returns empty props for anything else, so callers can spread it
 * and fall back to a plain `src`.
 */
export function logoImageProps(
  src: string | undefined | null,
  height: number,
): { srcSet?: string; sizes?: string } {
  if (!src) return {};
  if (src === BRAND_LOGO) {
    return {
      srcSet: BRAND_LOGO_WIDTHS.map((w) => `/logo/mavlers-ai-logo-${w}.png ${w}w`).join(', '),
      sizes: `${Math.round(height * BRAND_LOGO_ASPECT)}px`,
    };
  }
  const srcSet = retinaSrcSet(src, height, { axis: 'h' });
  return srcSet ? { srcSet } : {};
}

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
