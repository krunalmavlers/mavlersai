import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
for (const l of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '').trim();
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const NEW_ITEM = {
  id: 'dashboards',
  cat: 'Business Intelligence',
  mono: 'BI',
  short: 'AI Dashboards',
  title: 'AI-Driven Automated Dashboard Development',
  tagline:
    'Building a custom business dashboard is a challenge for every team — we build AI-driven dashboards that assemble themselves and turn scattered data into clear business insights.',
  build: [
    'Custom, branded dashboards that unify data from every tool you run',
    'AI-generated narratives that explain what changed, and why',
    'Natural-language querying — ask a question, get the chart and the answer',
    'Automated alerts, anomaly detection and recommended next actions',
  ],
  detail: [
    'Automated data pipelines that model and refresh your metrics on schedule',
    'An LLM layer that summarises trends and surfaces insights, not just numbers',
    'Role-based views and access control for internal teams and clients',
    'Embeddable, responsive dashboards with exports and scheduled reports',
  ],
  stack: ['Next.js', 'Postgres / BigQuery', 'LLM APIs', 'Charting'],
  outcome:
    'Every team sees the metrics that matter — with AI explaining the story behind them — instead of waiting on hand-built reports.',
};

async function run() {
  const { data: pg } = await db.from('pages').select('id').eq('slug', 'services').maybeSingle();
  const { data: sec } = await db
    .from('page_sections')
    .select('id, content')
    .eq('page_id', pg.id)
    .eq('type', 'services_detail')
    .maybeSingle();

  const content = sec.content || {};
  const items = Array.isArray(content.items) ? [...content.items] : [];

  if (items.some((i) => i.id === 'dashboards')) {
    console.log('dashboards service already present — nothing to do.');
    return;
  }

  // Insert right after "Custom AI Application Development" so it sits with the
  // AI-engineering / product cluster.
  const idx = items.findIndex((i) => i.id === 'custom-ai');
  const at = idx >= 0 ? idx + 1 : items.length;
  items.splice(at, 0, NEW_ITEM);

  const { error } = await db
    .from('page_sections')
    .update({ content: { ...content, items } })
    .eq('id', sec.id);
  if (error) throw error;
  console.log(`Inserted "AI-Driven Automated Dashboard Development" at index ${at}. Total items: ${items.length}`);
}
run().then(() => console.log('DONE')).catch((e) => { console.error(e); process.exit(1); });
