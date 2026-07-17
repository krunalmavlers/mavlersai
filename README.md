# Mavlers.ai — Dynamic CMS Website

A production, fully database-driven marketing site + headless CMS for **Mavlers.ai**, built from the Claude Design brief. Every page, section, menu, form, SEO field, JSON-LD schema and tracking script is editable from an admin panel — no code changes needed to update content.

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database / Auth / Storage:** Supabase (Postgres + RLS)
- **WYSIWYG:** TipTap
- **Anti-spam:** reCAPTCHA v3 (server-verified)

## Features

| Capability | Where |
|---|---|
| Dynamic pages driven by DB | `pages` + `page_sections`, rendered by `src/app/(site)/[[...slug]]/page.tsx` |
| WYSIWYG editing per section | Admin → Pages → **visual section editor** — every section type has proper fields, repeaters (add/remove/reorder), CTA pickers and TipTap WYSIWYG (with a Raw JSON escape hatch) |
| File uploads on forms | Book-a-Call "Upload a brief" → private `uploads` bucket via `/api/forms/upload`; admins download via short-lived signed URLs (`/api/admin/file`) |
| SEO per page/post (title, meta, keywords, OG, canonical, robots) | Admin editors → server-rendered `<head>` |
| Editable URL slug | Admin → Pages / Posts → *Slug* field |
| Configurable URL structure | Admin → Settings → *URL config* (`implementations_base`, `insights_base`) |
| Per-page JSON-LD schema | Admin editors → *Schema (JSON-LD)* field |
| Third-party scripts (GA / GTM / FB Pixel + raw) in header | Admin → Settings → *Tracking & scripts* |
| Dynamic header/footer menus (add/edit/remove/reorder) | Admin → Menus |
| Dynamic forms + reCAPTCHA + DB storage + email hook | Admin → Forms / Submissions; `POST /api/forms/submit` |
| WordPress-style blog: Insights + Implementations (case studies) with **multiple categories** + tags | Admin → Insights & Implementations |

## 1. Prerequisites

- Node.js 18.18+ (tested on 20/22)
- A Supabase project (free tier is fine)
- A Google reCAPTCHA **v3** key pair (optional for local dev)

## 2. Install

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...           # Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...          # server-only; never exposed to the browser
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...     # optional locally (verification fails open without a secret)
RECAPTCHA_SECRET_KEY=...
```

## 3. Set up the database

Run the SQL migrations **in order** in the Supabase SQL editor
(Dashboard → SQL → New query), or via the Supabase CLI:

```
supabase/migrations/0001_init.sql          # schema + RLS + storage buckets
supabase/migrations/0002_seed.sql          # settings, menus, taxonomies, authors
supabase/migrations/0003_seed_pages.sql    # pages + sections + the Book a Call form
supabase/migrations/0004_seed_posts.sql    # 12 implementations + 7 insights
supabase/migrations/0005_admin_bootstrap.sql  # promote_admin() helper
```

With the CLI:

```bash
supabase link --project-ref <your-ref>
supabase db push        # applies everything in supabase/migrations
```

## 4. Create your admin login

1. Supabase → **Authentication → Users → Add user** (email + password), or sign up once.
2. In the SQL editor, run:

```sql
select public.promote_admin('you@example.com');
```

That inserts you into `admin_profiles`, which gates `/admin`.

## 5. Run

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (redirects to `/admin/login`)

## Architecture notes

- **Routing:** a single catch-all (`[[...slug]]`) resolves the request against
  `url_config` — it renders the implementations/insights list or detail, otherwise
  looks up a CMS `pages` row by slug. Changing a base slug in Settings changes the
  live URL structure with no redeploy.
- **Security model:** the public site reads with the **anon** key, so Row Level
  Security only ever exposes *published* content. All admin mutations, draft reads
  and form-submission writes go through server actions / the submit route using the
  **service-role** key, which never reaches the browser.
- **Sections:** `src/components/sections/Sections.tsx` maps a section `type` to a
  component (~17 types). Each type has a **visual editor** driven by a field schema
  in `src/components/admin/sectionSchemas.ts` (rendered by `fields.tsx`), so editors
  get real inputs, repeaters and WYSIWYG — no JSON required (Raw JSON is still there
  as a fallback). To add a section type: add a renderer case in `Sections.tsx`, a
  field schema in `sectionSchemas.ts`, and a template in `SectionManager.tsx`.
- **Uploads:** form files go to the private Supabase `uploads` bucket through a
  service-role server route (`/api/forms/upload`, 15 MB + type-limited). The
  submission stores a `{ __file, path, name, size }` reference; the admin downloads
  it via a signed URL from the admin-only `/api/admin/file` route. Public images use
  the public `media` bucket.
- **Email:** off by default (submissions are stored in the DB). To enable
  notifications, set `EMAIL_PROVIDER=resend` + `RESEND_API_KEY` + `EMAIL_FROM`
  in `.env.local` (see `src/lib/email.ts`) and add recipient emails to the form.

## Verify end-to-end

1. Home / Services / About / MVP / Governance render and match the design.
2. **Implementations** and **Insights** lists filter by category; detail pages render.
3. View source → correct `<title>`, `<meta name="description">`, and
   `application/ld+json`. GA/GTM snippets appear when their IDs are set in Settings.
4. Submit the **Book a Call** form (both modes) → a row appears in Admin → Submissions.
   With reCAPTCHA keys set, low-score/bot submissions are rejected.
5. In `/admin`: edit a section via WYSIWYG, add a header menu item, change a page
   slug, add an insight with two categories → changes appear on the public site.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```
