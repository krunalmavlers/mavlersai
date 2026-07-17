-- ============================================================================
-- Mavlers.ai — Initial schema
-- Postgres / Supabase. Run this first, then 0002_seed.sql.
--
-- Model:
--   * Public/anon may READ published content only (RLS SELECT policies below).
--   * All mutations + draft reads happen server-side with the SERVICE ROLE key,
--     which bypasses RLS. So we intentionally do NOT add write policies for anon.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- SITE SETTINGS (singleton row, id = 1)
-- ===========================================================================
create table public.site_settings (
  id                  int primary key default 1,
  site_name           text not null default 'Mavlers.ai',
  tagline             text default '',
  logo_url            text default '',           -- empty => render SVG wordmark
  favicon_url         text default '',

  -- Default SEO (fallbacks when a page leaves a field blank)
  default_meta_title  text default 'Mavlers.ai',
  default_meta_description text default '',
  default_og_image    text default '',

  -- Third-party scripts (raw HTML/JS injected into the document)
  header_scripts      text default '',           -- end of <head>
  body_start_scripts  text default '',           -- immediately after <body>
  footer_scripts      text default '',           -- end of <body>
  ga_id               text default '',           -- e.g. G-XXXXXXXXXX
  gtm_id              text default '',           -- e.g. GTM-XXXXXXX
  fb_pixel_id         text default '',           -- Facebook Pixel ID

  social_links        jsonb not null default '[]'::jsonb,  -- [{label,url}]
  contact             jsonb not null default '{}'::jsonb,  -- {emails:[],phones:[{region,number}]}

  recaptcha_site_key  text default '',           -- public site key (v3)
  recaptcha_threshold numeric not null default 0.5,

  url_config          jsonb not null default '{"implementations_base":"implementations","insights_base":"insights"}'::jsonb,
  organization_schema jsonb not null default '{}'::jsonb,  -- JSON-LD injected site-wide
  robots_txt          text default '',

  updated_at          timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- PAGES  (CMS-managed static pages: home, about, services, mvp, governance, ...)
-- ===========================================================================
create table public.pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,          -- '' or '/' means home
  title            text not null default '',
  template         text not null default 'default',
  seo_title        text default '',
  meta_description text default '',
  meta_keywords    text default '',
  og_image         text default '',
  canonical_url    text default '',
  robots           text not null default 'index,follow',
  schema_jsonld    jsonb not null default '{}'::jsonb,   -- per-page JSON-LD
  status           text not null default 'draft' check (status in ('draft','published')),
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_pages_updated before update on public.pages
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- PAGE SECTIONS  (ordered, typed content blocks; content is flexible jsonb)
-- ===========================================================================
create table public.page_sections (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references public.pages(id) on delete cascade,
  type        text not null,                       -- hero | stats_bar | rich_text | form | ...
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  content     jsonb not null default '{}'::jsonb,  -- section-specific fields (+ WYSIWYG html)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_page_sections_page on public.page_sections(page_id, sort_order);
create trigger trg_page_sections_updated before update on public.page_sections
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- MENUS  (header + footer, hierarchical, footer columns via group_label)
-- ===========================================================================
create table public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  location    text not null check (location in ('header','footer','footer_legal','utility')),
  parent_id   uuid references public.menu_items(id) on delete cascade,
  group_label text default '',                     -- footer column heading
  label       text not null,
  url         text not null default '#',
  target      text not null default '_self' check (target in ('_self','_blank')),
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_menu_items_loc on public.menu_items(location, sort_order);
create trigger trg_menu_items_updated before update on public.menu_items
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- AUTHORS
-- ===========================================================================
create table public.authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  initials   text default '',
  bio        text default '',
  avatar_url text default '',
  created_at timestamptz not null default now()
);

-- ===========================================================================
-- POSTS  (unified: insights [blog] + implementations [case studies])
-- ===========================================================================
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  content_type  text not null check (content_type in ('insight','implementation')),
  title         text not null,
  slug          text not null,
  excerpt       text default '',                   -- excerpt / dek
  cover_image   text default '',
  body_html     text default '',                   -- WYSIWYG main content
  meta          jsonb not null default '{}'::jsonb,-- implementation extras (metrics/architecture/etc.)
  author_id     uuid references public.authors(id) on delete set null,
  reading_time  text default '',
  is_featured   boolean not null default false,
  status        text not null default 'draft' check (status in ('draft','published')),
  published_at  timestamptz,

  -- SEO
  seo_title        text default '',
  meta_description text default '',
  og_image         text default '',
  canonical_url    text default '',
  robots           text not null default 'index,follow',
  schema_jsonld    jsonb not null default '{}'::jsonb,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (content_type, slug)
);
create index idx_posts_type_status on public.posts(content_type, status, published_at desc);
create trigger trg_posts_updated before update on public.posts
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- TAXONOMIES  (categories with taxonomy kind; tags free-form)
-- ===========================================================================
create table public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null,
  taxonomy     text not null default 'category'
                 check (taxonomy in ('category','industry','lifecycle')),
  content_type text not null default 'insight'
                 check (content_type in ('insight','implementation','both')),
  description  text default '',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  unique (taxonomy, slug)
);

