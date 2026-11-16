-- The page that lived at /v6 is now /ai-services. Header and footer
-- "MVP Development" open that page instead of the CMS /mvp page.
update public.menu_items
set url = '/ai-services'
where label = 'MVP Development'
  and url = '/mvp';
