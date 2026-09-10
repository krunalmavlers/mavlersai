-- ============================================================================
-- Mavlers.ai — homepage hero: centred layout on the spotlight backdrop.
-- Drops the robot mascot from the hero (it still ships in the compact
-- Implementations block), retitles the headline and tightens the subhead to a
-- single sentence. Idempotent: safe to re-run.
-- ============================================================================

update public.page_sections
set content = (content - 'animated' - 'visual') || jsonb_build_object(
  'layout', 'centered',
  'heading_html', 'Turn Industry Expertise Into <span>AI That Delivers</span>',
  'subhead', 'We turn AI ambition into real-world solutions, working alongside your team from strategy to scale — backed by 15+ years of digital delivery.'
)
where type = 'hero'
  and page_id = (select id from public.pages where slug = '');
