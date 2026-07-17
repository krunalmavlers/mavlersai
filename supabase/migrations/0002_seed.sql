-- ============================================================================
-- Mavlers.ai — Seed data (real design copy from the Design Brief)
-- Run AFTER 0001_init.sql. Idempotent-ish: safe to re-run (uses upserts/deletes).
-- ============================================================================

-- Clean slate for content tables (keeps admin_profiles + submissions).
truncate table public.post_categories, public.post_tags cascade;
delete from public.posts;
delete from public.tags;
delete from public.categories;
delete from public.form_fields;
delete from public.forms;
delete from public.page_sections;
delete from public.pages;
delete from public.menu_items;
delete from public.authors;

-- ===========================================================================
-- SITE SETTINGS
-- ===========================================================================
insert into public.site_settings (id, site_name, tagline, default_meta_title, default_meta_description, social_links, contact, url_config, organization_schema)
values (
  1,
  'Mavlers.ai',
  'The white-label AI & automation delivery partner for digital, marketing and technology agencies.',
  'Mavlers.ai — White-label AI & Automation Engineering',
  'Mavlers.ai is the engineering team behind agencies and brands. We architect, build, integrate and scale production-grade AI and automation — under your brand.',
  $json$[{"platform":"linkedin","label":"LinkedIn","url":"https://www.linkedin.com/"},{"platform":"youtube","label":"YouTube","url":"https://www.youtube.com/"}]$json$::jsonb,
  $json${"emails":["hello@mavlers.ai"],"phones":[{"region":"UK","number":"+44 20 0000 0000"},{"region":"US","number":"+1 000 000 0000"},{"region":"AUS","number":"+61 0 0000 0000"}]}$json$::jsonb,
  $json${"implementations_base":"implementations","insights_base":"insights"}$json$::jsonb,
  $json${"@context":"https://schema.org","@type":"Organization","name":"Mavlers.ai","description":"White-label AI & automation delivery partner for agencies and brands.","url":"https://mavlers.ai"}$json$::jsonb
)
on conflict (id) do update set
  site_name = excluded.site_name,
  tagline = excluded.tagline,
  default_meta_title = excluded.default_meta_title,
  default_meta_description = excluded.default_meta_description,
  social_links = excluded.social_links,
  contact = excluded.contact,
  url_config = excluded.url_config,
  organization_schema = excluded.organization_schema;

-- ===========================================================================
-- MENUS
-- ===========================================================================
insert into public.menu_items (location, label, url, sort_order) values
  ('header', 'Services',        '/services',         1),
  ('header', 'Implementations', '/implementations',  2),
  ('header', 'MVP Development',  '/mvp',              3),
  ('header', 'About',           '/about',            4),
  ('header', 'Insights',        '/insights',         5);

insert into public.menu_items (location, group_label, label, url, sort_order) values
  ('footer', 'Explore', 'Services',        '/services',        1),
  ('footer', 'Explore', 'Implementations', '/implementations', 2),
  ('footer', 'Explore', 'MVP Development',  '/mvp',             3),
  ('footer', 'Explore', 'Insights',        '/insights',        4),
  ('footer', 'Company', 'About Mavlers.ai','/about',           1),
  ('footer', 'Company', 'AI Governance',   '/governance',      2),
  ('footer', 'Company', 'Security',        '/governance',      3),
  ('footer', 'Company', 'Contact',         '/book-a-call',     4),
  ('footer', 'Get started', 'Book a Call',           '/book-a-call', 1),
  ('footer', 'Get started', 'Submit Requirement',    '/book-a-call', 2);

insert into public.menu_items (location, label, url, sort_order) values
  ('footer_legal', 'Privacy Policy', '#', 1),
  ('footer_legal', 'Terms',          '#', 2),
  ('footer_legal', 'Security',       '/governance', 3);

insert into public.menu_items (location, label, url, sort_order) values
  ('utility', 'Visit mavlers.com',    'https://mavlers.com',    1),
  ('utility', 'Visit mavlers.agency', 'https://mavlers.agency', 2);

-- ===========================================================================
-- AUTHORS
-- ===========================================================================
insert into public.authors (id, name, initials, bio) values
  ('11111111-1111-1111-1111-111111111111', 'Mavlers.ai Team', 'MA',
   'AI consultants, solution architects and engineers writing about delivering AI and automation under agency brands.');

-- ===========================================================================
-- CATEGORIES  (insight categories + implementation industries + lifecycle)
-- ===========================================================================
insert into public.categories (name, slug, taxonomy, content_type, sort_order) values
  -- Insight blog categories
  ('AI Strategy', 'ai-strategy', 'category', 'insight', 1),
  ('Automation',  'automation',  'category', 'insight', 2),
  ('AI Agents',   'ai-agents',   'category', 'insight', 3),
  ('Delivery',    'delivery',    'category', 'insight', 4),
  ('MVP',         'mvp',         'category', 'insight', 5),
  -- Implementation industries
  ('Marketing & Advertising', 'marketing-advertising', 'industry', 'implementation', 1),
  ('SaaS & Technology',       'saas-technology',       'industry', 'implementation', 2),
  ('Financial Services',      'financial-services',    'industry', 'implementation', 3),
  ('Real Estate',             'real-estate',           'industry', 'implementation', 4),
  ('Professional Services',   'professional-services', 'industry', 'implementation', 5),
  ('Retail & eCommerce',      'retail-ecommerce',      'industry', 'implementation', 6),
  ('Healthcare',              'healthcare',            'industry', 'implementation', 7),
  ('Manufacturing',           'manufacturing',         'industry', 'implementation', 8),
  ('Education',               'education',             'industry', 'implementation', 9),
  -- Implementation lifecycle stages
  ('Marketing',            'marketing',            'lifecycle', 'implementation', 1),
  ('Sales',                'sales',                'lifecycle', 'implementation', 2),
  ('Customer Support',     'customer-support',     'lifecycle', 'implementation', 3),
  ('Operations',           'operations',           'lifecycle', 'implementation', 4),
  ('Knowledge Management', 'knowledge-management', 'lifecycle', 'implementation', 5),
  ('Reporting & Analytics','reporting-analytics',  'lifecycle', 'implementation', 6),
  ('Website Experience',   'website-experience',   'lifecycle', 'implementation', 7),
  ('Internal Productivity','internal-productivity','lifecycle', 'implementation', 8);

-- ===========================================================================
-- TAGS
-- ===========================================================================
insert into public.tags (name, slug) values
  ('AI Strategy', 'ai-strategy'),
  ('White-label', 'white-label'),
  ('Agency', 'agency'),
  ('Sales', 'sales'),
  ('RAG', 'rag'),
  ('Automation', 'automation'),
  ('Agents', 'agents'),
  ('MVP', 'mvp'),
  ('Integration', 'integration');
