-- ============================================================================
-- Mavlers.ai — drop the "What we build" (`service_capabilities`) block from the
-- homepage and close the gap it leaves in sort_order. The same section type is
-- still used on /services, so only the homepage (slug '') is touched here.
-- Idempotent: safe to re-run.
-- ============================================================================

delete from public.page_sections
where type = 'service_capabilities'
  and page_id = (select id from public.pages where slug = '');

-- Re-pack sort_order 1..n so the remaining homepage sections stay contiguous.
with ordered as (
  select id, row_number() over (order by sort_order, id) as rn
  from public.page_sections
  where page_id = (select id from public.pages where slug = '')
)
update public.page_sections s
set sort_order = ordered.rn
from ordered
where ordered.id = s.id
  and s.sort_order <> ordered.rn;
