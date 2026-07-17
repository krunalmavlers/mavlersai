import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

/** Returns the signed-in admin (present in admin_profiles) or null. */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role, full_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) return null;
  return {
    id: user.id,
    email: user.email || '',
    role: profile.role,
    full_name: profile.full_name || '',
  };
}
