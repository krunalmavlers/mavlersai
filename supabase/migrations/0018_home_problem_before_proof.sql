-- ============================================================================
-- Mavlers.ai — homepage: frame the problem before showing the proof.
--
-- 0017 moved the AI use cases to third, ahead of everything. That put real work
-- in front of a visitor who had no reason yet to care about it — evidence
-- without a question reads as a portfolio dump. The opportunity block now sets
-- up the problem and the use cases answer it:
--
--   hero · stats · the opportunity · AI use cases · partnership ·
--   what we connect · engagement models · closing CTA
--
-- The use cases are still fourth rather than the sixth they started at, so the
-- page still leads with substance. Idempotent.
-- ============================================================================

update public.page_sections s
set sort_order = v.ord
from (values
  ('feature_grid',    3),
  ('implementations', 4)
) as v(type, ord)
where s.type = v.type
  and s.page_id = (select id from public.pages where slug = '');
