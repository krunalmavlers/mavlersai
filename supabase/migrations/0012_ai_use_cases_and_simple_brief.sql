-- ============================================================================
-- Mavlers.ai — two content changes:
--   1. Rename "Implementations" to "AI Use Cases" everywhere it is visible.
--   2. Reduce the "Submit a Requirement" form to three fields.
--
-- URLs are deliberately NOT changed. /implementations stays as the base slug
-- (site_settings.url_config.implementations_base), so existing links, shares
-- and search rankings keep working. Only the wording changes. See the note at
-- the bottom for what a URL change would additionally involve.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Menu labels (header + footer).
-- ---------------------------------------------------------------------------
update public.menu_items
set label = replace(replace(label, 'Implementations', 'AI Use Cases'),
                    'Implementation', 'AI Use Case')
where label ilike '%implementation%';

-- ---------------------------------------------------------------------------
-- 2. Section copy across every page (headings, eyebrows, CTA labels, body).
--
--    Rename every casing, then put the URLs back. Renaming first and repairing
--    hrefs afterwards is safer than trying to skip sections that contain a
--    link — otherwise any section with a /implementations CTA would keep the
--    old wording in its visible copy.
--    Plurals run before singulars so "Implementations" isn't half-consumed.
-- ---------------------------------------------------------------------------
update public.page_sections
set content = replace(
                replace(
                  replace(
                    replace(content::text, 'Implementations', 'AI Use Cases'),
                    'Implementation', 'AI Use Case'),
                  'implementations', 'AI use cases'),
                'implementation', 'AI use case'
              )::jsonb
where content::text ilike '%implementation%';

-- Repair any link the rename walked over. /implementations stays the URL.
update public.page_sections
set content = replace(
                replace(content::text, '/AI use cases', '/implementations'),
                '/AI Use Cases', '/implementations'
              )::jsonb
where content::text like '%/AI use cases%' or content::text like '%/AI Use Cases%';

-- ---------------------------------------------------------------------------
-- 3. Page-level SEO copy.
-- ---------------------------------------------------------------------------
update public.pages
set seo_title        = replace(seo_title, 'Implementations', 'AI Use Cases'),
    meta_description = replace(meta_description, 'Implementations', 'AI Use Cases')
where seo_title ilike '%implementation%' or meta_description ilike '%implementation%';

update public.pages
set meta_description = replace(meta_description, 'implementations', 'AI use cases')
where meta_description like '%implementations%';

-- ---------------------------------------------------------------------------
-- 4. Category names, if any taxonomy term uses the old word.
-- ---------------------------------------------------------------------------
update public.categories
set name = replace(name, 'Implementation', 'AI Use Case')
where name ilike '%implementation%';

-- ---------------------------------------------------------------------------
-- 5. Simplify the "Submit a Requirement" form.
--
--    Keeps: name, work email, one free-text requirement box.
--    Drops: company, website, role, opportunity, challenge, outcome,
--           timeline, budget.
--
--    `challenge` is REUSED as the requirement box rather than deleted and
--    recreated, so existing submissions that stored a `challenge` value keep
--    rendering against a field that still exists.
-- ---------------------------------------------------------------------------
delete from public.form_fields
where form_id = (select id from public.forms where key = 'book-a-call')
  and name in ('company', 'website', 'role', 'opportunity', 'outcome', 'timeline', 'budget');

update public.form_fields set
  label       = 'Name',
  type        = 'text',
  placeholder = 'Your name',
  required    = true,
  sort_order  = 1,
  col_span    = 1,
  conditional = '{}'::jsonb
where form_id = (select id from public.forms where key = 'book-a-call') and name = 'name';

update public.form_fields set
  label       = 'Work email',
  type        = 'email',
  placeholder = 'you@company.com',
  required    = true,
  sort_order  = 2,
  col_span    = 1,
  conditional = '{}'::jsonb
where form_id = (select id from public.forms where key = 'book-a-call') and name = 'email';

update public.form_fields set
  label       = 'Your requirement',
  type        = 'textarea',
  placeholder = 'Tell us what you want to build or the problem you want solved.',
  help_text   = '',
  required    = true,
  sort_order  = 3,
  col_span    = 2,
  conditional = '{}'::jsonb   -- was brief-only; now always shown
where form_id = (select id from public.forms where key = 'book-a-call') and name = 'challenge';

-- Trim the surrounding copy so it no longer promises a long form.
update public.forms set
  description = 'Three quick details and we''ll take it from there.',
  settings = jsonb_set(
    settings,
    '{modes}',
    $json$[
      {"key":"brief","label":"Submit a Requirement","title":"Submit your requirement","subtitle":"Share as much or as little as you have — even a rough idea is a fine place to start.","submit":"Submit Requirement","kind":"requirement"},
      {"key":"call","label":"Book a Call","title":"Grab a time that works for you","subtitle":"Book straight into an AI consultant's calendar below — Calendly captures everything we need, so there's no form to fill in.","submit":"Request a Call","kind":"call request"}
    ]$json$::jsonb
  )
where key = 'book-a-call';

-- ---------------------------------------------------------------------------
-- Verify
-- ---------------------------------------------------------------------------
-- select label, location, url from public.menu_items order by location, sort_order;
-- select name, label, type, required, sort_order, col_span, conditional
--   from public.form_fields
--   where form_id = (select id from public.forms where key='book-a-call')
--   order by sort_order;

-- ---------------------------------------------------------------------------
-- NOT DONE — changing the URL from /implementations to /ai-use-cases.
-- If you want that too, it is a one-line settings change:
--
--   update public.site_settings
--   set url_config = jsonb_set(url_config, '{implementations_base}', '"ai-use-cases"')
--   where id = 1;
--
-- but it silently breaks every existing inbound link and search result unless
-- 301 redirects are added in next.config.js first. Ask before running it.
-- ---------------------------------------------------------------------------
