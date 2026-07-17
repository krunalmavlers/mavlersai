import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/queries';
import { Scripts } from '@/components/site/Scripts';
import { JsonLd } from '@/components/site/JsonLd';
import { siteUrl } from '@/lib/seo';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body>
        <Scripts settings={settings} position="body-start" />
        {children}
        <JsonLd data={settings.organization_schema} />
        <Scripts settings={settings} position="body-end" />
      </body>
    </html>
  );
}
