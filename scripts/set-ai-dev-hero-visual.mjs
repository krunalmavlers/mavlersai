// One-off: turn on the `ai-pipeline` hero animation on /services/ai-development
// via the service-role REST client — mirrors migration 0013 for environments
// where only .env.local is available (no DATABASE_URL).
// Usage: node scripts/set-ai-dev-hero-visual.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const env = {};
for (const line of readFileSync(join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '').trim();
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing Supabase URL or service role key in .env.local');

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data: page, error: pErr } = await db
  .from('pages')
  .select('id')
  .eq('slug', 'services/ai-development')
  .maybeSingle();
if (pErr) throw pErr;
if (!page) throw new Error('No /services/ai-development page found');

const { data: heroes, error: sErr } = await db
  .from('page_sections')
  .select('id, content')
  .eq('page_id', page.id)
  .eq('type', 'hero');
if (sErr) throw sErr;
if (!heroes?.length) throw new Error('No hero section on /services/ai-development');

for (const hero of heroes) {
  const { error } = await db
    .from('page_sections')
    .update({ content: { ...hero.content, visual: 'ai-pipeline' } })
    .eq('id', hero.id);
  if (error) throw error;
  console.log(`hero ${hero.id}: visual = ai-pipeline`);
}

console.log('Done.');
