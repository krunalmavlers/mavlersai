-- ============================================================================
-- Mavlers.ai — centre the heroes that have nothing beside them.
--
-- /about, /mvp, /governance and /book-a-call all use the split hero layout but
-- carry no image and no animation, so the right-hand column renders empty and
-- the copy sits against the left edge of a very wide page.
--
-- The centred layout is the one the homepage uses: copy on the page's axis,
-- over the soft yellow wash and dot grid. It also brings the scroll-out
-- parallax those heroes currently have no part of.
--
-- /services keeps the split layout — it has an image to sit beside the copy.
-- The /services/* sub-pages keep it too: they lead with a breadcrumb, which
-- belongs on the left edge rather than centred.
--
-- Idempotent; revert by setting layout back to 'split' or removing the key.
-- ============================================================================

update public.page_sections
set content = content || jsonb_build_object('layout', 'centered')
where type = 'hero'
  and page_id in (
    select id from public.pages where slug in ('about', 'mvp', 'governance', 'book-a-call')
  );
