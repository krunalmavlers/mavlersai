import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { PageHeader } from '@/components/admin/ui';
import { MediaUploader } from '@/components/admin/MediaUploader';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div>
      <PageHeader
        title="Media"
        subtitle="Upload images and PDFs and copy their public URL (served from /images on your own domain)."
      />
      <MediaUploader />
    </div>
  );
}
