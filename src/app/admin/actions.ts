'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return createSupabaseAdminClient();
}

function revalidateSite() {
  // Public site is dynamic, but revalidate the common trees to be safe.
  revalidatePath('/', 'layout');
}

/* ------------------------------- PAGES ---------------------------------- */
export async function savePage(payload: any) {
  const db = await requireAdmin();
  const row = {
    slug: payload.slug ?? '',
    title: payload.title ?? '',
    seo_title: payload.seo_title ?? '',
    meta_description: payload.meta_description ?? '',
    meta_keywords: payload.meta_keywords ?? '',
    og_image: payload.og_image ?? '',
    canonical_url: payload.canonical_url ?? '',
    robots: payload.robots ?? 'index,follow',
    schema_jsonld: safeJson(payload.schema_jsonld, {}),
    status: payload.status ?? 'draft',
    sort_order: Number(payload.sort_order ?? 0),
  };
  if (payload.id) {
    await db.from('pages').update(row).eq('id', payload.id);
  } else {
    const { data } = await db.from('pages').insert(row).select('id').single();
    revalidateSite();
    redirect(`/admin/pages/${data!.id}`);
  }
  revalidateSite();
}

export async function deletePage(id: string) {
  const db = await requireAdmin();
  await db.from('pages').delete().eq('id', id);
  revalidateSite();
  redirect('/admin/pages');
}

/* ------------------------------ SECTIONS -------------------------------- */
export async function saveSection(payload: any) {
  const db = await requireAdmin();
  const row = {
    page_id: payload.page_id,
    type: payload.type,
    sort_order: Number(payload.sort_order ?? 0),
    is_visible: payload.is_visible ?? true,
    content: safeJson(payload.content, {}),
  };
  if (payload.id) {
    await db.from('page_sections').update(row).eq('id', payload.id);
  } else {
    await db.from('page_sections').insert(row);
  }
  revalidateSite();
  revalidatePath(`/admin/pages/${payload.page_id}`);
}

