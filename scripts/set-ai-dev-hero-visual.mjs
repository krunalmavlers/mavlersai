// Sets which hero animation /services/ai-development uses, via the service-role
// REST client — for environments where only .env.local is available (no
// DATABASE_URL). Valid values match the `visual` options in
// src/components/admin/sectionSchemas.ts.
// Usage: node scripts/set-ai-dev-hero-visual.mjs [signal-lattice]
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

const VISUALS = ['robot', 'ai-pipeline', 'signal-lattice', 'assembly-floor', 'emergence'];
const visual = process.argv[2] || 'signal-lattice';
if (!VISUALS.includes(visual)) {
  throw new Error(`Unknown visual "${visual}". Expected one of: ${VISUALS.join(', ')}`);
}

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
    .update({ content: { ...hero.content, visual } })
    .eq('id', hero.id);
  if (error) throw error;
  console.log(`hero ${hero.id}: visual = ${visual}`);
}

console.log('Done.');
