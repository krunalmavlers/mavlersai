-- Booking section, reworked for conversion. Applied to production in three
-- steps (calendly_host_details, book_a_call_conversion_copy,
-- book_a_call_fact_strip); recorded here as one guarded, re-runnable file.
--
--  - Introduce the consultant on our side of the Calendly frame.
--  - Point the embed at the event itself rather than the account landing page,
--    so visitors land on real times instead of clicking through a list whose
--    only row carries Calendly's stock "Welcome to my scheduling page" copy.
--    NOTE: renaming the event in Calendly can change this slug.
--  - Say what the visitor gets, not which scheduling vendor we use.
--  - Shorten helper_text so the three reassurances sit on one line, and clear
--    the timezone note, which Calendly prints under its own calendar.

update forms
set title = 'Book a 30 minute consultation call',
    settings = settings
      || jsonb_build_object(
           'helper_text', 'No obligation · Non-disclosure agreement available · Client relationship protected',
           'next_steps_eyebrow', 'On the call',
           'next_steps_heading', 'Thirty minutes, three outcomes',
           'next_steps', jsonb_build_array(
             jsonb_build_object('title', 'We understand the opportunity',
               'body', 'A short conversation about the client problem or the idea you are carrying.'),
             jsonb_build_object('title', 'We identify a technical pathway',
               'body', 'We map it to the right approach, the right stack and the right team.'),
             jsonb_build_object('title', 'We recommend a next step',
               'body', 'Discovery, proof of concept, project or an embedded pod, and what each would take.')
           ),
           'calendly', coalesce(settings->'calendly', '{}'::jsonb)
             || jsonb_build_object(
                  'url', 'https://calendly.com/mavlers-ai/30min',
                  'duration', '30 minutes',
                  'note', '',
                  'host', jsonb_build_object(
                    'name',  'Krunal Bakraniya',
                    'role',  'Expert AI Consultant',
                    'photo', coalesce(settings #>> '{calendly,host,photo}', '')
                  )
                )
         ),
    updated_at = now()
where key = 'book-a-call';

-- The call mode carries the heading and subtitle the page actually renders.
update forms
set settings = jsonb_set(
      settings,
      '{modes}',
      (
        select jsonb_agg(
          case when m->>'key' = 'call' then
            m || jsonb_build_object(
              'title', 'Book a 30 minute consultation call',
              'subtitle', 'Pick a time below and it goes straight into an AI consultant''s calendar. Bring a rough idea or a defined scope, there is nothing to prepare and no obligation to go further.'
            )
          else m end
          order by ord
        )
        from jsonb_array_elements(settings->'modes') with ordinality as t(m, ord)
      )
    ),
    updated_at = now()
where key = 'book-a-call';
