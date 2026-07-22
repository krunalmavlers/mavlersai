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

// Ordered literal replacements — contextual first, catch-all last.
const MAP = [
  ['For agencies that want an embedded, scalable white-label delivery team.', 'For agencies and brands that want an embedded, scalable AI delivery team.'],
  ['White-label launch', 'Go-live launch'],
  ['White-label ready', 'Flexible engagement'],
  ['Work with us directly or as a behind-the-scenes delivery partner under your brand.', 'Work with us directly or as a behind-the-scenes delivery partner — or build it directly under your own brand.'],
  ['We regularly join calls white-label or advise you directly beforehand — whatever protects the relationship.', 'We can join calls behind the scenes as your delivery partner, or advise you directly beforehand — whatever protects the relationship.'],
  ['Direct or white-label, project or embedded pod.', 'Direct or behind the scenes, project or embedded pod.'],
  ['available directly or white-label.', 'available directly or as your behind-the-scenes delivery partner.'],
  ['Work with us directly or as a white-label partner — whatever fits your setup.', 'Work with us directly or as a behind-the-scenes delivery partner — whatever fits your setup.'],
  ['delivered white-label under the agency', 'delivered under the agency'],
  ['runs white-label under the agency', 'runs under the agency'],
  ['Deliver white-label, sign NDAs', 'Deliver behind the scenes, sign NDAs'],
  ['How we keep white-label engagements invisible to end clients', 'How we keep agency engagements invisible to end clients'],
  ['White-label only works if it is truly invisible. Here is how we operate behind your brand.', 'Behind-the-scenes delivery only works if it is truly invisible. Here is how we operate behind your brand.'],
  ['White-label engagements', 'Behind-the-scenes engagements'],
];

function clean(str) {
  if (typeof str !== 'string') return str;
  let out = str;
  for (const [a, b] of MAP) out = out.split(a).join(b);
  // Safety net for any straggler.
  out = out.replace(/white[- ]?label/gi, 'behind-the-scenes');
  return out;
}

async function run() {
  // ---- settings ----
  const { data: s } = await db.from('site_settings').select('*').maybeSingle();
  const org = { ...(s.organization_schema || {}) };
  org.description = 'AI & automation engineering partner for digital and technology agencies and the brands they serve.';
  await db.from('site_settings').update({
    default_meta_title: 'Mavlers.ai — AI & Automation Engineering for Agencies & Brands',
    tagline: 'The AI & automation delivery partner for digital and technology agencies — and the brands building automation directly.',
    default_meta_description: 'Mavlers.ai architects, builds, integrates and scales production-grade AI and automation — for digital and technology agencies serving their clients, and for brands building automation directly.',
    organization_schema: org,
  }).eq('id', s.id);
  console.log('settings updated');

  // ---- home page seo_title ----
  const { data: home } = await db.from('pages').select('id').eq('slug', '').maybeSingle();
  await db.from('pages').update({ seo_title: 'Mavlers.ai — AI & Automation Engineering for Agencies & Brands' }).eq('id', home.id);

  // page seo_title / meta cleanup across all pages
  const { data: pages } = await db.from('pages').select('id,seo_title,meta_description,title');
  for (const p of pages || []) {
    const patch = {};
    for (const k of ['seo_title', 'meta_description', 'title']) {
      const c = clean(p[k] || '');
      if (c !== (p[k] || '')) patch[k] = c;
    }
    if (Object.keys(patch).length) await db.from('pages').update(patch).eq('id', p.id);
  }
  console.log('pages cleaned');

  // ---- home hero + engagement + cta (dual-audience positioning) ----
  const { data: secs } = await db.from('page_sections').select('id,type,content');
  for (const sec of secs || []) {
    let content = sec.content || {};
    let changed = false;

    if (sec.type === 'hero' && /Turn deep industry expertise/i.test(JSON.stringify(content))) {
      content = {
        ...content,
        subhead:
          "Whether you're an agency serving clients in a specific industry or a brand building automation directly, we architect, build and scale production-grade AI and automation with your team — backed by 15+ years of digital delivery.",
      };
      changed = true;
    }
    if (sec.type === 'engagement_models') {
      content = { ...content };
      if (content.heading) content.heading = content.heading.replace('for your agency', 'for your team');
      if (Array.isArray(content.items)) {
        content.items = content.items.map((it) => ({
          ...it,
          body: (it.body || '').replace('For agencies with an opportunity or client problem that needs validation.', 'For teams with an opportunity or client problem that needs validation.'),
        }));
      }
      changed = true;
    }
    if (sec.type === 'cta_band' && typeof content.body === 'string') {
      content = { ...content, body: content.body.replace('for your agency.', 'for your team.') };
      changed = true;
    }

    // universal white-label cleanup for every section
    const cleaned = JSON.parse(clean(JSON.stringify(content)));
    const cleanedStr = JSON.stringify(cleaned);
    if (changed || cleanedStr !== JSON.stringify(sec.content || {})) {
      await db.from('page_sections').update({ content: cleaned }).eq('id', sec.id);
    }
  }
  console.log('sections updated');

  // ---- posts ----
  const { data: posts } = await db.from('posts').select('id,title,excerpt,meta_description,body_html');
  for (const p of posts || []) {
    const patch = {};
    for (const k of ['title', 'excerpt', 'meta_description', 'body_html']) {
      const c = clean(p[k] || '');
      if (c !== (p[k] || '')) patch[k] = c;
    }
    if (Object.keys(patch).length) await db.from('posts').update(patch).eq('id', p.id);
  }
  console.log('posts cleaned');

  // ---- taxonomy tag label ----
  const { data: tags } = await db.from('categories').select('id,name,slug').ilike('name', '%white%');
  for (const t of tags || []) {
    await db.from('categories').update({ name: 'Behind the scenes' }).eq('id', t.id);
    console.log('tag renamed:', t.slug, '->', 'Behind the scenes (slug kept)');
  }

  // ---- verify no white-label remains ----
  const scan = async (table, cols) => {
    const { data } = await db.from(table).select(cols.join(','));
    let hits = 0;
    for (const row of data || []) for (const c of cols) if (/white[- ]?label/i.test(typeof row[c] === 'string' ? row[c] : JSON.stringify(row[c] || ''))) hits++;
    return hits;
  };
  console.log('REMAINING white-label -> settings:', await scan('site_settings', ['tagline', 'default_meta_title', 'default_meta_description', 'organization_schema']),
    'pages:', await scan('pages', ['title', 'seo_title', 'meta_description']),
    'sections:', await scan('page_sections', ['content']),
    'posts:', await scan('posts', ['title', 'excerpt', 'meta_description', 'body_html']),
    'tags:', await scan('categories', ['name']));
}
run().then(() => console.log('DONE')).catch((e) => { console.error(e); process.exit(1); });
