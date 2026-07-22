import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { PageHeader } from '@/components/admin/ui';
import { PasswordForm } from '@/components/admin/PasswordForm';

export const dynamic = 'force-dynamic';

const ROLE_LABEL: Record<string, string> = { admin: 'Admin (full access)', editor: 'Editor (content only)' };

export default async function AccountPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div>
      <PageHeader title="Account" subtitle="Your login details." />
      <div className="mb-6 rounded-[16px] border border-surface-line2 bg-white p-6 text-[13.5px] text-body-soft">
        <div className="mb-1">
          <span className="text-body-dim">Email:</span> {admin.email}
        </div>
        <div>
          <span className="text-body-dim">Role:</span> {ROLE_LABEL[admin.role] ?? admin.role}
        </div>
      </div>
      <PasswordForm />
    </div>
  );
}
