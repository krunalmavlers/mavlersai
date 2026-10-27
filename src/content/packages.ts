/** Fixed-scope offers for the homepage studies. The pages show scope and timeline. */

export type ServicePackage = {
  name: string;
  pillar: string;
  included: string;
  hours: string;
  price: string;
  priceNote?: string;
  timeline: string;
  prompt: string;
};

export type CarePlan = {
  name: string;
  hours: string;
  summary: string;
  prompt: string;
};

export const PACKAGES: ServicePackage[] = [
  {
    name: 'Vercel Bill Check',
    pillar: 'Cost',
    included: '30-minute call and a read of the usage dashboard, with the top 3 savings named',
    hours: '1',
    price: 'Free',
    timeline: 'Same week',
    prompt: 'The Vercel bill jumped and we need the top savings named.',
  },
  {
    name: 'Vercel Cost Audit',
    pillar: 'Cost',
    included: 'Line-by-line bill breakdown, per-page rendering review, written fix plan with estimated savings',
    hours: '12',
    price: '$420',
    priceNote: 'Credited to the fix',
    timeline: '3 days',
    prompt: 'The Vercel bill jumped and we need a written fix plan.',
  },
  {
    name: 'CMS Add-on',
    pillar: 'CMS',
    included: 'Payload or Sanity on an existing Next.js site, up to 10 content types, live preview, roles, editor training video',
    hours: '40–60',
    price: '$1,500–2,500',
    timeline: '2 weeks',
    prompt: 'Marketing can’t edit the Next.js site. We need a CMS they can run.',
  },
  {
    name: 'Next.js + CMS Site',
    pillar: 'CMS',
    included: 'New marketing site of up to 15 templates from approved designs, CMS, SEO basics, Speed Insights, Launch Kit included',
    hours: '80–100',
    price: '$2,000–3,000',
    timeline: '2–3 weeks',
    prompt: 'We need a new Next.js marketing site with a CMS the team can run.',
  },
  {
    name: 'AI Assistant',
    pillar: 'AI',
    included: 'AI SDK chatbot trained on the client’s content, chat UI, handoff to a human or a lead form, usage limits, conversation logs',
    hours: '30–40',
    price: '$800–1,000',
    timeline: '4–5 days',
    prompt: 'Add an AI assistant trained on our content.',
  },
  {
    name: 'AI Search',
    pillar: 'AI',
    included: 'Semantic search over a site or catalogue, indexing job, search UI, analytics',
    hours: '100–140',
    price: '$3,500–4,900',
    timeline: '3 weeks',
    prompt: 'We need AI search over the site or catalogue.',
  },
  {
    name: 'AI Cost Tune-up',
    pillar: 'AI',
    included: 'Model routing, caching, rate and usage limits, spend dashboard on an existing AI feature',
    hours: '30–40',
    price: '$800–1,200',
    timeline: '1 week',
    prompt: 'The AI feature is costing more than it should.',
  },
  {
    name: 'MVP Launch',
    pillar: 'MVP',
    included: '3–5 core features, auth, database, payments, admin panel, transactional email, production on Vercel, security',
    hours: '100–120',
    price: '$2,500–3,000',
    timeline: '2–3 weeks',
    prompt: 'We need to launch the MVP',
  },
  {
    name: 'Vercel Launch Kit',
    pillar: 'Platform',
    included: 'Move with no downtime, domains, DNS and SSL, environments and secrets, Git previews, CI checks, firewall and bot rules, monitoring, team handover',
    hours: '8–12',
    price: '$400',
    timeline: '2 days',
    prompt: 'Move the site onto Vercel',
  },
];

export const CARE: CarePlan[] = [
  {
    name: 'Care 10',
    hours: '10',
    summary: 'Version upgrades and security patches, uptime alerts, and a monthly speed and cost report.',
    prompt: 'We need someone on the site after launch.',
  },
  {
    name: 'Care 20',
    hours: '20',
    summary: 'Everything in Care 10, plus firewall tuning, small feature work, and a quarterly cost review.',
    prompt: 'We need someone on the site after launch, including small feature work.',
  },
];

export const OFFERING_NOTE =
  'Third-party costs sit with you: the Vercel plan and usage, AI model and API usage, CMS licences, and payment gateway fees.';

export function hoursLabel(hours: string) {
  return hours === '1' ? '1 hour' : `${hours} hours`;
}

export function packageGroups() {
  const order: string[] = [];
  const map = new Map<string, ServicePackage[]>();
  for (const item of PACKAGES) {
    if (!map.has(item.pillar)) {
      map.set(item.pillar, []);
      order.push(item.pillar);
    }
    map.get(item.pillar)!.push(item);
  }
  return order.map((pillar) => ({ pillar, items: map.get(pillar)! }));
}
