import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  Author,
  Category,
  ContentType,
  FormDef,
  MenuItem,
  Page,
  PageSection,
  Post,
  SiteSettings,
} from '@/lib/types';

// Sensible defaults so the site still renders before the DB is seeded.
const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  site_name: 'Mavlers.ai',
  tagline: '',
  logo_url: '',
  favicon_url: '',
  default_meta_title: 'Mavlers.ai',
  default_meta_description: '',
  default_og_image: '',
  header_scripts: '',
  body_start_scripts: '',
  footer_scripts: '',
  ga_id: '',
  gtm_id: '',
  fb_pixel_id: '',
  social_links: [],
  contact: {},
  recaptcha_site_key: '',
  recaptcha_threshold: 0.5,
  url_config: { implementations_base: 'implementations', insights_base: 'insights' },
  organization_schema: {},
  robots_txt: '',
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  return { ...FALLBACK_SETTINGS, ...(data ?? {}) } as SiteSettings;
});

export const getMenu = cache(async (location: MenuItem['location']): Promise<MenuItem[]> => {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .eq('location', location)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });
  return (data ?? []) as MenuItem[];
});

export const getPageBySlug = cache(
  async (slug: string): Promise<(Page & { sections: PageSection[] }) | null> => {
    const supabase = createSupabaseServerClient();
    const { data: page } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (!page) return null;
    const { data: sections } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', page.id)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });
    return { ...(page as Page), sections: (sections ?? []) as PageSection[] };
  },
);

const POST_SELECT =
  '*, author:authors(*), post_categories(category:categories(*)), post_tags(tag:tags(*))';

function shapePost(row: any): Post {
  return {
    ...row,
    author: row.author ?? null,
    categories: (row.post_categories ?? []).map((pc: any) => pc.category).filter(Boolean),
    tags: (row.post_tags ?? []).map((pt: any) => pt.tag).filter(Boolean),
  } as Post;
}

export const getPosts = cache(async (contentType: ContentType): Promise<Post[]> => {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('content_type', contentType)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return (data ?? []).map(shapePost);
});

export const getPostBySlug = cache(
  async (contentType: ContentType, slug: string): Promise<Post | null> => {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('content_type', contentType)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    return data ? shapePost(data) : null;
  },
);

export const getCategories = cache(
  async (taxonomy?: Category['taxonomy']): Promise<Category[]> => {
    const supabase = createSupabaseServerClient();
    let q = supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (taxonomy) q = q.eq('taxonomy', taxonomy);
    const { data } = await q;
    return (data ?? []) as Category[];
  },
);

export const getForm = cache(async (key: string): Promise<FormDef | null> => {
  const supabase = createSupabaseServerClient();
  const { data: form } = await supabase.from('forms').select('*').eq('key', key).maybeSingle();
  if (!form) return null;
  const { data: fields } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', form.id)
    .order('sort_order', { ascending: true });
  return { ...(form as FormDef), fields: (fields ?? []) as FormDef['fields'] };
});

export async function getAuthor(id: string | null): Promise<Author | null> {
  if (!id) return null;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('authors').select('*').eq('id', id).maybeSingle();
  return (data as Author) ?? null;
}
