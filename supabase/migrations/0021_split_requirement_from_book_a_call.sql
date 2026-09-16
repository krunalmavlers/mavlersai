-- Split "Submit a Requirement" out of /book-a-call into its own page.
--
-- /book-a-call carried a two-mode toggle: "Submit a Requirement" and
-- "Book a Call". The call mode is the only one that belongs there, so the
-- toggle is gone and the requirement form now lives at /submit-a-requirement,
-- reached from the footer's "Get started" group.
--
-- Idempotent: fixed UUIDs, ON CONFLICT upserts, and WHERE-guarded updates.

begin;

-- 1. /book-a-call keeps only the call mode. One mode means DynamicForm renders
--    no toggle, and the Calendly scheduler is all that shows.
update forms
set name     = 'Book a Call',
    title    = 'Grab a time that works for you',
    settings = jsonb_set(
      settings,
      '{modes}',
      (
        select coalesce(jsonb_agg(m), '[]'::jsonb)
        from jsonb_array_elements(settings->'modes') m
        where m->>'key' = 'call'
      )
    ),
    updated_at = now()
where key = 'book-a-call';

-- 2. The requirement form, standalone. Single mode, so again no toggle; no
--    calendly block, so DynamicForm renders the fields.
insert into forms (id, key, name, title, description, submit_label, success_message,
                   recipient_emails, recaptcha_enabled, settings)
values (
  '33333333-3333-3333-3333-333333333333',
  'submit-a-requirement',
  'Submit a Requirement',
  'Submit your requirement',
  'Share as much or as little as you have, even a rough idea is a fine place to start.',
  'Submit Requirement',
  'Thanks, we have got it. Our team will be in touch shortly.',
  '{}',
  true,
  jsonb_build_object(
    'modes', jsonb_build_array(jsonb_build_object(
      'key', 'brief',
      'kind', 'requirement',
      'label', 'Submit a Requirement',
      'title', 'Submit your requirement',
      'submit', 'Submit Requirement',
      'subtitle', 'Share as much or as little as you have, even a rough idea is a fine place to start.'
    )),
    'consent', jsonb_build_array(
      jsonb_build_object('name', 'nda',
        'label', 'I would like a non-disclosure agreement in place before sharing details. We will send one over.'),
      jsonb_build_object('name', 'agree', 'required', true,
        'label', 'I agree to be contacted about my enquiry. See our privacy policy.')
    ),
    'next_steps', jsonb_build_array(
      jsonb_build_object('title', 'A senior engineer reads it',
        'body', 'Not a sales queue. Someone who can judge the work looks at what you sent.'),
      jsonb_build_object('title', 'We identify a technical pathway',
        'body', 'We map your requirement to the right engagement and approach.'),
      jsonb_build_object('title', 'We come back with a next step',
        'body', 'Discovery, proof of concept, project or an embedded pod, whichever fits.')
    ),
    'helper_text', 'No obligation · Non-disclosure agreement available · Your client relationship stays protected'
  )
)
on conflict (key) do update set
  name            = excluded.name,
  title           = excluded.title,
  description     = excluded.description,
  submit_label    = excluded.submit_label,
  success_message = excluded.success_message,
  settings        = excluded.settings,
  updated_at      = now();

-- 3. Its fields: the same three the requirement mode used on /book-a-call.
insert into form_fields (form_id, name, label, type, placeholder, required, sort_order, col_span)
select '33333333-3333-3333-3333-333333333333', v.name, v.label, v.type, v.placeholder,
       v.required, v.sort_order, v.col_span
from (values
  ('name',      'Name',             'text',     'Your name',            true, 1, 1),
  ('email',     'Work email',       'email',    'you@company.com',      true, 2, 1),
  ('challenge', 'Your requirement', 'textarea',
     'Tell us what you want to build or the problem you want solved.',  true, 3, 2)
) as v(name, label, type, placeholder, required, sort_order, col_span)
where not exists (
  select 1 from form_fields
  where form_id = '33333333-3333-3333-3333-333333333333' and name = v.name
);

