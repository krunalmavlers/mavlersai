-- ============================================================================
-- Content changes applied to production during the redesign session.
--
-- These were run directly against the live database as the design was agreed,
-- so production ALREADY has them. This file exists so a fresh environment can
-- be rebuilt from the repo and so the history is auditable — every statement is
-- guarded and safe to re-run against a database that already has the change.
-- ============================================================================

-- --- Homepage hero: centred, retitled, with the typed accent phrase ---------
update public.page_sections
set content = (content - 'animated' - 'visual') || jsonb_build_object(
  'layout', 'centered',
  'heading_html', 'Turn Industry Expertise Into <span>AI That Delivers</span>',
  'subhead', 'We turn AI ambition into real-world solutions, working alongside your team from strategy to scale — backed by 15+ years of digital delivery.',
  'heading_alts', jsonb_build_array('AI That Performs', 'AI That Transforms', 'AI That Scales')
)
where type = 'hero' and page_id = (select id from public.pages where slug = '');

-- --- Homepage: balance, order, split layout ---------------------------------
update public.page_sections
set content = content || jsonb_build_object('right_items', jsonb_build_array(
  'Opportunity validation', 'Solution architecture & prototyping',
  'AI engineering & automation', 'System integration', 'QA, deployment & scaling'))
where type = 'partnership' and page_id = (select id from public.pages where slug = '');

delete from public.page_sections
where type in ('process_timeline', 'pillars')
  and page_id = (select id from public.pages where slug = '');

update public.page_sections
set content = content || jsonb_build_object('layout', 'split')
where type = 'feature_grid' and page_id = (select id from public.pages where slug = '');

update public.page_sections s set sort_order = v.ord
from (values ('hero',1),('stats_bar',2),('feature_grid',3),('implementations',4),
             ('partnership',5),('connect_grid',6),('engagement_models',7),('cta_band',8)
) as v(type, ord)
where s.type = v.type and s.page_id = (select id from public.pages where slug = '');

-- --- Stats: real figures ----------------------------------------------------
update public.page_sections s
set content = jsonb_set(s.content, '{stats}', (
  select jsonb_agg(case when i.item->>'label' = 'countries served'
                        then jsonb_set(i.item, '{num}', to_jsonb('10+'::text))
                        else i.item end order by i.ord)
  from jsonb_array_elements(s.content->'stats') with ordinality as i(item, ord)))
from public.pages p
where p.id = s.page_id and s.type = 'stats_bar' and p.slug = '';

update public.page_sections s
set content = jsonb_set(s.content, '{stats}', coalesce((
  select jsonb_agg(i.item order by i.ord)
  from jsonb_array_elements(s.content->'stats') with ordinality as i(item, ord)
  where i.item->>'label' is distinct from 'delivery teams'), '[]'::jsonb))
from public.pages p
where p.id = s.page_id and s.type = 'stats_bar' and p.slug = 'about';

-- --- Heroes: layouts, visuals, gradient accents -----------------------------
update public.page_sections
set content = content || jsonb_build_object('layout', 'centered')
where type = 'hero'
  and page_id in (select id from public.pages where slug in ('governance', 'mvp'));

update public.page_sections s
set content = (s.content - 'visual') || jsonb_build_object('layout', 'editorial')
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'about';

update public.page_sections s
set content = s.content || jsonb_build_object('layout', 'split', 'visual', 'assembly-floor')
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'mvp';

update public.page_sections s
set content = s.content || jsonb_build_object('layout', 'centered', 'theme', 'dark', 'backdrop', 'plain')
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'book-a-call';

update public.page_sections s
set content = s.content || jsonb_build_object('visual', 'automation-flow')
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/automation-integration';

update public.page_sections s
set content = s.content || jsonb_build_object('visual', 'validation-loop')
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/product-development';

-- service detail titles: black head, gradient tail
update public.page_sections s set content = jsonb_set(s.content, '{heading_html}', to_jsonb('AI <span>Development</span>'::text))
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/ai-development';
update public.page_sections s set content = jsonb_set(s.content, '{heading_html}', to_jsonb('Automation &amp; <span>Integration</span>'::text))
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/automation-integration';
update public.page_sections s set content = jsonb_set(s.content, '{heading_html}', to_jsonb('Product &amp; <span>Validation</span>'::text))
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/product-development';

