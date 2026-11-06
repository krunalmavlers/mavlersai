/** Copy for the /v5 MVP offer page. Square-bracket placeholders from the brief
 *  (logos, result lines, testimonial, named clients) are omitted until approved. */

export const BOOK_URL = 'https://calendly.com/mavlers-ai/30min';

export const MVP_TITLE = 'MVP Development in 6 Weeks — $4,999 Fixed Price';
export const MVP_DESCRIPTION =
  'Strategy, design, development, launch and 12 months of hosting for a fixed $4,999. A dedicated PM and a working MVP in about 6 weeks.';

export const INCLUDED = [
  {
    title: 'Strategy',
    body: 'A discovery session, plus market and competitor research to find what makes your product stand out.',
  },
  {
    title: 'Planning',
    body: 'Prioritised features, user flows and a clear delivery plan you sign off before design starts.',
  },
  {
    title: 'Design',
    body: 'Wireframes and polished UI for up to 8 screens, with 2 rounds of revisions.',
  },
  {
    title: 'Development',
    body: 'Built on Next.js with secure login, a database and an admin panel.',
  },
  {
    title: 'Launch',
    body: 'Testing, your custom domain, SSL, security, analytics and go-live.',
  },
  {
    title: 'Post-launch support',
    body: '15 business days of fixes and tweaks after you go live.',
  },
  {
    title: '12 months of hosting',
    body: 'Vercel and database hosting set up, monitored and paid for by us for a year.',
  },
] as const;

export const PROCESS = [
  {
    when: 'Week 1',
    title: 'Strategy and planning',
    body: 'Discovery call, market research, feature plan and user flows.',
  },
  {
    when: 'Week 2',
    title: 'Design',
    body: 'Wireframes, then UI for every screen, signed off by you.',
  },
  {
    when: 'Weeks 3–5',
    title: 'Build',
    body: 'Development with a new preview link every week.',
  },
  {
    when: 'Week 6',
    title: 'Launch',
    body: 'Testing, go-live, handover and a walkthrough video.',
  },
  {
    when: 'After launch',
    title: 'Support',
    body: '15 business days of fixes, then hosting that keeps running for 12 months.',
  },
] as const;

export const AUDIENCE = [
  {
    title: 'Founders',
    body: 'Validate your startup idea with real users before raising or hiring.',
  },
  {
    title: 'Businesses',
    body: 'Launch a customer portal, booking tool or internal app without building a tech team.',
  },
  {
    title: 'AI prototype owners',
    body: 'Turn your Lovable, Bolt, v0 or Cursor demo into a secure, production-ready product.',
  },
  {
    title: 'Agencies',
    body: 'Offer apps to your clients under your brand, with white-label delivery from Mavlers.',
  },
] as const;

export const PRICE_CHECKS = [
  'Dedicated PM',
  'Strategy and market research',
  'UI/UX design (up to 8 screens)',
  'Next.js development',
  'Launch on Vercel',
  '15 business days of support',
  '12 months of Vercel and database hosting',
  'You own the code',
] as const;

export const SCOPE_IN = [
  'Responsive web app for desktop and mobile',
  'Up to 8 unique screens',
  '1 user type plus an admin panel',
  'Up to 3 core features, one of which can be AI-powered',
  'Email and Google login',
  '1 integration, such as Stripe payments or a third-party API',
  'Transactional emails',
] as const;

export const SCOPE_ADD = [
  'Native iOS and Android apps',
  'Extra screens, features or user roles',
  'Additional integrations',
  'Ongoing development and care plans',
] as const;

export const WORK = [
  {
    name: 'Timesheet and fleet platform',
    body: 'A custom operations platform for timesheets, jobs and reporting.',
  },
  {
    name: 'AI assistant',
    body: "A chatbot trained on the client's own content to answer customer questions.",
  },
  {
    name: 'Prototype rescue',
    body: 'An AI-built prototype rebuilt for secure, production-ready launch.',
  },
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What does $4,999 really include?',
    a: 'Strategy, planning, design, development, launch, 15 business days of support and 12 months of hosting, all run by a dedicated PM. No hidden fees.',
  },
  {
    q: 'How long does it take?',
    a: 'About 6 weeks from kick-off to launch, depending on how quickly you give feedback.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes, from day one. The code, the design files and your data all belong to you.',
  },
  {
    q: 'What happens after 12 months of hosting?',
    a: 'Move to one of our care plans, or we transfer the hosting to your own account.',
  },
  {
    q: 'What if my idea is bigger than an MVP?',
    a: "We'll tell you on the first call and give you a clear quote for the extra scope, or help you cut it down to a strong first version.",
  },
  {
    q: 'Can you fix an app I built with an AI tool?',
    a: 'Yes. We review your prototype and take it to a secure, production-ready launch.',
  },
  {
    q: 'Can you add AI features?',
    a: 'Yes. One of your three core features can be AI-powered, such as a chatbot, smart search or an automated workflow.',
  },
  {
    q: 'What tech do you use?',
    a: 'Next.js, Vercel and Supabase, plus Stripe for payments and OpenAI or Anthropic models for AI features.',
  },
  {
    q: 'Do you work with agencies?',
    a: 'Yes. We deliver white-label, so your client only sees your brand.',
  },
];

export const STACK = ['Next.js', 'Vercel', 'Supabase', 'Stripe', 'OpenAI / Anthropic'] as const;
