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
            <Link href="/admin/posts/new?type=implementation" className="rounded-[10px] border border-white/16 bg-white/5 px-4 py-2.5 text-[14px] font-bold text-body hover:bg-white/10">
              + Implementation
            </Link>
          </div>
        }
      />
      <Card className="p-0">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-white/9 text-[12px] uppercase tracking-wide text-body-dim">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p: any) => (
              <tr key={p.id} className="border-b border-white/6 last:border-0">
                <td className="p-4 font-semibold text-white">
                  {p.title} {p.is_featured && <span className="ml-1 text-brand">★</span>}
                </td>
                <td className="p-4 text-body-faint">{p.content_type}</td>
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
                  <Link href={`/admin/posts/${p.id}`} className="font-semibold text-brand">
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
