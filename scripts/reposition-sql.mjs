import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'supabase/migrations/0002_seed.sql',
  'supabase/migrations/0003_seed_pages.sql',
  'supabase/migrations/0004_seed_posts.sql',
  'supabase/migrations/0009_home_redesign.sql',
];

const MAP = [
  // titles / taglines / schema
  ['Mavlers.ai — White-label AI & Automation Engineering for Agencies', 'Mavlers.ai — AI & Automation Engineering for Agencies & Brands'],
  ['Mavlers.ai — White-label AI & Automation Engineering', 'Mavlers.ai — AI & Automation Engineering for Agencies & Brands'],
  ['The white-label AI & automation delivery partner for digital, marketing and technology agencies.', 'The AI & automation delivery partner for digital and technology agencies — and the brands building automation directly.'],
  ['White-label AI & automation delivery partner for agencies and brands.', 'AI & automation engineering partner for digital and technology agencies and the brands they serve.'],
  ["('White-label', 'white-label')", "('Behind the scenes', 'white-label')"],
  // dual-audience positioning (home)
  ['You bring the industry expertise and the opportunity — we architect, build and scale production-grade AI and automation with your team. Backed by 15+ years of digital delivery.', "Whether you're an agency serving clients in a specific industry or a brand building automation directly, we architect, build and scale production-grade AI and automation with your team — backed by 15+ years of digital delivery."],
  ['Start where it makes sense for your agency', 'Start where it makes sense for your team'],
  ['For agencies with an opportunity or client problem that needs validation.', 'For teams with an opportunity or client problem that needs validation.'],
  ['plan a dedicated AI delivery pod for your agency.', 'plan a dedicated AI delivery pod for your team.'],
  // sections
  ['For agencies that want an embedded, scalable white-label delivery team.', 'For agencies and brands that want an embedded, scalable AI delivery team.'],
  ['White-label launch', 'Go-live launch'],
  ['White-label ready', 'Flexible engagement'],
  ['Work with us directly or as a white-label partner — whatever fits your setup.', 'Work with us directly or as a behind-the-scenes delivery partner — whatever fits your setup.'],
  ['production systems running under your brand — a full-stack AI and automation engineering team, available directly or white-label.', 'production systems running under your brand — a full-stack AI and automation engineering team, available directly or as your behind-the-scenes delivery partner.'],
  ['Direct or white-label, project or embedded pod.', 'Direct or behind the scenes, project or embedded pod.'],
  ['We regularly join calls white-label or advise you directly beforehand — whatever protects the relationship.', 'We can join calls behind the scenes as your delivery partner, or advise you directly beforehand — whatever protects the relationship.'],
  // posts (single-quoted SQL keeps the doubled apostrophe intact)
  ["delivered white-label under the agency''s brand", "delivered under the agency''s brand"],
  ["runs white-label under the agency''s brand", "runs under the agency''s brand"],
  ['Deliver white-label, sign NDAs', 'Deliver behind the scenes, sign NDAs'],
  ['How we keep white-label engagements invisible to end clients', 'How we keep agency engagements invisible to end clients'],
  ['White-label only works if it is truly invisible. Here is how we operate behind your brand.', 'Behind-the-scenes delivery only works if it is truly invisible. Here is how we operate behind your brand.'],
];

for (const f of FILES) {
  let txt = readFileSync(f, 'utf8');
  const before = txt;
  for (const [a, b] of MAP) txt = txt.split(a).join(b);
  // catch-all for any straggler
  const straggler = txt.match(/white[- ]?label/gi);
  if (straggler) {
    // Don't blindly mangle — report so we can handle explicitly.
    console.log(`WARN ${f}: ${straggler.length} unmapped white-label occurrence(s):`, [...new Set(straggler)]);
  }
  if (txt !== before) {
    writeFileSync(f, txt);
    console.log('updated', f);
  } else {
    console.log('no change', f);
  }
}
