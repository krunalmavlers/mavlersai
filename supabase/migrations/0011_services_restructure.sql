-- ============================================================================
-- Mavlers.ai — Restructure Services into a hub + three capability sub-pages.
--
--   /services                          hub: three capability cards
--   /services/ai-development           RAG, Custom AI, Agents, LLM, Dashboards
--   /services/automation-integration   Workflow, BPA, Orchestration, API, MCP,
--                                      CRM & ERP
--   /services/product-development      PoC, MVP
--
-- The 13 service definitions are NOT retyped here — they are read out of the
-- existing services_detail section(s) and redistributed, so wording that has
-- been edited in the admin panel is preserved. The shared "foundations" grid
-- and delivery timeline are likewise copied from the hub page.
--
-- Safe to re-run: after the first run the catalogue lives on the sub-pages,
-- and the source query reads from every /services* page, so it still resolves.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Snapshot the current service catalogue + shared sections.
-- ---------------------------------------------------------------------------
create temporary table _catalogue as
select distinct on (item->>'id')
       item->>'id' as service_id,
       item        as item
from public.page_sections s
join public.pages p on p.id = s.page_id
cross join lateral jsonb_array_elements(s.content->'items') as item
where s.type = 'services_detail'
  and (p.slug = 'services' or p.slug like 'services/%');

create temporary table _shared as
select
  (select s.content from public.page_sections s join public.pages p on p.id = s.page_id
    where p.slug like 'services%' and s.type = 'feature_grid' order by p.slug limit 1)     as foundations,
  (select s.content from public.page_sections s join public.pages p on p.id = s.page_id
    where p.slug like 'services%' and s.type = 'process_timeline' order by p.slug limit 1) as timeline;

do $$
begin
  if (select count(*) from _catalogue) < 13 then
    raise exception 'Expected 13 services in the catalogue, found %', (select count(*) from _catalogue);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Which services belong on which sub-page, and in what order.
-- ---------------------------------------------------------------------------
create temporary table _assign as
select * from (values
  ('services/ai-development',         'rag',           1),
  ('services/ai-development',         'custom-ai',     2),
  ('services/ai-development',         'agents',        3),
  ('services/ai-development',         'llm',           4),
  ('services/ai-development',         'dashboards',    5),
  ('services/automation-integration', 'workflow',      1),
  ('services/automation-integration', 'bpa',           2),
  ('services/automation-integration', 'orchestration', 3),
  ('services/automation-integration', 'api',           4),
  ('services/automation-integration', 'mcp',           5),
  ('services/automation-integration', 'crm-erp',       6),
  ('services/product-development',    'poc',           1),
  ('services/product-development',    'mvp',           2)
) as v(page_slug, service_id, ord);

-- Cross-links between capability pages (design: "See how this powers …").
create temporary table _cross as
select * from (values
  ('agents',    'Powered by our Model Context Protocol work →', '/services/automation-integration#mcp'),
  ('mcp',       'See how this powers our AI Agents →',          '/services/ai-development#agents'),
  ('crm-erp',   'Layer AI on top of this data →',               '/services/ai-development#custom-ai')
) as v(service_id, label, href);

-- ---------------------------------------------------------------------------
-- 3. Create (or update) the three capability pages.
-- ---------------------------------------------------------------------------
insert into public.pages (slug, title, seo_title, meta_description, status, sort_order)
values
  ('services/ai-development', 'AI Development',
   'AI Development Services | RAG, Agents, LLM & AI Dashboards | Mavlers.ai',
   'Custom AI engineering: retrieval-augmented agents grounded in your own knowledge, tool-enabled AI agents, LLM integration, bespoke AI applications and AI-driven dashboards.',
   'published', 21),
  ('services/automation-integration', 'Automation & Integration',
   'Automation & Integration Services | Workflows, APIs, MCP, CRM & ERP | Mavlers.ai',
   'Workflow and business process automation, multi-system orchestration, API and platform integration, custom MCP servers, and deep CRM/ERP integration.',
   'published', 22),
  ('services/product-development', 'Product & Validation',
   'AI Proof of Concept & MVP Development Services | Mavlers.ai',
   'Validate the riskiest assumption against real data with a focused AI proof of concept, then ship a launch-ready MVP with senior engineering oversight.',
   'published', 23)
