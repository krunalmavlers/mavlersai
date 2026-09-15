import { getMenu, getSettings } from '@/lib/queries';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { UtilityBanner } from '@/components/site/UtilityBanner';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, header, footer, legal, utility] = await Promise.all([
    getSettings(),
    getMenu('header'),
    getMenu('footer'),
    getMenu('footer_legal'),
    getMenu('utility'),
  ]);

  return (
    <div className="min-h-screen bg-white text-body">
      {/* Bypass Blocks (WCAG 2.4.1): off-screen until focused, so a keyboard
          user can jump the banner, logo and nav straight to the page content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2.5 focus:text-[14px] focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-brand"
      >
        Skip to content
      </a>
      <UtilityBanner items={utility} />
      <Header settings={settings} items={header} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer settings={settings} columns={footer} legal={legal} />
    </div>
  );
}
