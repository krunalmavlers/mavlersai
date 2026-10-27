-- Homepage offerings. Scope and timeline only — no prices.
-- Sits after the production gap and before the line. Safe to re-run.

do $$
declare
  home uuid;
  payload jsonb := $json${
    "eyebrow": "Offerings",
    "heading": "What each engagement actually covers.",
    "subhead": "Nine ways in, and two ways to stay. Tell us which one matches the stall.",
    "groups": [
      {
        "id": "cost",
        "label": "Cost",
        "items": [
          {
            "name": "Vercel Bill Check",
            "summary": "A 30-minute call and a read of the usage dashboard, with the top 3 savings named.",
            "hours": "1 hour",
            "timeline": "Same week",
            "prompt": "The Vercel bill jumped and we need the top savings named."
          },
          {
            "name": "Vercel Cost Audit",
            "summary": "A line-by-line bill breakdown, a per-page rendering review, and a written fix plan with the savings estimated.",
            "hours": "12 hours",
            "timeline": "3 days",
            "prompt": "The Vercel bill jumped and we need a written fix plan."
          }
        ]
      },
      {
        "id": "cms",
        "label": "CMS",
        "items": [
          {
            "name": "CMS Add-on",
            "summary": "Payload or Sanity on an existing Next.js site. Up to 10 content types, live preview, roles, and an editor training video.",
            "hours": "40–60 hours",
            "timeline": "2 weeks",
            "prompt": "Marketing can’t edit the Next.js site. We need a CMS they can run."
          },
          {
            "name": "Next.js + CMS Site",
            "summary": "A new marketing site of up to 15 templates, a CMS, SEO basics, Speed Insights, and the launch kit.",
            "hours": "80–100 hours",
            "timeline": "2–3 weeks",
            "prompt": "We need a new Next.js marketing site with a CMS the team can run."
          }
        ]
      },
      {
        "id": "ai",
        "label": "AI",
        "items": [
          {
            "name": "AI Assistant",
            "summary": "An AI SDK chatbot trained on your content, a chat UI, a handoff to a person or a lead form, usage limits, and conversation logs.",
            "hours": "30–40 hours",
            "timeline": "4–5 days",
            "prompt": "Add an AI assistant trained on our content."
          },
          {
            "name": "AI Search",
            "summary": "Semantic search over a site or catalogue, an indexing job, a search UI, and analytics.",
            "hours": "100–140 hours",
            "timeline": "3 weeks",
            "prompt": "We need AI search over the site or catalogue."
          },
          {
            "name": "AI Cost Tune-up",
            "summary": "Model routing, caching, rate and usage limits, and a spend dashboard on an AI feature you already have.",
            "hours": "30–40 hours",
            "timeline": "1 week",
            "prompt": "The AI feature is costing more than it should."
          }
        ]
      },
      {
        "id": "mvp",
        "label": "MVP",
        "items": [
          {
            "name": "MVP Launch",
            "summary": "Three to five core features, auth, a database, payments, an admin panel, transactional email, production on Vercel, and a security pass.",
            "hours": "100–120 hours",
            "timeline": "2–3 weeks",
            "prompt": "We need to launch the MVP"
          }
        ]
      },
      {
        "id": "platform",
        "label": "Platform",
        "items": [
          {
            "name": "Vercel Launch Kit",
            "summary": "A move with no downtime. Domains, DNS, and SSL, environments and secrets, Git previews, CI checks, firewall and bot rules, monitoring, and a team handover.",
            "hours": "8–12 hours",
            "timeline": "2 days",
            "prompt": "Move the site onto Vercel"
          }
        ]
      }
    ],
    "care": [
      {
        "name": "Care 10",
        "hours": "10",
        "summary": "Version upgrades and security patches, uptime alerts, and a monthly speed and cost report.",
        "prompt": "We need someone on the site after launch."
      },
      {
        "name": "Care 20",
        "hours": "20",
        "summary": "Everything in Care 10, plus firewall tuning, small feature work, and a quarterly cost review.",
        "prompt": "We need someone on the site after launch, including small feature work."
      }
    ],
    "footnote": "Third-party costs sit with you: the Vercel plan and usage, AI model and API usage, CMS licences, and payment gateway fees."
  }$json$::jsonb;
  gap_order int;
  target int;
begin
  select id into home from public.pages where slug = '';
  if home is null then
    return;
  end if;

  select sort_order into gap_order
  from public.page_sections
  where page_id = home and type = 'pinned_stat'
  order by sort_order
  limit 1;

  target := coalesce(gap_order, 4) + 1;

  if not exists (
    select 1 from public.page_sections where page_id = home and type = 'offerings'
  ) then
    update public.page_sections
    set sort_order = sort_order + 1
    where page_id = home and sort_order >= target;

    insert into public.page_sections (page_id, type, sort_order, is_visible, content)
    values (home, 'offerings', target, true, payload);
  else
    if not exists (
      select 1 from public.page_sections
      where page_id = home and type = 'offerings' and sort_order = target
    ) then
      update public.page_sections
      set sort_order = 1000
      where page_id = home and type = 'offerings';

      update public.page_sections
      set sort_order = sort_order + 1
      where page_id = home and type <> 'offerings' and sort_order >= target;

      update public.page_sections
      set sort_order = target
      where page_id = home and type = 'offerings';
    end if;

    update public.page_sections
    set content = payload
    where page_id = home and type = 'offerings';
  end if;
end $$;
