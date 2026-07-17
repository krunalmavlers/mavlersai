// Shared domain types (mirrors the DB schema in supabase/migrations/0001_init.sql).

export type Status = 'draft' | 'published';
export type ContentType = 'insight' | 'implementation';
export type Taxonomy = 'category' | 'industry' | 'lifecycle';

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  default_meta_title: string;
  default_meta_description: string;
  default_og_image: string;
  header_scripts: string;
  body_start_scripts: string;
  footer_scripts: string;
  ga_id: string;
  gtm_id: string;
  fb_pixel_id: string;
  social_links: { label: string; url: string; platform?: string }[];
  contact: { emails?: string[]; phones?: { region: string; number: string }[] };
  recaptcha_site_key: string;
  recaptcha_threshold: number;
  url_config: { implementations_base: string; insights_base: string };
  organization_schema: Record<string, unknown>;
  robots_txt: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  template: string;
  seo_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  canonical_url: string;
  robots: string;
  schema_jsonld: Record<string, unknown>;
  status: Status;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  type: string;
  sort_order: number;
  is_visible: boolean;
  content: Record<string, any>;
}

export interface MenuItem {
  id: string;
  location: 'header' | 'footer' | 'footer_legal' | 'utility';
  parent_id: string | null;
  group_label: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
  sort_order: number;
  is_visible: boolean;
}

export interface Author {
  id: string;
  name: string;
  initials: string;
  bio: string;
  avatar_url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  taxonomy: Taxonomy;
  content_type: ContentType | 'both';
  description: string;
  sort_order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  content_type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  body_html: string;
  meta: {
    type?: string;
    stack?: string[];
    result_headline?: string;
    client_context?: string;
    metrics?: { value: string; label: string }[];
    challenge?: string[];
    architecture?: string[];
    delivered?: string[];
    related?: string[];
  };
  author_id: string | null;
  reading_time: string;
  is_featured: boolean;
  status: Status;
  published_at: string | null;
  seo_title: string;
  meta_description: string;
  og_image: string;
  canonical_url: string;
  robots: string;
  schema_jsonld: Record<string, unknown>;
  // joined
  author?: Author | null;
  categories?: Category[];
  tags?: Tag[];
}

export interface FormField {
  id: string;
  form_id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'file' | 'hidden';
  placeholder: string;
  help_text: string;
  options: string[];
  required: boolean;
  sort_order: number;
  col_span: 1 | 2;
  conditional: { field?: string; equals?: string };
}

export interface FormMode {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  submit: string;
  kind: string;
}

export interface FormDef {
  id: string;
  key: string;
  name: string;
  title: string;
  description: string;
  submit_label: string;
  success_message: string;
  recipient_emails: string[];
  recaptcha_enabled: boolean;
  settings: {
    modes?: FormMode[];
    helper_text?: string;
    consent?: { name: string; label: string; required?: boolean }[];
    next_steps?: { title: string; body: string }[];
    calendly?: { url?: string; modes?: string[]; heading?: string; note?: string };
  };
  fields?: FormField[];
}
