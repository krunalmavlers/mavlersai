import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 * Use ONLY on the server for admin mutations, reading drafts, and storing
 * form submissions. Never import this into a Client Component.
 */
export function createSupabaseAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
