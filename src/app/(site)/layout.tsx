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
      <UtilityBanner items={utility} />
      <Header settings={settings} items={header} />
      <main>{children}</main>
      <Footer settings={settings} columns={footer} legal={legal} />
    </div>
  );
}
