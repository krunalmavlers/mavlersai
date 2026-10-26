-- Homepage: the rate card was internal reference for who we sell to,
-- not copy for the page. Replaces homepage sections only.
-- Safe to re-run. Does not touch other pages.
--
-- 0027 may already have been applied with the priced version. This
-- re-seeds the homepage from the current section list in that file's
-- shape: a plan on the hero, proof, two situations, the gap, the work,
-- the partnership, and a close that doesn't sell a free audit.

update public.pages
set meta_description = 'Tell us where the build stalled. A plan appears on the page, then a Mavlers engineer takes it the rest of the way.',
    updated_at = now()
where slug = '';

delete from public.page_sections
where page_id = (select id from public.pages where slug = '');

insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('launch_prompt', 1, $json${
    "eyebrow": "Next.js on Vercel",
    "heading_html": "Tell us where the build <span>stalled.</span>",
    "subhead": "A plan appears on this page. A Mavlers engineer takes it the rest of the way — most calls are the same week.",
    "field_label": "What’s in the way?",
    "placeholder": "The preview works. It isn’t safe to launch.",
    "button": "Show me a plan",
    "chips": [
      "The prototype isn’t safe to launch",
      "Marketing can’t edit the site",
      "The Vercel bill jumped",
      "We need to launch the MVP",
      "Add an AI assistant",
      "Move the site onto Vercel"
    ],
    "form_key": "homepage-diagnosis",
    "calendly_url": "https://calendly.com/mavlers-ai/30min",
    "calendly_duration": "30 minutes",
    "host_name": "Krunal Bakraniya",
    "host_role": "Expert AI Consultant",
    "host_photo": ""
  }$json$),
  ('stats_bar', 2, $json${
    "stats": [
      {"num": "15+", "label": "years of digital delivery"},
      {"num": "15 days", "label": "with you after every launch"},
      {"num": "White-label", "label": "the way agencies already work with us"},
      {"num": "Same week", "label": "for the first working session"}
    ]
  }$json$),
  ('lead_doors', 3, $json${
    "eyebrow": "Where builds stall",
    "heading": "Two situations we take the rest of the way.",
    "items": [
      {
        "kicker": "The site is live",
        "title": "Marketing still can’t change a sentence",
        "body": "The Next.js site works, and every edit is a ticket. We put an editor on it — previews, roles, and a handover the team can run.",
        "prompt": "Marketing can’t edit the Next.js site. We need a CMS they can run."
      },
      {
        "kicker": "The preview works",
        "title": "It isn’t safe to put in front of customers",
        "body": "A build that stops at the preview. We turn it into a production app, with a real boundary around the data.",
        "prompt": "The prototype isn’t safe to launch"
      }
    ]
  }$json$),
  ('pinned_stat', 4, $json${
    "eyebrow": "The production gap",
    "figure": "60%",
    "sentence": "of assessed vibe-coded apps leaked keys or credentials. That gap is what the rescue offer is for."
  }$json$),
  ('pillar_rail', 5, $json${
    "eyebrow": "The line",
    "heading": "From a preview to something your team can run.",
    "subhead": "CMS and the cost audit are the ways in. AI and the MVP are the build. Platform ops and care keep a team on. Rescue is how a preview gets there.",
    "items": [
      {"n": "01", "kicker": "Lead", "title": "Next.js + custom CMS", "body": "An editor on the Next.js site you already have, or a new marketing site the team can run. Payload in the repo by default. Sanity when the studio should be hosted.", "prompt": "Marketing can’t edit the Next.js site. We need a CMS they can run."},
      {"n": "02", "kicker": "Lead", "title": "Vercel cost audit", "body": "The bill, read before anyone rebuilds the site. Where the spend comes from, what can leave the server, and the limits that stop the next jump.", "prompt": "The Vercel bill jumped and we need to know why."},
      {"n": "03", "kicker": "Build", "title": "AI builds", "body": "Assistants and agents on the AI SDK, trained on content you already trust, with a ceiling on what they spend.", "prompt": "Add an AI assistant."},
      {"n": "04", "kicker": "Build", "title": "MVP to production", "body": "An AI prototype cleaned up, or a SaaS MVP finished with the parts a customer actually needs.", "prompt": "We need to launch the MVP."},
      {"n": "05", "kicker": "Care", "title": "Vercel platform ops", "body": "The move onto Vercel with no downtime, then the guardrails and the handover that keep a team on it.", "prompt": "Move the site onto Vercel."},
      {"n": "06", "kicker": "Entry", "title": "AI code rescue", "body": "A limited AI prototype, hardened into an app that is safe to run. This is the way into platform ops and the care that follows launch.", "prompt": "The prototype isn’t safe to launch."}
    ],
    "features": [
      "AI SDK",
      "Firewall and Bot Protection",
      "Fluid compute and spend management",
      "ISR and Cache Components",
      "Preview Deployments",
      "Speed Insights and Analytics",
      "Vercel storage — Postgres, Blob, Edge Config, Redis"
    ]
  }$json$),
  ('partnership', 6, $json${
    "eyebrow": "The partnership",
    "heading": "You bring the build. We take it to production.",
    "left_title": "You bring",
    "left_items": [
      "The prototype, the repo, or the Vercel project",
      "The team who has to live with it afterwards",
      "What done means, and when it has to ship",
      "The client relationship, if you’re an agency"
    ],
    "right_title": "We deliver",
    "right_items": [
      "A plan you can read before the call",
      "Production architecture, not another prompt",
      "A CMS your marketers can run",
      "Security, a handover, and the days after launch"
    ]
  }$json$),
  ('cta_band', 7, $json${
    "variant": "final",
    "heading": "Tell us where the build stalled.",
    "body": "A plan appears on this page. A Mavlers engineer takes it from there.",
    "ctas": [
      {"label": "Show me a plan", "href": "#prompt", "style": "primary"},
      {"label": "Talk to an engineer", "href": "/book-a-call", "style": "outline"}
    ]
  }$json$)
) as v(type, ord, content)
where public.pages.slug = '';
