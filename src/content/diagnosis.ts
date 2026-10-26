/**
 * Static plans for the homepage artifact.
 * Production will swap `pickPlan` for a model. Until then, a handful of
 * handwritten plans stand in, chosen from the words the visitor used.
 * The default is the prototype-rescue plan.
 */

export const HERO_DEFAULTS = {
  eyebrow: 'Next.js on Vercel',
  headingHtml: 'Tell us where the build <span>stalled.</span>',
  subhead:
    'A plan appears on this page. A Mavlers engineer takes it the rest of the way — most calls are the same week.',
  fieldLabel: 'What’s in the way?',
  placeholder: 'The preview works. It isn’t safe to launch.',
  button: 'Show me a plan',
  chips: [
    'The prototype isn’t safe to launch',
    'Marketing can’t edit the site',
    'The Vercel bill jumped',
    'We need to launch the MVP',
    'Add an AI assistant',
    'Move the site onto Vercel',
  ],
};

export type PlanStep = { n: string; title: string; body: string };

export type Plan = {
  label: string;
  kicker: string;
  title: string;
  lede: string;
  steps: PlanStep[];
  helpTitle: string;
  help: string;
  cta: string;
  keys: string[];
};

const HELP_TITLE = 'How Mavlers helps';
const CTA = 'Let a Mavlers expert help with this';

const RESCUE: Plan = {
  label: 'Prototype rescue',
  kicker: 'Proposed plan',
  title: 'Get it out of the preview and into production.',
  lede:
    'If the build works in the preview and still isn’t safe to launch, the path is the same almost every time. This is a plan, not the build.',
  steps: [
    {
      n: '01',
      title: 'Take the secrets off the client',
      body: 'Keys that ship in the browser are already public. They move server-side before anyone else sees the app.',
    },
    {
      n: '02',
      title: 'Break the single file into a real Next.js app',
      body: 'Routes, a server boundary, and a structure someone else can work in. The preview stops being the product.',
    },
    {
      n: '03',
      title: 'Put an auth boundary in front of the data',
      body: 'Anything that reads or writes a record sits behind a session, so a guest can’t wander into it.',
    },
    {
      n: '04',
      title: 'Run a security pass, then hand it over',
      body: 'An OWASP pass, then a codebase your team can actually run — not another weekend of prompts.',
    },
  ],
  helpTitle: HELP_TITLE,
  help: 'We read this plan against your repo and take it the rest of the way. Most of those conversations happen the same week.',
  cta: CTA,
  keys: ['prototype', 'safe', 'lovable', 'bolt', 'cursor', 'v0', 'rescue', 'keys', 'secret'],
};

const CMS: Plan = {
  label: 'A CMS marketing can run',
  kicker: 'Proposed plan',
  title: 'Put an editor between marketing and the codebase.',
  lede:
    'If every sentence on the Next.js site is a ticket, the fix isn’t another developer in the loop. It’s an editor the team can run.',
  steps: [
    {
      n: '01',
      title: 'Pick the studio that fits the team',
      body: 'Payload in the repo by default. Sanity when you want the studio hosted and the editors somewhere else.',
    },
    {
      n: '02',
      title: 'Model only the pages they actually change',
      body: 'A handful of content types, with drafts and a preview, instead of the whole schema on day one.',
    },
    {
      n: '03',
      title: 'Give them roles and a scheduled publish',
      body: 'Who can edit, who can ship, and a way to see the page before it goes live.',
    },
    {
      n: '04',
      title: 'Leave a handover a new hire can follow',
      body: 'A short recording and a written path, so the next person isn’t reconstructing it from a Slack thread.',
    },
  ],
  helpTitle: HELP_TITLE,
  help: 'We put the CMS on the site you already have, then sit with the people who will use it.',
  cta: CTA,
  keys: ['marketing', 'edit', 'cms', 'content', 'sanity', 'payload', 'editor'],
};

const BILL: Plan = {
  label: 'The Vercel bill, read properly',
  kicker: 'Proposed plan',
  title: 'Find out why the bill moved before you change anything.',
  lede:
    'If the invoice jumped, the usual cause is work happening on every request that could have been built once, or cached.',
  steps: [
    {
      n: '01',
      title: 'Read the usage, not the total',
      body: 'Which routes, which functions, and which hours. The number on the invoice doesn’t say what to change.',
    },
    {
      n: '02',
      title: 'Move what doesn’t have to be live off the server',
      body: 'Pages that can be static, cached, or rebuilt on a schedule stop running on every visit.',
    },
    {
      n: '03',
      title: 'Cut the calls that fire on every page',
      body: 'Images, the bundle, and functions that chat to each other for no reason a visitor can see.',
    },
    {
      n: '04',
      title: 'Put a limit and an alert on it',
      body: 'The next jump arrives as a message, not as a surprise at the end of the month.',
    },
  ],
  helpTitle: HELP_TITLE,
  help: 'We do that read with you, on your dashboard, then make the changes that are actually worth making.',
  cta: CTA,
  keys: ['bill', 'invoice', 'spend', 'cost', 'expensive', 'jumped'],
};

