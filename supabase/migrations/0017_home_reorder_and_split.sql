-- ============================================================================
-- Mavlers.ai — homepage: lead with proof, and rework the opportunity block.
--
-- 1. The AI use cases move above the opportunity block. The page previously
--    asserted through five sections before showing a single piece of real
--    work; now the evidence lands second.
--
--      hero · stats · AI use cases · the opportunity · partnership ·
--      what we connect · engagement models · closing CTA
--
-- 2. The opportunity block switches to the `split` layout, which holds the
--    heading in place while the three statements scroll past it. That also
--    retires the 01/02/03 numerals, which implied a sequence the content
--    doesn't have.
--
-- Idempotent; revert by restoring the original sort_order values and dropping
-- the `layout` key.
-- ============================================================================

update public.page_sections s
set sort_order = v.ord
from (values
  ('hero',              1),
  ('stats_bar',         2),
  ('implementations',   3),
  ('feature_grid',      4),
  ('partnership',       5),
  ('connect_grid',      6),
  ('engagement_models', 7),
  ('cta_band',          8)
) as v(type, ord)
where s.type = v.type
  and s.page_id = (select id from public.pages where slug = '');

update public.page_sections
set content = content || jsonb_build_object('layout', 'split')
where type = 'feature_grid'
  and page_id = (select id from public.pages where slug = '');
