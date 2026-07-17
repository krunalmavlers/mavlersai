import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

export function Logo({ settings, height = 34 }: { settings: SiteSettings; height?: number }) {
  return (
    <Link href="/" style={{ display: 'block' }} aria-label={settings.site_name}>
      {settings.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={settings.logo_url}
          alt={settings.site_name}
          style={{ height, width: 'auto', display: 'block' }}
        />
      ) : (
        <span
          style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, height, lineHeight: `${height}px` }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: height * 0.62,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            Mavlers
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: height * 0.62,
              color: '#FFCB2E',
            }}
          >
            .ai
          </span>
        </span>
      )}
    </Link>
  );
}
