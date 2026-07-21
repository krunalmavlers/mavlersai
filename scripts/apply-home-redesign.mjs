// One-off: apply the homepage re-seed (migration 0009) to the live DB via the
// service-role REST client — safe, targeted (only the homepage), and idempotent.
// Reads section content straight from 0009_home_redesign.sql so the migration
// stays the source of truth. Usage: node scripts/apply-home-redesign.mjs
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

// --- parse sections from the migration ---
const sql = readFileSync(join(root, 'supabase', 'migrations', '0009_home_redesign.sql'), 'utf8');
const rows = [];
const re = /\('([a-z_]+)',\s*(\d+),\s*\$json\$([\s\S]*?)\$json\$\)/g;
let mm;
while ((mm = re.exec(sql))) {
  rows.push({ type: mm[1], sort_order: Number(mm[2]), content: JSON.parse(mm[3]) });
}
if (rows.length < 5) throw new Error(`Only parsed ${rows.length} sections — aborting`);

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

// --- home page id (slug '') ---
const { data: page, error: pErr } = await db.from('pages').select('id').eq('slug', '').maybeSingle();
if (pErr) throw pErr;
if (!page) throw new Error("No homepage (slug='') found");

const { error: dErr } = await db.from('page_sections').delete().eq('page_id', page.id);
if (dErr) throw dErr;

const { error: iErr } = await db
  .from('page_sections')
  .insert(rows.map((r) => ({ page_id: page.id, type: r.type, sort_order: r.sort_order, is_visible: true, content: r.content })));
if (iErr) throw iErr;

const { count } = await db.from('page_sections').select('*', { count: 'exact', head: true }).eq('page_id', page.id);
console.log(`Homepage re-seeded: ${rows.length} sections inserted (page now has ${count}).`);
console.log('Types:', rows.map((r) => r.type).join(', '));
