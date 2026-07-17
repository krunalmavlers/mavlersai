-- ============================================================================
-- Mavlers.ai — Add a Calendly config block to the Book a Call form settings.
-- The scheduling URL is left blank; set it in Admin → Forms → Book a Call →
-- "Calendly scheduling URL". Shown as a "Pick a time" card in call mode.
-- Safe to run once; only adds the block if it is missing.
-- ============================================================================
update public.forms
set settings = jsonb_set(
  coalesce(settings, '{}'::jsonb),
  '{calendly}',
  '{"url":"","modes":["call"],"heading":"Pick a time","note":"Times are shown in your local timezone."}'::jsonb,
  true
)
where key = 'book-a-call'
  and not (coalesce(settings, '{}'::jsonb) ? 'calendly');
