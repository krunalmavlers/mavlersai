import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Category, FormDef, MenuItem, Page, PageSection, Post, SiteSettings, Tag } from '@/lib/types';

// Admin reads use the service role so drafts are visible too.

export async function adminListPages(): Promise<Page[]> {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('pages').select('*').order('sort_order');
  return (data ?? []) as Page[];
}

export async function adminGetPage(id: string): Promise<(Page & { sections: PageSection[] }) | null> {
  const db = createSupabaseAdminClient();
  const { data: page } = await db.from('pages').select('*').eq('id', id).maybeSingle();
  if (!page) return null;
  const { data: sections } = await db
    .from('page_sections')
    .select('*')
    .eq('page_id', id)
    .order('sort_order');
  return { ...(page as Page), sections: (sections ?? []) as PageSection[] };
}

export async function adminListPosts(): Promise<Post[]> {
  const db = createSupabaseAdminClient();
  const { data } = await db
    .from('posts')
    .select('*, post_categories(category_id), post_tags(tag_id)')
    .order('published_at', { ascending: false, nullsFirst: false });
  return (data ?? []).map((r: any) => ({
    ...r,
    categories: [],
    category_ids: (r.post_categories ?? []).map((x: any) => x.category_id),
    tag_ids: (r.post_tags ?? []).map((x: any) => x.tag_id),
  })) as any;
}

export async function adminGetPost(id: string): Promise<any | null> {
  const db = createSupabaseAdminClient();
  const { data } = await db
    .from('posts')
    .select('*, post_categories(category_id), post_tags(tag_id)')
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  return {
    ...data,
    category_ids: (data.post_categories ?? []).map((x: any) => x.category_id),
    tag_ids: (data.post_tags ?? []).map((x: any) => x.tag_id),
  };
}

export async function adminListCategories(): Promise<Category[]> {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('categories').select('*').order('taxonomy').order('sort_order');
  return (data ?? []) as Category[];
}

export async function adminListTags(): Promise<Tag[]> {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('tags').select('*').order('name');
  return (data ?? []) as Tag[];
}

export async function adminListAuthors() {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('authors').select('*').order('name');
  return data ?? [];
}

export async function adminListMenu(): Promise<MenuItem[]> {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('menu_items').select('*').order('location').order('sort_order');
  return (data ?? []) as MenuItem[];
}

export async function adminListForms(): Promise<FormDef[]> {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('forms').select('*').order('name');
  return (data ?? []) as FormDef[];
}

export async function adminGetForm(id: string): Promise<FormDef | null> {
  const db = createSupabaseAdminClient();
  const { data: form } = await db.from('forms').select('*').eq('id', id).maybeSingle();
  if (!form) return null;
  const { data: fields } = await db
    .from('form_fields')
    .select('*')
    .eq('form_id', id)
    .order('sort_order');
  return { ...(form as FormDef), fields: (fields ?? []) as FormDef['fields'] };
}

export async function adminListSubmissions() {
  const db = createSupabaseAdminClient();
  const { data } = await db
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  return data ?? [];
}

export async function adminGetSettings(): Promise<SiteSettings | null> {
  const db = createSupabaseAdminClient();
  const { data } = await db.from('site_settings').select('*').eq('id', 1).maybeSingle();
  return (data as SiteSettings) ?? null;
}

export interface AdminUserRow {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor';
  created_at: string | null;
}

export async function adminListUsers(): Promise<AdminUserRow[]> {
  const db = createSupabaseAdminClient();
  const { data: profiles } = await db
    .from('admin_profiles')
    .select('user_id, full_name, role, created_at')
    .order('created_at');
  const { data: authData } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailById = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? '']));
  return (profiles ?? []).map((p: any) => ({
    id: p.user_id,
    email: emailById.get(p.user_id) ?? '',
    full_name: p.full_name ?? '',
    role: p.role,
    created_at: p.created_at ?? null,
  }));
}

export async function adminCounts() {
  const db = createSupabaseAdminClient();
  const tables = ['pages', 'posts', 'menu_items', 'forms', 'form_submissions'] as const;
  const out: Record<string, number> = {};
  await Promise.all(
    tables.map(async (t) => {
      const { count } = await db.from(t).select('*', { count: 'exact', head: true });
      out[t] = count ?? 0;
    }),
  );
  return out;
}
