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

export const WORK = [
  {
    n: '01',
    title: 'An editor on the Next.js site',
    body: 'Payload in the repo, Sanity when the studio should be hosted. Previews, roles, and a handover marketing can run.',
  },
  {
    n: '02',
    title: 'The bill, read properly',
    body: 'Where the spend comes from, what can leave the server, and what to change before the next invoice.',
  },
  {
    n: '03',
    title: 'An assistant that knows when to stop',
    body: 'Grounded on your content, with a handoff to a person and a cap on what it can spend.',
  },
  {
    n: '04',
    title: 'The MVP, finished',
    body: 'Auth, data, the path that takes a signup, and a deploy that is not a share link.',
  },
  {
    n: '05',
    title: 'The move, without a DNS weekend',
    body: 'Environments first, the domain last, and a way back if the first hour misbehaves.',
  },
  {
    n: '06',
    title: 'The prototype, closed up',
    body: 'Secrets off the client, real routes, an auth boundary, then someone still here after launch.',
  },
] as const;
