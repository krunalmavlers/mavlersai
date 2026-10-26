// Apply migration 0028 to the live homepage via PostgREST.
// Node 20 has no native WebSocket, so this does not use supabase-js.
// Usage: node scripts/apply-home-plan.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const env = {};
for (const line of readFileSync(join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '').trim();
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing Supabase URL or service role key in .env.local');

const sql = readFileSync(join(root, 'supabase/migrations/0028_home_without_pricing.sql'), 'utf8');
const rows = [];
const re = /\('([a-z_]+)',\s*(\d+),\s*\$json\$([\s\S]*?)\$json\$\)/g;
let mm;
while ((mm = re.exec(sql))) {
  rows.push({ type: mm[1], sort_order: Number(mm[2]), content: JSON.parse(mm[3]) });
}
if (rows.length !== 7) throw new Error(`Expected 7 sections, parsed ${rows.length}`);

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

async function rest(path, init = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, Prefer: 'return=representation', ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

const pages = await rest('pages?slug=eq.&select=id');
const page = pages?.[0];
if (!page?.id) throw new Error('No homepage (slug "") found');

const existing = await rest(`page_sections?page_id=eq.${page.id}&select=id,type,sort_order&order=sort_order.asc`);
for (const row of existing || []) {
  await rest(`page_sections?id=eq.${row.id}`, { method: 'DELETE' });
}

const inserted = await rest('page_sections', {
  method: 'POST',
  body: JSON.stringify(
    rows.map((r) => ({
      page_id: page.id,
      type: r.type,
      sort_order: r.sort_order,
      is_visible: true,
      content: r.content,
    })),
  ),
});

await rest('pages?slug=eq.', {
  method: 'PATCH',
  body: JSON.stringify({
    meta_description:
      'Tell us where the build stalled. A plan appears on the page, then a Mavlers engineer takes it the rest of the way.',
  }),
});

const after = await rest(`page_sections?page_id=eq.${page.id}&select=sort_order,type&order=sort_order.asc`);
console.log(
  'Homepage sections:',
  (after || []).map((r) => `${r.sort_order}:${r.type}`).join(', '),
);
console.log('Inserted', inserted?.length ?? 0);
