'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/admin/login');
  }
  return (
    <button
      onClick={signOut}
      className="w-full rounded-[10px] border border-white/12 px-3 py-2 text-left text-[13px] font-semibold text-body-faint hover:bg-white/5 hover:text-white"
    >
      Sign out
    </button>
  );
}
