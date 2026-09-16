-- "NDA" was the last abbreviation left in the site copy, on /book-a-call and
-- in the Book a Call form's consent and helper text. Spell it out, per the
-- standing no-shortforms rule.

update page_sections
set content = replace(replace(replace(
        content::text,
        'an NDA',  'a non-disclosure agreement'),
        'NDA available', 'Non-disclosure agreement available'),
        'NDA in place',  'non-disclosure agreement in place')::jsonb,
    updated_at = now()
where content::text ~ '\mNDA\M';

update forms
set settings = replace(replace(replace(
        settings::text,
        'an NDA',  'a non-disclosure agreement'),
        'NDA available', 'Non-disclosure agreement available'),
        'NDA in place',  'non-disclosure agreement in place')::jsonb,
    updated_at = now()
where settings::text ~ '\mNDA\M';
