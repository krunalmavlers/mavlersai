import Link from 'next/link';
import { adminCounts } from '@/lib/adminQueries';
import { PageHeader, Card } from '@/components/admin/ui';

export default async function Dashboard() {
  const counts = await adminCounts();
  const cards = [
    { label: 'Pages', value: counts.pages, href: '/admin/pages' },
    { label: 'Posts', value: counts.posts, href: '/admin/posts' },
    { label: 'Menu items', value: counts.menu_items, href: '/admin/menus' },
    { label: 'Forms', value: counts.forms, href: '/admin/forms' },
    { label: 'Submissions', value: counts.form_submissions, href: '/admin/submissions' },
  ];
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Manage every part of the Mavlers.ai website." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-colors hover:border-brand/40">
              <div className="font-display text-[32px] font-bold text-brand-ink">{c.value}</div>
              <div className="mt-1 text-[13px] text-body-faint">{c.label}</div>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Card>
          <h2 className="m-0 mb-2 font-display text-[16px] font-bold text-black">Quick start</h2>
          <ul className="m-0 list-disc pl-5 text-[14px] leading-relaxed text-body-faint">
            <li>Edit page content and sections in <Link href="/admin/pages" className="text-brand-ink">Pages</Link>.</li>
            <li>Write blog posts &amp; case studies in <Link href="/admin/posts" className="text-brand-ink">Insights &amp; Implementations</Link>.</li>
            <li>Add tracking (GA/GTM/Pixel) and SEO defaults in <Link href="/admin/settings" className="text-brand-ink">Settings</Link>.</li>
            <li>Manage header/footer navigation in <Link href="/admin/menus" className="text-brand-ink">Menus</Link>.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
