// One-off: remove the "What we build" (`service_capabilities`) block from the
// homepage on the live DB via the service-role REST client — mirrors migration
// 0010 for environments where only .env.local is available (no DATABASE_URL).
// Only the homepage is touched; /services keeps its own capabilities block.
// Usage: node scripts/remove-home-what-we-build.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// --- load .env.local ---
const env = {};
for (const line of readFileSync(join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '').trim();
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing Supabase URL or service role key in .env.local');

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data: page, error: pErr } = await db.from('pages').select('id').eq('slug', '').maybeSingle();
if (pErr) throw pErr;
if (!page) throw new Error("No homepage (slug='') found");

const { data: removed, error: dErr } = await db
  .from('page_sections')
  .delete()
  .eq('page_id', page.id)
  .eq('type', 'service_capabilities')
  .select('id');
if (dErr) throw dErr;

// Re-pack sort_order so the remaining sections stay contiguous.
const { data: rest, error: sErr } = await db
  .from('page_sections')
  .select('id, type, sort_order')
  .eq('page_id', page.id)
  .order('sort_order', { ascending: true });
if (sErr) throw sErr;

for (const [i, row] of rest.entries()) {
  const next = i + 1;
  if (row.sort_order === next) continue;
  const { error } = await db.from('page_sections').update({ sort_order: next }).eq('id', row.id);
  if (error) throw error;
}

console.log(`Removed ${removed?.length ?? 0} "What we build" section(s) from the homepage.`);
console.log('Homepage sections now:', rest.map((r, i) => `${i + 1}. ${r.type}`).join(', '));