export async function deleteSection(id: string, pageId: string) {
  const db = await requireAdmin();
  await db.from('page_sections').delete().eq('id', id);
  revalidateSite();
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function reorderSection(id: string, pageId: string, sortOrder: number) {
  const db = await requireAdmin();
  await db.from('page_sections').update({ sort_order: sortOrder }).eq('id', id);
  revalidateSite();
  revalidatePath(`/admin/pages/${pageId}`);
}

/* ------------------------------- POSTS ---------------------------------- */
export async function savePost(payload: any) {
  const db = await requireAdmin();
  const row = {
    content_type: payload.content_type,
    title: payload.title ?? '',
    slug: payload.slug ?? '',
    excerpt: payload.excerpt ?? '',
    cover_image: payload.cover_image ?? '',
    body_html: payload.body_html ?? '',
    meta: safeJson(payload.meta, {}),
    author_id: payload.author_id || null,
    reading_time: payload.reading_time ?? '',
    is_featured: !!payload.is_featured,
    status: payload.status ?? 'draft',
    published_at: payload.published_at || null,
    seo_title: payload.seo_title ?? '',
    meta_description: payload.meta_description ?? '',
    og_image: payload.og_image ?? '',
    canonical_url: payload.canonical_url ?? '',
    robots: payload.robots ?? 'index,follow',
    schema_jsonld: safeJson(payload.schema_jsonld, {}),
  };
  let postId = payload.id as string | undefined;
  if (postId) {
    await db.from('posts').update(row).eq('id', postId);
  } else {
    const { data } = await db.from('posts').insert(row).select('id').single();
    postId = data!.id;
  }

  // Sync categories + tags (arrays of ids).
  if (Array.isArray(payload.category_ids)) {
    await db.from('post_categories').delete().eq('post_id', postId);
    if (payload.category_ids.length)
      await db
        .from('post_categories')
        .insert(payload.category_ids.map((cid: string) => ({ post_id: postId, category_id: cid })));
  }
  if (Array.isArray(payload.tag_ids)) {
    await db.from('post_tags').delete().eq('post_id', postId);
    if (payload.tag_ids.length)
      await db
        .from('post_tags')
        .insert(payload.tag_ids.map((tid: string) => ({ post_id: postId, tag_id: tid })));
  }

  revalidateSite();
  if (!payload.id) redirect(`/admin/posts/${postId}`);
}

export async function deletePost(id: string) {
  const db = await requireAdmin();
  await db.from('posts').delete().eq('id', id);
  revalidateSite();
  redirect('/admin/posts');
}

/* ---------------------------- TAXONOMIES -------------------------------- */
export async function saveCategory(payload: any) {
  const db = await requireAdmin();
  const row = {
    name: payload.name,
    slug: payload.slug,
    taxonomy: payload.taxonomy ?? 'category',
    content_type: payload.content_type ?? 'insight',
    description: payload.description ?? '',
    sort_order: Number(payload.sort_order ?? 0),
  };
  if (payload.id) await db.from('categories').update(row).eq('id', payload.id);
  else await db.from('categories').insert(row);
  revalidateSite();
  revalidatePath('/admin/taxonomies');
}
export async function deleteCategory(id: string) {
  const db = await requireAdmin();
  await db.from('categories').delete().eq('id', id);
  revalidateSite();
  revalidatePath('/admin/taxonomies');
}
export async function saveTag(payload: any) {
  const db = await requireAdmin();
  const row = { name: payload.name, slug: payload.slug };
  if (payload.id) await db.from('tags').update(row).eq('id', payload.id);
  else await db.from('tags').insert(row);
  revalidateSite();
  revalidatePath('/admin/taxonomies');
}
export async function deleteTag(id: string) {
  const db = await requireAdmin();
  await db.from('tags').delete().eq('id', id);
  revalidateSite();
  revalidatePath('/admin/taxonomies');
}

/* ------------------------------- MENUS ---------------------------------- */
export async function saveMenuItem(payload: any) {
  const db = await requireAdmin();
  const row = {
    location: payload.location,
    group_label: payload.group_label ?? '',
    label: payload.label,
    url: payload.url ?? '#',
    target: payload.target ?? '_self',
    sort_order: Number(payload.sort_order ?? 0),
    is_visible: payload.is_visible ?? true,
  };
  if (payload.id) await db.from('menu_items').update(row).eq('id', payload.id);
  else await db.from('menu_items').insert(row);
  revalidateSite();
  revalidatePath('/admin/menus');
}
export async function deleteMenuItem(id: string) {
  const db = await requireAdmin();
  await db.from('menu_items').delete().eq('id', id);
  revalidateSite();
  revalidatePath('/admin/menus');
}

/* ------------------------------- FORMS ---------------------------------- */
export async function saveForm(payload: any) {
  const db = await requireAdmin();
  const row = {
    key: payload.key,
    name: payload.name,
    title: payload.title ?? '',
    description: payload.description ?? '',
    submit_label: payload.submit_label ?? 'Submit',
    success_message: payload.success_message ?? '',
    recipient_emails: parseEmails(payload.recipient_emails),
    recaptcha_enabled: !!payload.recaptcha_enabled,
    settings: safeJson(payload.settings, {}),
  };
  if (payload.id) await db.from('forms').update(row).eq('id', payload.id);
  else await db.from('forms').insert(row);
  revalidatePath('/admin/forms');
  if (payload.id) revalidatePath(`/admin/forms/${payload.id}`);
  revalidateSite();
}

export async function saveFormFields(formId: string, fields: any[]) {
  const db = await requireAdmin();
  await db.from('form_fields').delete().eq('form_id', formId);
  if (fields.length) {
    await db.from('form_fields').insert(
      fields.map((f, i) => ({
        form_id: formId,
        name: f.name,
        label: f.label ?? '',
        type: f.type ?? 'text',
        placeholder: f.placeholder ?? '',
        help_text: f.help_text ?? '',
        options: Array.isArray(f.options) ? f.options : [],
        required: !!f.required,
        sort_order: Number(f.sort_order ?? i),
        col_span: f.col_span === 2 ? 2 : 1,
        conditional: f.conditional ?? {},
      })),
    );
  }
  revalidatePath(`/admin/forms/${formId}`);
  revalidateSite();
}

export async function updateSubmissionStatus(id: string, status: string) {
  const db = await requireAdmin();
  await db.from('form_submissions').update({ status }).eq('id', id);
  revalidatePath('/admin/submissions');
}
export async function deleteSubmission(id: string) {
  const db = await requireAdmin();
  await db.from('form_submissions').delete().eq('id', id);
  revalidatePath('/admin/submissions');
}

/* ------------------------------ SETTINGS -------------------------------- */
export async function saveSettings(payload: any) {
  const db = await requireAdmin();
  const row = {
    id: 1,
    site_name: payload.site_name,
    tagline: payload.tagline ?? '',
    logo_url: payload.logo_url ?? '',
    favicon_url: payload.favicon_url ?? '',
    default_meta_title: payload.default_meta_title ?? '',
    default_meta_description: payload.default_meta_description ?? '',
    default_og_image: payload.default_og_image ?? '',
    header_scripts: payload.header_scripts ?? '',
    body_start_scripts: payload.body_start_scripts ?? '',
    footer_scripts: payload.footer_scripts ?? '',
    ga_id: payload.ga_id ?? '',
    gtm_id: payload.gtm_id ?? '',
    fb_pixel_id: payload.fb_pixel_id ?? '',
    social_links: safeJson(payload.social_links, []),
    contact: safeJson(payload.contact, {}),
    recaptcha_site_key: payload.recaptcha_site_key ?? '',
    recaptcha_threshold: Number(payload.recaptcha_threshold ?? 0.5),
    url_config: safeJson(payload.url_config, {}),
    organization_schema: safeJson(payload.organization_schema, {}),
    robots_txt: payload.robots_txt ?? '',
  };
  await db.from('site_settings').upsert(row, { onConflict: 'id' });
  revalidateSite();
  revalidatePath('/admin/settings');
}

/* ------------------------------ helpers --------------------------------- */
function safeJson(value: any, fallback: any) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
function parseEmails(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string')
    return value
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}
