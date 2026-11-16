-- Header item that opens /ai-services is labeled AI Services.
update public.menu_items
set label = 'AI Services'
where location = 'header'
  and label = 'MVP Development'
  and url = '/ai-services';
