import Link from 'next/link';
import { adminListPages } from '@/lib/adminQueries';
import { PageHeader, Card, LinkButton } from '@/components/admin/ui';

export default async function PagesList() {
  const pages = await adminListPages();
  return (
    <div>
      <PageHeader
        title="Pages"
        subtitle="CMS pages, their sections, SEO and URL slugs."
        action={<LinkButton href="/admin/pages/new">+ New page</LinkButton>}
      />
      <Card className="p-0">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-white/9 text-[12px] uppercase tracking-wide text-body-dim">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-white/6 last:border-0">
                <td className="p-4 font-semibold text-white">{p.title || '(untitled)'}</td>
                <td className="p-4 text-body-faint">/{p.slug}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      p.status === 'published' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-body-faint'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/pages/${p.id}`} className="font-semibold text-brand">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