-- service heroes gained the CTAs and proof chips they had none of
update public.page_sections s
set content = s.content || jsonb_build_object(
  'primary_cta',   jsonb_build_object('label', 'Connect with an AI expert', 'href', '/book-a-call'),
  'secondary_cta', jsonb_build_object('label', 'Submit a project brief', 'href', '/book-a-call', 'style', 'link'))
from public.pages p
where p.id = s.page_id and s.type = 'hero'
  and p.slug in ('services/ai-development', 'services/automation-integration', 'services/product-development');

update public.page_sections s set content = s.content || jsonb_build_object('trust_items',
  jsonb_build_array('Grounded in your own knowledge', 'Production-grade', 'Built for adoption'))
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/ai-development';
update public.page_sections s set content = s.content || jsonb_build_object('trust_items',
  jsonb_build_array('Observable', 'Recoverable', 'Runs unattended'))
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/automation-integration';
update public.page_sections s set content = s.content || jsonb_build_object('trust_items',
  jsonb_build_array('Validated against real data', 'Senior engineering oversight', 'Launch-ready'))
from public.pages p where p.id = s.page_id and s.type = 'hero' and p.slug = 'services/product-development';

-- --- /about: editorial prose, roles as a travelling grid --------------------
update public.page_sections s
set content = s.content || jsonb_build_object('layout', 'aside')
from public.pages p where p.id = s.page_id and s.type = 'rich_text' and p.slug = 'about';

update public.page_sections s
set type = 'connect_grid',
    content = (s.content - 'columns') || jsonb_build_object('theme', 'light', 'items', (
      select jsonb_agg(i.item->>'title' order by i.ord)
      from jsonb_array_elements(s.content->'items') with ordinality as i(item, ord)))
from public.pages p
where p.id = s.page_id and s.type = 'feature_grid' and p.slug = 'about'
  and s.content->>'heading' = 'Cross-functional AI delivery, as one unit';

update public.page_sections s
set content = jsonb_set(s.content, '{items}',
  (s.content->'items') || to_jsonb('Subject Matter Experts'::text)
                       || to_jsonb('Customer Relationship Managers'::text))
from public.pages p
where p.id = s.page_id and s.type = 'connect_grid' and p.slug = 'about'
  and not (s.content->'items' ? 'Subject Matter Experts');

-- --- Service detail: spell the abbreviation out -----------------------------
update public.page_sections s
set content = jsonb_set(s.content, '{items}', (
  select jsonb_agg(case when i.item->>'short' = 'MCP'
                        then jsonb_set(i.item, '{short}', to_jsonb('Model Context Protocol'::text))
                        else i.item end order by i.ord)
  from jsonb_array_elements(s.content->'items') with ordinality as i(item, ord)))
from public.pages p
where p.id = s.page_id and s.type = 'services_detail' and p.slug = 'services/automation-integration';

-- --- Listing routes get editable hero copy ----------------------------------
insert into public.pages (slug, title, status, seo_title, meta_description)
select 'insights', 'Insights', 'published', 'Insights', 'Practical AI thinking for agencies and brands.'
where not exists (select 1 from public.pages where slug = 'insights');

insert into public.pages (slug, title, status, seo_title, meta_description)
select 'implementations', 'AI Use Cases', 'published', 'AI Use Cases', 'AI use cases you can build with your clients.'
where not exists (select 1 from public.pages where slug = 'implementations');

insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'hero', 1, jsonb_build_object(
  'badge', 'Insights',
  'heading_html', 'Practical AI thinking <span>for agencies.</span>',
  'subhead', 'How to sell, scope, build and deliver AI and automation under your brand.')
from public.pages p where p.slug = 'insights'
  and not exists (select 1 from public.page_sections s where s.page_id = p.id and s.type = 'hero');

insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'hero', 1, jsonb_build_object(
  'badge', 'AI Use Cases',
  'heading_html', 'AI use cases you can build <span>with your clients</span>',
  'subhead', 'Explore the workflows, agents and integrations we deliver — filter by industry or by digital lifecycle.')
from public.pages p where p.slug = 'implementations'
  and not exists (select 1 from public.page_sections s where s.page_id = p.id and s.type = 'hero');
