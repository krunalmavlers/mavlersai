import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { adminListUsers } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { UsersManager } from '@/components/admin/UsersManager';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (admin.role !== 'admin') redirect('/admin');

  const users = await adminListUsers();
  return (
    <div>
      <PageHeader title="Users" subtitle="Manage who can access the back office and what they can do." />
      <UsersManager users={users} currentUserId={admin.id} />
    </div>
  );
}
