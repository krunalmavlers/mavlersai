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

const BLOCK1 = {
  eyebrow: 'The Mavlers group',
  heading: 'One group. Three connected capabilities.',
  html:
    '<p>Mavlers.ai is built on the digital delivery legacy, operational depth, and global experience of the Mavlers group.</p>' +
    '<p>Together, the group brings three complementary capabilities under one ecosystem:</p>' +
    '<ul>' +
    '<li><strong>Uplers</strong> — global talent and delivery infrastructure that helps businesses access skilled professionals and scale teams with confidence.</li>' +
    '<li><strong>Mavlers</strong> — full-service digital marketing, technology, and lifecycle execution for agencies and brands across global markets.</li>' +
    '<li><strong>Mavlers.ai</strong> — the AI and automation engineering division that transforms business ideas, workflows, and operational challenges into practical, scalable solutions.</li>' +
    '</ul>' +
    '<p>This shared foundation gives Mavlers.ai access to experienced engineers, marketers, solution architects, delivery teams, and domain specialists. It allows us to approach automation not only as a technology initiative, but as a business transformation opportunity.</p>',
};

const BLOCK2 = {
  eyebrow: 'Who we serve',
  heading: 'Built for agencies and brands',
  html:
    '<p>We work with agencies, enterprises, and growing brands that want to improve efficiency, connect fragmented systems, automate repetitive work, and create better customer and employee experiences.</p>' +
    '<p>Our solutions can support a wide range of needs — from internal workflow automation and AI-powered applications to intelligent reporting, marketing automation, customer support systems, data integration, and custom business platforms.</p>' +
    '<p>For agencies, we provide flexible and white-label delivery models that can operate seamlessly behind the scenes or as an extension of the internal team.</p>' +
    '<p>For brands and enterprises, we work as an AI and automation engineering partner, helping teams move from initial discovery and solution design to development, integration, deployment, and ongoing optimisation.</p>',
};

const BLOCK3 = {
  eyebrow: 'How we deliver',
  heading: 'Enterprise thinking. Practical execution.',
  html:
    '<p>Every solution is designed around real business requirements, existing technology environments, security expectations, and long-term scalability.</p>' +
    '<p>Our delivery approach combines senior engineering, structured project governance, secure development practices, and measurable business outcomes. We focus on building solutions that are not only innovative, but also reliable, maintainable, and ready for everyday use.</p>' +
    '<p>Whether the requirement is a focused automation workflow or a large-scale AI transformation initiative, Mavlers.ai brings the strategy, engineering capability, and delivery infrastructure needed to turn ideas into working solutions.</p>',
};

async function run() {
  const { data: pg } = await db.from('pages').select('id').eq('slug', 'about').maybeSingle();
  const { data: secs } = await db
    .from('page_sections')
    .select('id,type,sort_order')
    .eq('page_id', pg.id)
    .order('sort_order');

  const bySort = Object.fromEntries(secs.map((s) => [s.sort_order, s]));

  // Shift the visual sections below the narrative down by 2 (descending to avoid collisions).
  await db.from('page_sections').update({ sort_order: 8 }).eq('id', bySort[6].id); // cta_band
  await db.from('page_sections').update({ sort_order: 7 }).eq('id', bySort[5].id); // pillars
  await db.from('page_sections').update({ sort_order: 6 }).eq('id', bySort[4].id); // feature_grid (team)
  await db.from('page_sections').update({ sort_order: 5 }).eq('id', bySort[3].id); // stats_bar

  // Rewrite the existing rich_text (sort 2) as Block 1.
  await db.from('page_sections').update({ content: BLOCK1 }).eq('id', bySort[2].id);

  // Insert Block 2 (sort 3) and Block 3 (sort 4).
  const { error } = await db.from('page_sections').insert([
    { page_id: pg.id, type: 'rich_text', sort_order: 3, is_visible: true, content: BLOCK2 },
    { page_id: pg.id, type: 'rich_text', sort_order: 4, is_visible: true, content: BLOCK3 },
  ]);
  if (error) throw error;

  const { data: after } = await db
    .from('page_sections')
    .select('type,sort_order')
    .eq('page_id', pg.id)
    .order('sort_order');
  console.log('new order:', after.map((s) => `${s.sort_order}:${s.type}`).join(', '));
}
run().then(() => console.log('DONE')).catch((e) => { console.error(e); process.exit(1); });
