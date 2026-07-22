import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/queries';
import { Sidebar } from '@/components/admin/Sidebar';

export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen bg-surface-tint2 text-body">
      <Sidebar email={admin.email} role={admin.role} logoUrl={settings.logo_url} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1400px] px-8 py-10">{children}</div>
      </div>
    </div>
  );
}
