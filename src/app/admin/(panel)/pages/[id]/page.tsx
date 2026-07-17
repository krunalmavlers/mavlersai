import { notFound } from 'next/navigation';
import { adminGetPage } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { PageEditor } from '@/components/admin/PageEditor';
import { SectionManager } from '@/components/admin/SectionManager';
import type { Page, PageSection } from '@/lib/types';

const EMPTY_PAGE: Partial<Page> = {
  slug: '',
  title: '',
  seo_title: '',
  meta_description: '',
  meta_keywords: '',
  og_image: '',
  canonical_url: '',
  robots: 'index,follow',
  schema_jsonld: {},
  status: 'draft',
  sort_order: 0,
};

export default async function PageEdit({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new';
  let page: (Page & { sections: PageSection[] }) | null = null;
  if (!isNew) {
    page = await adminGetPage(params.id);
    if (!page) notFound();
  }
  const data = page ?? (EMPTY_PAGE as any);

  return (
    <div>
      <PageHeader title={isNew ? 'New page' : `Edit: ${data.title || data.slug}`} subtitle="Content, SEO, schema and URL slug." />
      <PageEditor page={data} isNew={isNew} />
      {!isNew && page && <SectionManager pageId={page.id} sections={page.sections} />}
    </div>
  );
}
