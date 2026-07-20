import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { adminGetSettings } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.role !== 'admin') redirect('/admin');

  const settings = await adminGetSettings();
  const data =
    settings ?? {
      id: 1,
      site_name: 'Mavlers.ai',
      tagline: '',
      logo_url: '',
      favicon_url: '',
      default_meta_title: '',
      default_meta_description: '',
      default_og_image: '',
      header_scripts: '',
      body_start_scripts: '',
      footer_scripts: '',
      ga_id: '',
      gtm_id: '',
      fb_pixel_id: '',
      social_links: [],
      contact: {},
      recaptcha_site_key: '',
      recaptcha_threshold: 0.5,
      url_config: { implementations_base: 'implementations', insights_base: 'insights' },
      organization_schema: {},
      robots_txt: '',
    };
  return (
    <div>
      <PageHeader title="Settings" subtitle="Branding, SEO defaults, tracking scripts, URL structure and schema." />
      <SettingsEditor settings={data} />
    </div>
  );
}
