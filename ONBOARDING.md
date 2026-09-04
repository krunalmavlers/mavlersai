# Developer onboarding — Mavlers.ai

Setting up a new developer on this project. Steps 1–2 can only be done by a
project owner; steps 3–7 are run by the new developer on their own machine.

## 1. Access to grant (owner)

| What | Where | Role needed |
|---|---|---|
| Code | github.com/krunalmavlers/mavlersai → Settings → Collaborators | **Write** (so they can push branches) |
| Database | Supabase → project `eucbhrssjxfkiunblgqo` → Settings → Team | **Developer** (lets them read the API keys and open the SQL editor) |
| Hosting | Vercel/host dashboard → project → Members | Only if they need to see deploys |

## 2. Secrets handoff (owner)

`.env.local` is gitignored and **must stay that way** — it holds the service-role
key, which bypasses all Row Level Security. Send the values through a password
manager or a one-time secret link. Never paste them into Slack, email, a
committed file, or a ticket.

The values they need are the ones listed in [`.env.example`](.env.example).
Both Supabase keys come from Supabase → Settings → API.

## 3. Install prerequisites (developer)

Node 18.18+ — this project is currently developed on **Node 24** via
[nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 24 && nvm use 24
```

## 4. Clone and install

```bash
git clone https://github.com/krunalmavlers/mavlersai.git
cd mavlersai
npm install          # postinstall copies the self-hosted TinyMCE assets
```

## 5. Environment

```bash
cp .env.example .env.local
```

Fill in the values received in step 2. `NEXT_PUBLIC_SITE_URL` stays
`http://localhost:3000` locally. reCAPTCHA keys are optional for local work —
verification fails open when the secret is absent.

## 6. Database

The shared Supabase project is **already migrated** — do not re-run the
migrations against it. A new developer points at the same project and is ready
to go once their keys are in place.

Only run `supabase/migrations/*.sql` in order if you are standing up a *separate*
Supabase project (e.g. a personal sandbox). There are 13 migrations as of
`0013_ai_development_hero_visual.sql`; apply every one, in filename order.

**Why this matters:** `0002`–`0004` are *seed* files — re-running them on the
shared database duplicates pages, menus and posts. And the migration files are
not always the final word on live state: `0013` sets the AI Development hero to
the `ai-pipeline` animation, but the live site is deliberately on
`signal-lattice` (set afterwards via `scripts/set-ai-dev-hero-visual.mjs`).
Running `0013` against the shared project would silently change the live hero.

## 7. Admin login

Each developer needs their own admin user — do not share one:

1. Supabase → Authentication → Users → **Add user** (email + password).
2. Supabase → SQL editor:

```sql
select public.promote_admin('them@mavlers.com');
```

That inserts them into `admin_profiles`, which is what gates `/admin`.

## 8. Run

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

Sanity check before starting work: the home page renders, `/admin` accepts the
new login, and `npm run typecheck` is clean.

## Working agreements

- Branch off `main`; don't commit directly to it.
- `git pull` before starting — this repo moves fast and migrations land often.
- After pulling, if `package.json` changed run `npm install`; if a new file
  appeared in `supabase/migrations/` someone has changed the shared schema —
  check with them before assuming your local state matches.
- Never commit `.env.local` or paste the service-role key anywhere.
