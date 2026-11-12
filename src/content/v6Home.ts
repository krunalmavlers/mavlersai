/** Copy for the live homepage. Same offer as /v5, written to be read faster. */

export { BOOK_URL } from '@/content/mvpHome';

export const V6_TITLE = 'Ship an MVP in 6 Weeks — Starts from $4,999';
export const V6_DESCRIPTION =
  'One team takes your idea from a sentence to a launched Next.js product in about 6 weeks, starting from $4,999, with 12 months of hosting included.';

export const TICKER = [
  'Strategy',
  'Design',
  'Next.js',
  'Weekly previews',
  'You own the code',
  '6 weeks',
  'From $4,999',
  '12 months of hosting',
  'Dedicated PM',
] as const;

export const SLOW = [
  {
    title: 'Freelancers disappear.',
    body: 'One person cannot hold strategy, design, code and hosting. You end up running the project.',
  },
  {
    title: 'Agencies start at $20k.',
    body: 'A long contract and a slow calendar, before a single user has tried the idea.',
  },
  {
    title: 'AI demos stall at the demo.',
    body: 'Lovable, Bolt, v0 and Cursor can sketch it. They do not give you secure login, real data, or a launch you would hand a customer.',
  },
] as const;

export const FAST = [
  {
    title: 'One project manager.',
    body: 'A single person learns the idea, writes the plan with you, and is your only point of contact.',
  },
  {
    title: 'Starts from $4,999.',
    body: 'The scope is signed before design starts. You are not buying a blank estimate.',
  },
  {
    title: 'A launch, not a prototype.',
    body: 'Secure login, a database, your domain, and a product people can actually sign up for.',
  },
] as const;

export const OFFER =
  'Mavlers MVP Launch runs from the first call to a working product. Your PM researches the market, locks the plan with you, and sends a preview link every week so the build is never a surprise.';

export const INCLUDED = [
  {
    title: 'Strategy',
    body: 'A discovery session, plus market and competitor research, so the first version has a point of view.',
  },
  {
    title: 'Planning',
    body: 'The features that matter, the user flows, and a delivery plan you sign before design starts.',
  },
  {
    title: 'Design',
    body: 'Wireframes, then polished UI for up to 8 screens, with two rounds of revisions.',
  },
  {
    title: 'Development',
    body: 'A Next.js app with secure login, a database, and an admin panel.',
  },
  {
    title: 'Launch',
    body: 'Testing, your domain, SSL, security, analytics, and the day it goes live.',
  },
  {
    title: 'Aftercare',
    body: '15 business days of fixes and tweaks once real people are using it.',
  },
  {
    title: 'A year of hosting',
    body: 'Vercel and the database, set up, watched, and paid for by us for 12 months.',
  },
] as const;

export const PROCESS = [
  {
    when: 'Week 1',
    title: 'Strategy and planning',
    body: 'Discovery, market research, the feature plan, and the flows.',
  },
  {
    when: 'Week 2',
    title: 'Design',
    body: 'Wireframes, then the UI for every screen, signed off by you.',
  },
  {
    when: 'Weeks 3–5',
    title: 'Build',
    body: 'Development in the open. A new preview link every week.',
  },
  {
    when: 'Week 6',
    title: 'Launch',
    body: 'Testing, go-live, handover, and a walkthrough video.',
  },
  {
    when: 'After',
    title: 'Support',
    body: '15 business days of fixes. Hosting keeps running for 12 months.',
  },
] as const;

export const AUDIENCE = [
  {
    title: 'Founders',
    body: 'You want real users on the idea before you raise, hire, or spend a year building the wrong thing.',
  },
  {
    title: 'Operators',
    body: 'You need a portal, a booking tool, or an internal app, and you do not want to stand up a tech team to get it.',
  },
  {
    title: 'Prototype owners',
    body: 'The Lovable, Bolt, v0 or Cursor demo works in a tab. It needs to survive contact with real users.',
  },
  {
    title: 'Agencies',
    body: 'You want to offer apps under your own brand. We deliver white-label, so your client only sees you.',
  },
] as const;

export const PRICE_CHECKS = [
  'Dedicated project manager',
  'Strategy and market research',
  'UI for up to 8 screens, two revision rounds',
  'Next.js development',
  'Launch on your domain',
  '15 business days of support',
  '12 months of hosting',
  'You own the code',
] as const;

export const SCOPE_IN = [
  'Responsive web app, desktop and mobile',
  'Up to 8 unique screens',
  'One user type, plus an admin panel',
  'Up to 3 core features — one can be AI',
  'Email and Google login',
  'One integration, such as Stripe or an API',
  'Transactional email',
] as const;

export const SCOPE_ADD = [
  'Native iOS and Android apps',
  'Extra screens, features, or user roles',
  'More integrations',
  'Ongoing development and care plans',
] as const;

export const HOSTING =
  'We set up, monitor, and pay for Vercel and Supabase for 12 months from launch. That is fast global hosting, a managed database, daily backups, and room for up to 100,000 monthly active users. When the year ends, stay with us on a care plan or move it to your own account.';

export const WORK = [
  {
    name: 'Timesheet and fleet platform',
    body: 'Jobs, timesheets, and reporting, built as the system an operations team actually runs.',
  },
  {
    name: 'AI assistant',
    body: 'A chatbot trained on the client’s own content, answering real customer questions.',
  },
  {
    name: 'Prototype rescue',
    body: 'An AI-built demo taken apart and rebuilt so it could launch with real accounts and real data.',
  },
] as const;

export const STACK = ['Next.js', 'Vercel', 'Supabase', 'Stripe', 'OpenAI / Anthropic'] as const;

export const CALL_STEPS = [
  { n: '01', title: 'You bring the idea', body: 'Rough is fine. A sentence, a deck, or a broken prototype.' },
  { n: '02', title: 'We draw the box', body: 'What fits in six weeks, what it costs, and what should wait.' },
  { n: '03', title: 'You pick the date', body: 'If it is a yes, we book kickoff. If it is a no, you still leave with a plan.' },
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What does a project starting from $4,999 actually include?',
    a: 'Strategy, planning, design, development, launch, 15 business days of support, and 12 months of hosting, run by a dedicated PM. The price starts from $4,999.',
  },
  {
    q: 'Is six weeks a real timeline?',
    a: 'About six weeks from kickoff to launch. It holds when feedback comes back on time. If it will not hold, we say so on the first call.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes, from day one. The code, the design files, and your data belong to you.',
  },
  {
    q: 'What happens when the hosting year ends?',
    a: 'Move onto a care plan, or we transfer the hosting to your own account. Either way, it is already yours.',
  },
  {
    q: 'What if my idea is bigger than an MVP?',
    a: 'We will tell you on the first call. Then we quote the extra scope, or help you cut it to a first version that is still worth launching.',
  },
  {
    q: 'Can you take over an app I built with an AI tool?',
    a: 'Yes. We review the prototype and take it to a secure, production-ready launch.',
  },
  {
    q: 'Can a feature be AI-powered?',
    a: 'Yes. One of the three core features can be AI — a chatbot, smart search, or an automated workflow. Model usage is billed by that provider.',
  },
  {
    q: 'What is it built with?',
    a: 'Next.js, Vercel, and Supabase. Stripe when you take payments. OpenAI or Anthropic when a feature should be AI.',
  },
  {
    q: 'Can you work under our agency’s brand?',
    a: 'Yes. Delivery is white-label. Your client sees your brand, not ours.',
  },
];
