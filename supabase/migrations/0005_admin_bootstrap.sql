-- ============================================================================
-- Mavlers.ai — Admin bootstrap helper.
-- Create your admin login in Supabase Auth first (Dashboard → Authentication →
-- Users → Add user, OR sign up once), then run:
--     select public.promote_admin('you@example.com');
-- ============================================================================
create or replace function public.promote_admin(user_email text)
returns text language plpgsql security definer set search_path = public, auth as $$
declare uid uuid;
begin
  select id into uid from auth.users where email = user_email limit 1;
  if uid is null then
    return 'No auth user with email ' || user_email || '. Create the user first.';
  end if;
  insert into public.admin_profiles (user_id, full_name, role)
  values (uid, coalesce(split_part(user_email,'@',1),''), 'admin')
  on conflict (user_id) do update set role = 'admin';
  return 'Promoted ' || user_email || ' to admin.';
end;
$$;
