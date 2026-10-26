/** Shared facts for the three homepage studies. No rates. */

export const STALLS = [
  { n: '01', short: 'Not safe to launch', text: 'The prototype isn’t safe to launch' },
  { n: '02', short: 'Marketing can’t edit', text: 'Marketing can’t edit the site' },
  { n: '03', short: 'The bill jumped', text: 'The Vercel bill jumped' },
  { n: '04', short: 'The MVP has to ship', text: 'We need to launch the MVP' },
  { n: '05', short: 'Add an assistant', text: 'Add an AI assistant' },
  { n: '06', short: 'Move onto Vercel', text: 'Move the site onto Vercel' },
] as const;

export const PROOF = [
  { num: '15+', label: 'years of digital delivery' },
  { num: '15 days', label: 'beside you after launch' },
  { num: 'White-label', label: 'how agencies already work with us' },
  { num: 'Same week', label: 'for the first working session' },
] as const;

/** How the line is sold: two ways in, two builds, care, and the rescue that starts it. */
export const LINE = {
  subhead:
    'CMS and the cost audit are the ways in. AI and the MVP are the build. Platform ops and care keep a team on. Rescue is how a preview gets there.',
} as const;

export const WORK = [
  {
    n: '01',
    title: 'Next.js + custom CMS',
    mark: 'Lead',
    lead: true,
    prompt: 'Marketing can’t edit the Next.js site. We need a CMS they can run.',
    body: 'An editor on the Next.js site you already have, or a new marketing site the team can run. Payload in the repo by default. Sanity when the studio should be hosted.',
    points: ['Draft previews and scheduled publishing', 'Roles for who can edit and who can ship', 'A handover marketers can follow'],
  },
  {
    n: '02',
    title: 'Vercel cost audit',
    mark: 'Lead',
    lead: true,
    prompt: 'The Vercel bill jumped and we need to know why.',
    body: 'The bill, read before anyone rebuilds the site. Where the spend comes from, what can leave the server, and the limits that stop the next jump.',
    points: ['SSR moved to SSG, ISR, or cache', 'Fewer function calls, image and bundle fixes', 'Spend limits and alerts'],
  },
  {
    n: '03',
    title: 'AI builds',
    mark: 'Build',
    lead: false,
    prompt: 'Add an AI assistant.',
    body: 'Assistants and agents on the AI SDK, trained on content you already trust, with a ceiling on what they spend.',
    points: ['Chat trained on your site, docs, or catalogue', 'Multi-step work: qualification, documents, orders', 'Search over a site, and a pass on model cost'],
  },
  {
    n: '04',
    title: 'MVP to production',
    mark: 'Build',
    lead: false,
    prompt: 'We need to launch the MVP.',
    body: 'An AI prototype cleaned up, or a SaaS MVP finished with the parts a customer actually needs.',
    points: ['Auth, a database, and an admin someone can open', 'Stripe, Razorpay, or PayPal, plus the APIs around them', 'A real deploy on Vercel, not a share link'],
  },
  {
    n: '05',
    title: 'Vercel platform ops',
    mark: 'Care',
    lead: false,
    prompt: 'Move the site onto Vercel.',
    body: 'The move onto Vercel with no downtime, then the guardrails and the handover that keep a team on it.',
    points: ['Domains, DNS, SSL, environments, and secrets', 'Git preview links, CI checks, Firewall and bot protection', 'Monitoring, version upgrades, and a team that can run it'],
  },
  {
    n: '06',
    title: 'AI code rescue',
    mark: 'Entry',
    lead: true,
    prompt: 'The prototype isn’t safe to launch.',
    body: 'A limited AI prototype, hardened into an app that is safe to run. This is the way into platform ops and the care that follows launch.',
    points: ['Exposed keys taken off the client', 'A single file rebuilt as a Next.js app', 'OWASP flaws closed, and tests in place'],
  },
] as const;

/** Vercel pieces a production build actually names. */
export const SURFACE = [
  'AI SDK',
  'Firewall and Bot Protection',
  'Fluid compute and spend management',
  'ISR and Cache Components',
  'Preview Deployments',
  'Speed Insights and Analytics',
  'Vercel storage — Postgres, Blob, Edge Config, Redis',
] as const;
