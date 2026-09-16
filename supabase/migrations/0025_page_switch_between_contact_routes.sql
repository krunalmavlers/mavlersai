-- A segmented control under the heading on both contact pages, switching
-- between the two ways of getting in touch. Booking a call is listed first,
-- so it is the default on the page a visitor is most likely to land on.
--
-- The same array goes on both forms: the active option is derived from the
-- current URL, not stored, so there is nothing to keep in sync.

update forms
set settings = jsonb_set(
      settings,
      '{page_switch}',
      jsonb_build_array(
        jsonb_build_object('label', 'Book a Call',          'href', '/book-a-call'),
        jsonb_build_object('label', 'Submit a Requirement', 'href', '/submit-a-requirement')
      ),
      true
    ),
    updated_at = now()
where key in ('book-a-call', 'submit-a-requirement');