on conflict (slug) do update
  set title            = excluded.title,
      seo_title        = excluded.seo_title,
      meta_description = excluded.meta_description,
      status           = excluded.status,
      sort_order       = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- 4. Rebuild every /services* page's sections from scratch.
-- ---------------------------------------------------------------------------
delete from public.page_sections
where page_id in (select id from public.pages where slug = 'services' or slug like 'services/%');

-- 4a. Hub: hero.
insert into public.page_sections (page_id, type, sort_order, content)
select id, 'hero', 1, $json${
  "badge": "AI & Automation Engineering Services",
  "heading_html": "The engineering capability behind <span>your AI and automation ideas.</span>",
  "subhead": "You bring the industry knowledge and the opportunity — as an agency serving clients, or a brand solving your own problems. We bring a senior team that architects, builds, integrates and ships production-grade AI.",
  "primary_cta": {"label": "Discuss Your Requirement", "href": "/book-a-call"},
  "secondary_cta": {"label": "View Our Implementations", "href": "/implementations"},
  "image": "/services-hero.jpg",
  "image_alt": "AI and automation workflow illustration"
}$json$::jsonb
from public.pages where slug = 'services';

-- 4b. Hub: the three capability cards.
insert into public.page_sections (page_id, type, sort_order, content)
select id, 'service_categories', 2, $json${
  "eyebrow": "What we offer",
  "heading": "Three capabilities. One engineering partner.",
  "subhead": "Pick the lane that matches your opportunity — or start a conversation and we'll map the right path with you.",
  "items": [
    {
      "n": "01", "tag": "Build", "icon": "sparkles",
      "title": "AI Development", "kicker": "Building intelligence",
      "body": "Custom AI built around a specific need — retrieval grounded in your own knowledge, autonomous agents, model integration, and the dashboards your teams work in every day.",
      "chips": ["RAG", "Agents", "LLM", "Dashboards"],
      "href": "/services/ai-development", "cta_label": "Explore AI Development"
    },
    {
      "n": "02", "tag": "Connect", "icon": "workflow",
      "title": "Automation & Integration", "kicker": "Connecting the stack",
      "body": "Wire the tools you already run into one reliable flow of data and actions, and automate the manual work in between. Observable, recoverable, built to run unattended.",
      "chips": ["Workflows", "API", "MCP", "CRM / ERP"],
      "href": "/services/automation-integration", "cta_label": "Explore Automation"
    },
    {
      "n": "03", "tag": "Launch", "icon": "rocket",
      "title": "Product & Validation", "kicker": "Idea to launch",
      "body": "Move from a hypothesis to a product in market — validate the riskiest assumption against real data first, then build the launch-ready version with senior engineering oversight.",
      "chips": ["Proof of Concept", "MVP", "Delivery"],
      "href": "/services/product-development", "cta_label": "Explore Product & Validation"
    }
  ]
}$json$::jsonb
from public.pages where slug = 'services';

-- 4c. Sub-page heroes (breadcrumb + title + positioning line).
insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'hero', 1, jsonb_build_object(
  'breadcrumb', jsonb_build_array(
    jsonb_build_object('label', 'Services', 'href', '/services'),
    jsonb_build_object('label', p.title)
  ),
  'heading_html', v.heading,
  'subhead', v.subhead
)
from public.pages p
join (values
  ('services/ai-development', 'AI Development',
   'Building intelligence. From retrieval systems grounded in your own trusted knowledge to autonomous agents that complete real work, we architect and ship production-grade AI your users actually adopt.'),
  ('services/automation-integration', 'Automation & Integration',
   'Connecting the stack. We wire the platforms your business runs on into one dependable flow of data and actions — and automate the manual, repetitive work in between. Observable, recoverable, and built to run unattended.'),
  ('services/product-development', 'Product & Validation',
   'Idea to launch. We move you from a hypothesis to a product in market — validating the riskiest assumption against real data first, then building the launch-ready version with senior engineering oversight, not just AI-generated code.')
) as v(slug, heading, subhead) on v.slug = p.slug;

