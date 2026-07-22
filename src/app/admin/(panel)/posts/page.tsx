import Link from 'next/link';
import { adminListPosts } from '@/lib/adminQueries';
import { PageHeader, Card } from '@/components/admin/ui';

export default async function PostsList() {
  const posts = await adminListPosts();
  return (
    <div>
      <PageHeader
        title="Insights & Implementations"
        subtitle="Blog posts and case studies — tag into multiple categories."
        action={
          <div className="flex gap-2">
            <Link href="/admin/posts/new?type=insight" className="rounded-[10px] bg-brand px-4 py-2.5 text-[14px] font-bold text-ink hover:bg-brand-300">
              + Insight
            </Link>
            <Link href="/admin/posts/new?type=implementation" className="rounded-[10px] border border-surface-line2 bg-white px-4 py-2.5 text-[14px] font-bold text-body hover:bg-black/5">
              + Implementation
            </Link>
          </div>
        }
      />
      <Card className="p-0">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-surface-line2 text-[12px] uppercase tracking-wide text-body-dim">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => (
              <tr key={p.id} className="border-b border-surface-line2 last:border-0">
                <td className="p-4 font-semibold text-black">
                  {p.title} {p.is_featured && <span className="ml-1 text-brand-ink">★</span>}
                </td>
                <td className="p-4 text-body-faint">{p.content_type}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      p.status === 'published' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-surface-tint2 text-body-faint'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/posts/${p.id}`} className="font-semibold text-brand-ink">
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
