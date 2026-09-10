-- ============================================================================
-- Mavlers.ai — homepage: drop the delivery process and pillars sections.
--
-- Both blocks still live on the pages where they carry their own weight —
-- `process_timeline` on /services and /mvp, `pillars` on /about and
-- /governance — so this removes them from the homepage only.
--
-- Written as two statements rather than `type in (...)` so each deletion is
-- explicit about what it removes. Idempotent.
-- ============================================================================

delete from public.page_sections
where type = 'process_timeline'
  and page_id = (select id from public.pages where slug = '');

delete from public.page_sections
where type = 'pillars'
  and page_id = (select id from public.pages where slug = '');
