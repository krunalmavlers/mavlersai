-- /book-a-call and /submit-a-requirement each close on a yellow band pointing
-- at the other one, so someone who lands on the wrong page for how they want
-- to get in touch always has the other route in front of them.
--
-- Uses the existing cta_band "final" variant — the same full-width yellow
-- closing band the service pages use.
--
-- Idempotent: the bands are deleted before being re-inserted.

delete from page_sections
where page_id in (
  '68c76a27-ff5e-4454-9eca-f8b618a30ecc',  -- book-a-call
  '44444444-4444-4444-4444-444444444444'   -- submit-a-requirement
)
and type = 'cta_band';

insert into page_sections (page_id, type, sort_order, is_visible, content) values

-- On the call page: the written route.
('68c76a27-ff5e-4454-9eca-f8b618a30ecc', 'cta_band', 4, true, jsonb_build_object(
  'variant', 'final',
  'heading', 'Not ready to pick a time?',
  'body', 'Write the requirement down instead, in your own time. A senior engineer reads every one and comes back with a recommended pathway.',
  'ctas', jsonb_build_array(
    jsonb_build_object('label', 'Submit a Requirement', 'href', '/submit-a-requirement', 'style', 'primary')
  )
)),

-- On the requirement page: the conversation.
('44444444-4444-4444-4444-444444444444', 'cta_band', 4, true, jsonb_build_object(
  'variant', 'final',
  'heading', 'Would you rather talk it through?',
  'body', 'Pick a time straight from an AI consultant''s calendar. The scheduler captures everything we need, so there is no form to fill in.',
  'ctas', jsonb_build_array(
    jsonb_build_object('label', 'Book a Call', 'href', '/book-a-call', 'style', 'primary')
  )
));

-- The requirement page's FAQ asked the same question the new band answers,
-- one section higher. Drop it.
update page_sections
set content = jsonb_set(
      content,
      '{items}',
      (
        select coalesce(jsonb_agg(i order by ord), '[]'::jsonb)
        from jsonb_array_elements(content->'items') with ordinality as t(i, ord)
        where i->>'q' <> 'Would you rather talk it through?'
      )
    ),
    updated_at = now()
where page_id = '44444444-4444-4444-4444-444444444444'
  and type = 'faq';
