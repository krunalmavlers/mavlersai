import { adminListMenu } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { MenusManager } from '@/components/admin/MenusManager';

export default async function MenusPage() {
  const items = await adminListMenu();
  return (
    <div>
      <PageHeader title="Menus" subtitle="Header, footer, footer legal and the utility bar." />
      <MenusManager items={items} />
    </div>
  );
}
