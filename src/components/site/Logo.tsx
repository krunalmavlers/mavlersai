import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';
import { LogoMark } from './LogoMark';

// Brand logo assets ship in /public; any other logo_url is a custom upload.
const BRAND_LOGOS = new Set(['', '/mavlers-ai-logo.svg', '/mavlers-ai-logo.png']);

/**
 * Mavlers.ai wordmark. Adapts to the surface it sits on:
 *  - variant="light"  → dark "mavlers" (for white / light backgrounds)
 *  - variant="dark"   → white "mavlers" (for black / dark backgrounds)
 * The ".ai" badge (black on brand yellow) is identical on both, per the design.
 * A `settings.logo_url` image, if set, overrides the wordmark.
 */
export function Logo({
  settings,
  height = 26,
  variant = 'light',
  href = '/',
}: {
  settings: SiteSettings;
  height?: number;
  variant?: 'light' | 'dark';
  href?: string;
}) {
  const wordColor = variant === 'dark' ? '#FFFFFF' : '#000000';
  const size = height * 0.92;
  const isBrand = BRAND_LOGOS.has(settings.logo_url || '');

  return (
    <Link href={href} aria-label={settings.site_name} style={{ display: 'inline-flex', alignItems: 'baseline', color: wordColor }}>
      {isBrand ? (
        // Vector brand logo — inherits `color` (black on light, white on dark).
        <LogoMark height={height} title={settings.site_name} />
      ) : settings.logo_url ? (
        // Custom uploaded logo.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={settings.logo_url}
          alt={settings.site_name}
          style={{ height, width: 'auto', display: 'block' }}
        />
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            fontWeight: 800,
            fontSize: size,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: wordColor }}>mavlers</span>
          <span
            style={{
              color: '#000',
              background: '#FFDB2D',
              padding: '0 5px',
              borderRadius: 4,
              marginLeft: 3,
              fontWeight: 800,
            }}
          >
            .ai
          </span>
        </span>
      )}
    </Link>
  );
}