create table public.post_categories (
  post_id     uuid not null references public.posts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create table public.tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ===========================================================================
-- FORMS  (dynamic, DB-driven; renders + validates from these rows)
-- ===========================================================================
create table public.forms (
  id               uuid primary key default gen_random_uuid(),
  key              text not null unique,            -- e.g. 'book-a-call'
  name             text not null,
  title            text default '',
  description      text default '',
  submit_label     text not null default 'Submit',
  success_message  text not null default 'Thanks — we got it.',
  recipient_emails text[] not null default '{}',
  recaptcha_enabled boolean not null default true,
  settings         jsonb not null default '{}'::jsonb,  -- {modes, consent[], helper_text, side_panel}
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_forms_updated before update on public.forms
  for each row execute function public.set_updated_at();

create table public.form_fields (
  id          uuid primary key default gen_random_uuid(),
  form_id     uuid not null references public.forms(id) on delete cascade,
  name        text not null,                        -- machine name (data key)
  label       text not null default '',
  type        text not null default 'text'
                check (type in ('text','email','tel','url','textarea','select','checkbox','file','hidden')),
  placeholder text default '',
  help_text   text default '',
  options     jsonb not null default '[]'::jsonb,   -- ["Opt A", ...] for select
  required    boolean not null default false,
  sort_order  int not null default 0,
  col_span    int not null default 1 check (col_span in (1,2)),
  conditional jsonb not null default '{}'::jsonb,   -- {field, equals} — show when matched
  created_at  timestamptz not null default now()
);
create index idx_form_fields_form on public.form_fields(form_id, sort_order);

create table public.form_submissions (
  id              uuid primary key default gen_random_uuid(),
  form_id         uuid references public.forms(id) on delete set null,
  form_key        text default '',
  data            jsonb not null default '{}'::jsonb,
  recaptcha_score numeric,
  ip_address      text default '',
  user_agent      text default '',
  status          text not null default 'new' check (status in ('new','read','spam','archived')),
  created_at      timestamptz not null default now()
);
create index idx_form_submissions_form on public.form_submissions(form_id, created_at desc);

-- ===========================================================================
-- ADMIN PROFILES  (an authenticated user listed here is an admin)
-- ===========================================================================
create table public.admin_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text default '',
  role       text not null default 'admin' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid());
$$;

-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================
alter table public.site_settings   enable row level security;
alter table public.pages           enable row level security;
alter table public.page_sections   enable row level security;
alter table public.menu_items      enable row level security;
alter table public.authors         enable row level security;
alter table public.posts           enable row level security;
alter table public.categories      enable row level security;
alter table public.post_categories enable row level security;
alter table public.tags            enable row level security;
alter table public.post_tags       enable row level security;
alter table public.forms           enable row level security;
alter table public.form_fields     enable row level security;
alter table public.form_submissions enable row level security;
alter table public.admin_profiles  enable row level security;

-- Public READ (anon + authenticated). Mutations use the service role (bypasses RLS).
create policy p_settings_read on public.site_settings for select using (true);

create policy p_pages_read on public.pages for select
  using (status = 'published');

create policy p_sections_read on public.page_sections for select
  using (is_visible and exists (
    select 1 from public.pages p where p.id = page_sections.page_id and p.status = 'published'
  ));

create policy p_menu_read on public.menu_items for select
  using (is_visible);

create policy p_authors_read on public.authors for select using (true);

create policy p_posts_read on public.posts for select
  using (status = 'published' and (published_at is null or published_at <= now()));

create policy p_categories_read on public.categories for select using (true);
create policy p_tags_read       on public.tags       for select using (true);
create policy p_postcat_read    on public.post_categories for select using (true);
create policy p_posttag_read    on public.post_tags       for select using (true);

create policy p_forms_read      on public.forms       for select using (true);
create policy p_formfields_read on public.form_fields  for select using (true);

-- form_submissions: NO anon policy → default deny. Inserts/reads via service role.

-- admin_profiles: a signed-in user may read their own row (used by the admin guard).
create policy p_admin_self on public.admin_profiles for select
  using (user_id = auth.uid());

-- ===========================================================================
-- STORAGE buckets  (public media for images; private uploads for form files)
-- ===========================================================================
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('uploads', 'uploads', false)
  on conflict (id) do nothing;

-- Anyone can read public media; writes via service role only.
create policy p_media_read on storage.objects for select
  using (bucket_id = 'media');
