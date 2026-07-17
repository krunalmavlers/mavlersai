import { notFound } from 'next/navigation';
import { adminGetPost, adminListCategories, adminListTags, adminListAuthors } from '@/lib/adminQueries';
import { PageHeader } from '@/components/admin/ui';
import { PostEditor } from '@/components/admin/PostEditor';

export default async function PostEdit({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  const isNew = params.id === 'new';
  const [categories, tags, authors] = await Promise.all([
    adminListCategories(),
    adminListTags(),
    adminListAuthors(),
  ]);

  let post: any;
  if (isNew) {
    post = {
      content_type: searchParams.type === 'implementation' ? 'implementation' : 'insight',
      title: '',
      slug: '',
      excerpt: '',
      cover_image: '',
      body_html: '',
      meta: {},
      author_id: authors[0]?.id || null,
      reading_time: '',
      is_featured: false,
      status: 'draft',
      published_at: null,
      seo_title: '',
      meta_description: '',
      og_image: '',
      canonical_url: '',
      robots: 'index,follow',
      schema_jsonld: {},
      category_ids: [],
      tag_ids: [],
    };
  } else {
    post = await adminGetPost(params.id);
    if (!post) notFound();
  }

  return (
    <div>
      <PageHeader
        title={isNew ? `New ${post.content_type}` : `Edit: ${post.title}`}
        subtitle="Content, categories, tags, SEO and schema."
      />
      <PostEditor post={post} isNew={isNew} categories={categories} tags={tags} authors={authors} />
    </div>
  );
}