-- 4. The page itself.
insert into pages (id, slug, title, template, seo_title, meta_description, robots, status, sort_order)
values (
  '44444444-4444-4444-4444-444444444444',
  'submit-a-requirement',
  'Submit a Requirement',
  'default',
  'Submit a Requirement | Mavlers.ai',
  'Send us an AI, automation or integration requirement. A rough idea is a fine place to start, and a non-disclosure agreement is available before you share details.',
  'index,follow',
  'published',
  0
)
on conflict (slug) do update set
  title            = excluded.title,
  seo_title        = excluded.seo_title,
  meta_description = excluded.meta_description,
  status           = excluded.status,
  updated_at       = now();

-- 5. Its sections: hero, the form, and the questions people actually ask
--    before sending a requirement in writing.
delete from page_sections where page_id = '44444444-4444-4444-4444-444444444444';

insert into page_sections (page_id, type, sort_order, is_visible, content) values
('44444444-4444-4444-4444-444444444444', 'hero', 1, true, jsonb_build_object(
  'badge', 'Submit a Requirement',
  'theme', 'dark',
  'layout', 'centered',
  'animated', false,
  'backdrop', 'plain',
  'heading_html', 'Write it down. <span>We will read it properly.</span>',
  'subhead', 'A rough idea, a client problem or a defined scope, send whichever you have. A senior engineer reads every requirement and comes back with a recommended pathway.',
  'trust_items', jsonb_build_array(
    'No obligation',
    'Read by a senior engineer',
    'Client relationship protected'
  )
)),
('44444444-4444-4444-4444-444444444444', 'form', 2, true,
  jsonb_build_object('form_key', 'submit-a-requirement')),
('44444444-4444-4444-4444-444444444444', 'faq', 3, true, jsonb_build_object(
  'eyebrow', 'FAQ',
  'heading', 'Before you send it',
  'items', jsonb_build_array(
    jsonb_build_object('q', 'How much detail do you need?',
      'a', 'As little as a paragraph. A rough idea or a client problem is a perfectly good starting point, we will ask the rest.'),
    jsonb_build_object('q', 'Can you sign a non-disclosure agreement first?',
      'a', 'Yes. Tick the box on the form and we will send one over before you share anything sensitive.'),
    jsonb_build_object('q', 'When will we hear back?',
      'a', 'Within one business day, with a view on the approach rather than a generic reply.'),
    jsonb_build_object('q', 'Would you rather talk it through?',
      'a', 'Book a call instead and pick a time straight from an AI consultant''s calendar.'),
    jsonb_build_object('q', 'Can you work with our existing technical team?',
      'a', 'Yes. We embed with your team or operate as an independent pod.')
  )
));

-- 6. Footer link points at the new page.
update menu_items
set label = 'Submit a Requirement',
    url   = '/submit-a-requirement',
    updated_at = now()
where location = 'footer' and group_label = 'Get started' and url = '/book-a-call'
  and label in ('Submit Requirement', 'Submit a Requirement');

-- 7. Every other "submit a requirement / project brief" call to action across
--    the site pointed at the now-removed tab. Repoint them.
update page_sections
set content = jsonb_set(content, '{secondary_cta,href}', '"/submit-a-requirement"'),
    updated_at = now()
where content #>> '{secondary_cta,href}' = '/book-a-call'
  and content #>> '{secondary_cta,label}' ilike '%brief%';

update page_sections
set content = jsonb_set(content, '{cta_secondary,href}', '"/submit-a-requirement"'),
    updated_at = now()
where content #>> '{cta_secondary,href}' = '/book-a-call'
  and content #>> '{cta_secondary,label}' ilike '%brief%';

update page_sections s
set content = jsonb_set(
      s.content,
      '{ctas}',
      (
        select jsonb_agg(
          case when cta->>'href' = '/book-a-call' and cta->>'label' ilike '%requirement%'
               then jsonb_set(cta, '{href}', '"/submit-a-requirement"')
               else cta end
          order by ord
        )
        from jsonb_array_elements(s.content->'ctas') with ordinality as t(cta, ord)
      )
    ),
    updated_at = now()
where s.type = 'cta_band'
  and s.content->'ctas' @> '[{"href":"/book-a-call"}]'
  and s.content::text ilike '%requirement%';

commit;
