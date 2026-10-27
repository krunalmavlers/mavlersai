// Apply migration 0029 to the live homepage via PostgREST.
// Usage: node scripts/apply-home-offerings.mjs
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

const sql = readFileSync(join(root, 'supabase/migrations/0029_home_offerings.sql'), 'utf8');
const match = sql.match(/\$json\$([\s\S]*?)\$json\$/);
if (!match) throw new Error('Could not parse offerings JSON');
const content = JSON.parse(match[1]);

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function rest(path, init = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

const pages = await rest('pages?slug=eq.&select=id,status,title');
const page = pages?.[0];
if (!page?.id) throw new Error('No homepage found');
console.log(`homepage status=${page.status} title=${page.title}`);

const existing = await rest(
  `page_sections?page_id=eq.${page.id}&select=id,type,sort_order&order=sort_order.desc`,
);
const gap = (existing || []).find((row) => row.type === 'pinned_stat');
const target = (gap?.sort_order ?? 4) + 1;
const already = (existing || []).find((row) => row.type === 'offerings');

if (already && already.sort_order !== target) {
  await rest(`page_sections?id=eq.${already.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ sort_order: 1000 }),
  });
  for (const row of existing || []) {
    if (row.id !== already.id && row.sort_order >= target) {
      await rest(`page_sections?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ sort_order: row.sort_order + 1 }),
      });
    }
  }
}

if (already) {
  await rest(`page_sections?id=eq.${already.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content, sort_order: target }),
  });
  console.log(`Offerings placed at sort ${target}`);
} else {
  for (const row of existing || []) {
    if (row.sort_order >= target) {
      await rest(`page_sections?id=eq.${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ sort_order: row.sort_order + 1 }),
      });
    }
  }
  await rest('page_sections', {
    method: 'POST',
    body: JSON.stringify({
      page_id: page.id,
      type: 'offerings',
      sort_order: target,
      is_visible: true,
      content,
    }),
  });
  console.log(`Inserted offerings at sort ${target}`);
}

const after = await rest(`page_sections?page_id=eq.${page.id}&select=sort_order,type&order=sort_order.asc`);
console.log((after || []).map((r) => `${r.sort_order}:${r.type}`).join(', '));
