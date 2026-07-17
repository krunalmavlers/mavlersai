-- ============================================================================
-- Mavlers.ai — Add the "Upload a brief" file field to the Book a Call form.
-- Safe to run once; guarded so it will not duplicate.
-- ============================================================================
insert into public.form_fields (form_id, name, label, type, placeholder, help_text, options, required, sort_order, col_span, conditional)
select
  '22222222-2222-2222-2222-222222222222',
  'brief_file',
  'Upload a brief (optional)',
  'file',
  '',
  'Drop a PDF, deck or spreadsheet, or click to browse. Max 15 MB.',
  '[]'::jsonb,
  false,
  11,
  2,
  $json${"field":"mode","equals":"brief"}$json$::jsonb
where not exists (
  select 1 from public.form_fields
  where form_id = '22222222-2222-2222-2222-222222222222' and name = 'brief_file'
);