const MVP: Plan = {
  label: 'MVP to production',
  kicker: 'Proposed plan',
  title: 'Take the MVP from a demo to something you can ship.',
  lede:
    'If the product works in a demo and still can’t be handed to a customer, it needs the unglamorous layer underneath the feature.',
  steps: [
    {
      n: '01',
      title: 'Put auth and a real data boundary in',
      body: 'Accounts, sessions, and a database that isn’t a file in the repo.',
    },
    {
      n: '02',
      title: 'Add the path that takes money or a signup',
      body: 'Payments or the lead, transactional email, and an admin someone on your side can open.',
    },
    {
      n: '03',
      title: 'Deploy it as a production app',
      body: 'Environments, secrets, preview links, and a domain — not a share URL from the tool that built it.',
    },
    {
      n: '04',
      title: 'Pass security, then hand it to the team',
      body: 'An OWASP pass and a codebase the next developer can run without you in the room.',
    },
  ],
  helpTitle: HELP_TITLE,
  help: 'We take the demo you have and finish the layer that makes it a product. Bring the repo.',
  cta: CTA,
  keys: ['mvp', 'payments', 'signup', 'launch the mvp'],
};

const ASSISTANT: Plan = {
  label: 'An assistant on your content',
  kicker: 'Proposed plan',
  title: 'Add an assistant that knows your content, and knows when to stop.',
  lede:
    'If you want an assistant on the site, the work is less about the chat box and more about what it is allowed to say.',
  steps: [
    {
      n: '01',
      title: 'Ground it on content you already trust',
      body: 'The site, the docs, or the catalogue — not the open internet, and not a prompt someone pasted once.',
    },
    {
      n: '02',
      title: 'Give it a way to hand off to a person',
      body: 'A chat UI that can stop, and a path to a human or a lead form when it should.',
    },
    {
      n: '03',
      title: 'Cap what it can spend',
      body: 'Usage limits, and a log of the conversations, so a busy week doesn’t become an open tab.',
    },
    {
      n: '04',
      title: 'Watch the first real week',
      body: 'Read what people asked, tighten what it answers, and only then let it sit unsupervised.',
    },
  ],
  helpTitle: HELP_TITLE,
  help: 'We build it on the AI SDK, against your content, and stay for the week it meets real questions.',
  cta: CTA,
  keys: ['assistant', 'chatbot', 'chat bot', 'ai search', 'agent'],
};

const MOVE: Plan = {
  label: 'Onto Vercel',
  kicker: 'Proposed plan',
  title: 'Move the site onto Vercel without a weekend of DNS.',
  lede:
    'If the move is what’s stalled, the risk is the cutover — domains, secrets, and a Friday deploy — not the framework.',
  steps: [
    {
      n: '01',
      title: 'Stand up environments before you touch the domain',
      body: 'Preview, staging, production, and the secrets each one is allowed to see.',
    },
    {
      n: '02',
      title: 'Prove the build on a preview URL',
      body: 'The site runs, the forms send, and the team has clicked through it before any DNS changes.',
    },
    {
      n: '03',
      title: 'Cut the domain over with a rollback',
      body: 'DNS, SSL, and a way back if the new host misbehaves in the first hour.',
    },
    {
      n: '04',
      title: 'Turn on the guardrails and hand them over',
      body: 'Firewall, bot rules, monitoring, and a written path the team can follow without us.',
    },
  ],
  helpTitle: HELP_TITLE,
  help: 'We run the move with you and stay through the cutover, not just the pull request.',
  cta: CTA,
  keys: ['move the site', 'migrate', 'onto vercel', 'dns', 'cutover'],
};

export const PLAYBOOKS: Plan[] = [RESCUE, CMS, BILL, MVP, ASSISTANT, MOVE];

/** The plan the hero shows before anyone has typed, and the fallback. */
export const STATIC_DIAGNOSIS: Plan = RESCUE;

export function pickPlan(text: string): Plan {
  const hay = text.toLowerCase();
  let best = RESCUE;
  let score = 0;
  for (const plan of PLAYBOOKS) {
    const next = plan.keys.reduce((n, key) => n + (hay.includes(key) ? 1 : 0), 0);
    if (next > score) {
      score = next;
      best = plan;
    }
  }
  return best;
}

export const PROMPT_EVENT = 'mavlers:prompt';