-- 4d. Sub-page service detail blocks, rebuilt from the snapshot catalogue.
insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'services_detail', 2, jsonb_build_object(
  'items', items,
  'cta_primary',   jsonb_build_object('label', 'Connect with an AI expert', 'href', '/book-a-call'),
  'cta_secondary', jsonb_build_object('label', 'Submit a project brief',    'href', '/book-a-call')
)
from public.pages p
join (
  select a.page_slug,
         jsonb_agg(
           case when x.label is null then c.item
                else c.item || jsonb_build_object('cross_link',
                       jsonb_build_object('label', x.label, 'href', x.href))
           end
           order by a.ord
         ) as items
  from _assign a
  join _catalogue c on c.service_id = a.service_id
  left join _cross x on x.service_id = a.service_id
  group by a.page_slug
) as g on g.page_slug = p.slug;

-- 4e. Shared "engineering foundations" grid on the hub and every sub-page.
insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'feature_grid', case when p.slug = 'services' then 3 else 4 end, s.foundations
from public.pages p cross join _shared s
where (p.slug = 'services' or p.slug like 'services/%') and s.foundations is not null;

-- 4f. Delivery timeline — on the hub and on Product & Validation (per design).
insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'process_timeline', case when p.slug = 'services' then 4 else 3 end, s.timeline
from public.pages p cross join _shared s
where p.slug in ('services', 'services/product-development') and s.timeline is not null;

-- 4g. Implementations CTA band + final CTA on every /services* page.
insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'cta_band', 8, $json${
  "variant": "band",
  "heading": "Browse real implementation patterns across industries and the digital lifecycle",
  "body": "The workflows, agents and integrations we build — from marketing and sales to support, operations and internal productivity.",
  "ctas": [{"label": "View Our Implementations →", "href": "/implementations", "style": "primary"}]
}$json$::jsonb
from public.pages p
where p.slug = 'services' or p.slug like 'services/%';

insert into public.page_sections (page_id, type, sort_order, content)
select p.id, 'cta_band', 9, $json${
  "variant": "final",
  "heading": "Have a service requirement in mind?",
  "body": "Tell us the problem or the capability you want to build. We'll map it to the right approach and team.",
  "ctas": [
    {"label": "Book a Call", "href": "/book-a-call", "style": "primary"},
    {"label": "Or submit a requirement →", "href": "/book-a-call", "style": "outline"}
  ]
}$json$::jsonb
from public.pages p
where p.slug = 'services' or p.slug like 'services/%';

-- ---------------------------------------------------------------------------
-- 5. Navigation: a Services dropdown in the header, plus footer links.
-- ---------------------------------------------------------------------------
delete from public.menu_items
where url like '/services/%';

insert into public.menu_items (location, parent_id, group_label, label, url, sort_order)
select 'header', (select id from public.menu_items where location = 'header' and url = '/services' limit 1),
       '', v.label, v.url, v.ord
from (values
  ('AI Development',           '/services/ai-development',         1),
  ('Automation & Integration', '/services/automation-integration',  2),
  ('Product & Validation',     '/services/product-development',     3)
) as v(label, url, ord);

insert into public.menu_items (location, group_label, label, url, sort_order)
values
  ('footer', 'Explore', 'AI Development',           '/services/ai-development',        5),
  ('footer', 'Explore', 'Automation & Integration', '/services/automation-integration', 6),
  ('footer', 'Explore', 'Product & Validation',     '/services/product-development',    7);

-- ---------------------------------------------------------------------------
-- 6. Hub page SEO.
-- ---------------------------------------------------------------------------
update public.pages set
  seo_title = 'AI & Automation Engineering Services | Mavlers.ai',
  meta_description = 'Three capabilities, one engineering partner: AI development, automation & integration, and product validation — architected, built and shipped by a senior team.'
where slug = 'services';

drop table if exists _catalogue, _shared, _assign, _cross;
