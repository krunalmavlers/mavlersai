import { adminListCategories, adminListTags } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { TaxonomyManager } from '@/components/admin/TaxonomyManager';

export default async function TaxonomiesPage() {
  const [categories, tags] = await Promise.all([adminListCategories(), adminListTags()]);
  return (
    <div>
      <PageHeader title="Categories & Tags" subtitle="Taxonomies for insights and implementations." />
      <TaxonomyManager categories={categories} tags={tags} />
    </div>
  );
}
