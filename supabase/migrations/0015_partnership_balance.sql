-- ============================================================================
-- Mavlers.ai — homepage partnership: balance the two columns.
--
-- "You bring" has 5 points, "Mavlers.ai delivers" had 8, which left the section
-- lopsided. The eight are folded into five without dropping a capability:
--
--   Solution architecture + UX & prototyping   -> Solution architecture & prototyping
--   AI engineering        + Automation workflows -> AI engineering & automation
--   QA & deployment       + Maintenance & scaling -> QA, deployment & scaling
--
-- Purely editorial — revert by restoring the original array. Idempotent.
-- ============================================================================

update public.page_sections
set content = content || jsonb_build_object(
  'right_items', jsonb_build_array(
    'Opportunity validation',
    'Solution architecture & prototyping',
    'AI engineering & automation',
    'System integration',
    'QA, deployment & scaling'
  )
)
where type = 'partnership'
  and page_id = (select id from public.pages where slug = '');
