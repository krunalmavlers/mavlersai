import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/queries';
import { Scripts } from '@/components/site/Scripts';
import { JsonLd } from '@/components/site/JsonLd';
import { siteUrl } from '@/lib/seo';

// Mavlers.ai brand typeface — Montserrat across the whole site (display + body).
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl('/')),
    title: {
      default: settings.default_meta_title || settings.site_name,
      template: `%s · ${settings.site_name}`,
    },
    description: settings.default_meta_description || settings.tagline,
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Scripts settings={settings} position="body-start" />
        {children}
        <JsonLd data={settings.organization_schema} />
        <Scripts settings={settings} position="body-end" />
      </body>
    </html>
  );
}
