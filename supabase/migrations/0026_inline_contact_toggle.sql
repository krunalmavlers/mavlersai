-- Switch between booking a call and sending a requirement in place, rather
-- than navigating between two pages. Supersedes 0025, whose page-to-page
-- switch this removes: the toggle no longer redirects.
--
-- Both forms carry both modes; the difference is the order, because the first
-- mode is the one selected on load. /book-a-call opens on the call,
-- /submit-a-requirement opens on the written form. Each mode carries its own
-- step list so the rail never shows a call's steps beside the written form.

with parts as (
  select
    jsonb_build_object(
      'key', 'call',
      'kind', 'call request',
      'label', 'Book a Call',
      'title', 'Book a 30 minute consultation call',
      'submit', 'Request a Call',
      'subtitle', 'Pick a time below and it goes straight into an AI consultant''s calendar. Bring a rough idea or a defined scope, there is nothing to prepare and no obligation to go further.',
      'next_steps_eyebrow', 'On the call',
      'next_steps_heading', 'Thirty minutes, three outcomes',
      'next_steps', jsonb_build_array(
        jsonb_build_object('title', 'We understand the opportunity',
          'body', 'A short conversation about the client problem or the idea you are carrying.'),
        jsonb_build_object('title', 'We identify a technical pathway',
          'body', 'We map it to the right approach, the right stack and the right team.'),
        jsonb_build_object('title', 'We recommend a next step',
          'body', 'Discovery, proof of concept, project or an embedded pod, and what each would take.')
      )
    ) as call_mode,
    jsonb_build_object(
      'key', 'brief',
      'kind', 'requirement',
      'label', 'Submit a Requirement',
      'title', 'Send us the requirement in writing',
      'submit', 'Submit Requirement',
      'subtitle', 'Share as much or as little as you have, even a rough idea is a fine place to start. A senior engineer reads every one and comes back with a recommended pathway.',
      'next_steps_eyebrow', 'After you send it',
      'next_steps_heading', 'What happens next',
      'next_steps', jsonb_build_array(
        jsonb_build_object('title', 'A senior engineer reads it',
          'body', 'Not a sales queue. Someone who can judge the work looks at what you sent.'),
        jsonb_build_object('title', 'We identify a technical pathway',
          'body', 'We map your requirement to the right engagement and approach.'),
        jsonb_build_object('title', 'We come back with a next step',
          'body', 'Discovery, proof of concept, project or an embedded pod, whichever fits.')
      )
    ) as brief_mode,
    jsonb_build_object(
      'url', 'https://calendly.com/mavlers-ai/30min',
      'modes', jsonb_build_array('call'),
      'duration', '30 minutes',
      'note', '',
      'heading', 'Pick a time',
      'host', jsonb_build_object('name', 'Krunal Bakraniya', 'role', 'Expert AI Consultant', 'photo', '')
    ) as calendly
)
update forms f
set settings = (f.settings - 'page_switch')
      || jsonb_build_object(
           'calendly', jsonb_set(p.calendly, '{host,photo}',
             to_jsonb(coalesce(f.settings #>> '{calendly,host,photo}', ''))),
           'modes', case f.key
             when 'book-a-call' then jsonb_build_array(p.call_mode, p.brief_mode)
             else                    jsonb_build_array(p.brief_mode, p.call_mode)
           end
         ),
    updated_at = now()
from parts p
where f.key in ('book-a-call', 'submit-a-requirement');

-- The consent line now renders under the written form as well as before a
-- call, so it cannot promise to send the agreement "before the call".
update forms
set settings = jsonb_set(
      settings,
      '{consent}',
      (
        select jsonb_agg(
          case when c->>'name' = 'nda'
               then jsonb_set(c, '{label}',
                      '"I would like a non-disclosure agreement in place before sharing details. We will send one over."')
               else c end
          order by ord
        )
        from jsonb_array_elements(settings->'consent') with ordinality t(c, ord)
      )
    ),
    updated_at = now()
where key in ('book-a-call', 'submit-a-requirement')
  and settings ? 'consent';
