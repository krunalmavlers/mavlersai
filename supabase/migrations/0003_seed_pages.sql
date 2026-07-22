-- ============================================================================
-- Mavlers.ai — Seed: pages, sections, and the Book a Call form.
-- Run AFTER 0002_seed.sql.
-- ============================================================================

-- ===========================================================================
-- PAGES
-- ===========================================================================
insert into public.pages (slug, title, seo_title, meta_description, status, sort_order, schema_jsonld) values
  ('', 'Home',
   'Mavlers.ai — AI & Automation Engineering for Agencies & Brands',
   'The engineering team behind agencies and brands. We architect, build, integrate and scale production-grade AI and automation under your brand.',
   'published', 1,
   $json${"@context":"https://schema.org","@type":"WebSite","name":"Mavlers.ai","url":"https://mavlers.ai"}$json$::jsonb),
  ('services', 'Services',
   'AI & Automation Services — Mavlers.ai',
   'The engineering capability behind your AI and automation ideas: custom AI, RAG, agents, automation, integration and MVP development.',
   'published', 2, '{}'::jsonb),
  ('about', 'About',
   'About Mavlers.ai — Built on a Digital Delivery Legacy',
   'Built on a digital delivery legacy. Focused on the AI-enabled future. Part of the Mavlers group.',
   'published', 3, '{}'::jsonb),
  ('mvp', 'MVP Development',
   'AI MVP Development — Mavlers.ai',
   'Launch your AI MVP faster, without traditional development overhead. The speed of vibe coding with the discipline of professional product engineering.',
   'published', 4, '{}'::jsonb),
  ('governance', 'AI Governance',
   'AI Governance & Security — Mavlers.ai',
   'AI you can trust — governed, secure and accountable. Aligned to ISO/IEC 42001, NIST AI RMF, OECD, GDPR and the EU AI Act.',
   'published', 5, '{}'::jsonb),
  ('book-a-call', 'Book a Call',
   'Book a Call — Mavlers.ai',
   'You do not need a finished AI strategy to start. Book a call or submit a requirement and our AI consultants will help you find the right pathway.',
   'published', 6, '{}'::jsonb);

-- ===========================================================================
-- HOME sections
-- ===========================================================================
insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('hero', 1, $json${"animated":true,"badge":"AI & automation engineering for agencies and brands","heading_html":"Turn deep industry expertise into <span>working AI solutions.</span>","subhead":"Mavlers.ai is the engineering team behind agencies and brands that know their industry. You bring the domain expertise and the opportunity; we architect, build, integrate and scale production-grade AI and automation — with your team, at your pace. Backed by 15+ years of digital delivery worldwide.","primary_cta":{"label":"Book a Call","href":"/book-a-call"},"secondary_cta":{"label":"Explore Our Services","href":"/services"},"note":"Work with us directly or as a behind-the-scenes delivery partner. Flexible engagement, senior engineering, secure by default.","trust_items":["Agencies & brands","Production-ready engineering","Flexible teams","Secure delivery","Ongoing support"]}$json$),
  ('stats_bar', 2, $json${"stats":[{"num":"15+","label":"years of digital delivery"},{"num":"500+","label":"agency relationships"},{"num":"52+","label":"countries served"},{"num":"80+","label":"AI-enabled developers"},{"num":"10","label":"AI technology consultants"},{"num":"1000s","label":"projects delivered"}],"logos_title":"The platforms agencies already build on","logos":["Salesforce","HubSpot","Marketo","Braze","Microsoft","Zendesk","Shopify","n8n"]}$json$),
  ('feature_grid', 3, $json${"eyebrow":"The agency opportunity","heading":"AI opportunities are everywhere. The capability to build them isn't.","columns":3,"items":[{"n":"1","title":"Demand is moving faster than internal capability","body":"Teams are spotting valuable AI use cases but rarely have the specialized engineers to implement them."},{"n":"2","title":"Building an internal AI team is expensive","body":"Recruitment, experimentation, architecture, security and ongoing model changes require significant investment."},{"n":"3","title":"Most AI vendors don't understand your context","body":"You need a delivery partner that respects your domain, your standards and — when relevant — your client relationships."}],"callout":{"text":"Mavlers.ai gives agencies and brands the engineering capability to ship AI — without building a separate team.","cta":{"label":"Start the conversation","href":"/book-a-call"}}}$json$),
  ('partnership', 4, $json${"eyebrow":"The partnership model","heading":"Your expertise. Our engineering. One solution.","left_title":"You bring","left_items":["Industry knowledge","Business context","The opportunity","Strategic direction","Client & brand ownership"],"right_title":"Mavlers.ai delivers","right_items":["Opportunity validation","Solution architecture","UX & prototyping","AI engineering","Automation workflows","System integration","QA & deployment","Maintenance & scaling"]}$json$),
  ('service_capabilities', 5, $json${"eyebrow":"What we build","heading":"Engineering capabilities, ready to deploy under your brand","link":{"label":"Explore all services →","href":"/services"},"items":[{"mono":"AI","title":"Custom AI Development","body":"Bespoke AI applications, copilots and intelligent interfaces built for your client."},{"mono":"RAG","title":"RAG & Knowledge Systems","body":"Retrieval-augmented assistants grounded in your client's own trusted content."},{"mono":"AG","title":"AI Agents","body":"Tool-enabled agents that complete real business tasks end to end."},{"mono":"WF","title":"Workflow Automation","body":"n8n, Make and Langflow automations that remove manual, repetitive work."},{"mono":"OR","title":"AI Orchestration","body":"Coordinated multi-agent and multi-model workflows with observability."},{"mono":"MCP","title":"MCP Development","body":"Custom Model Context Protocol servers and connectors for secure tool access."},{"mono":"API","title":"API & Platform Integration","body":"Connect CRMs, ERPs, LLMs and custom APIs into one orchestrated system."},{"mono":"MVP","title":"AI-Powered MVP Development","body":"Validate and launch AI products faster with disciplined engineering."}]}$json$),
  ('connect_grid', 6, $json${"eyebrow":"What we can connect","heading":"Every system your client already runs","subhead":"We orchestrate data and workflows across the tools your clients depend on — turning disconnected platforms into one intelligent ecosystem.","items":["Websites","CRMs","ERPs","Marketing Automation","Analytics","Customer Support","Email Platforms","Cloud Storage","Knowledge Bases","Databases","LLM Providers","Custom APIs"]}$json$),
  ('cta_band', 7, $json${"variant":"center","eyebrow":"Implementations","heading":"AI in action across industries and the digital lifecycle","body":"Explore the workflows, agents and integrations we build for agency clients — from marketing and sales to support, operations and internal productivity.","ctas":[{"label":"Explore Our Implementations →","href":"/implementations","style":"primary"}]}$json$),
  ('engagement_models', 8, $json${"eyebrow":"Engagement models","heading":"Start where it makes sense for your team","items":[{"step":"01","title":"Discovery & Feasibility","body":"For teams with an opportunity or client problem that needs validation.","featured":false},{"step":"02","title":"Proof of Concept","body":"For quickly validating the technical and business feasibility of a solution.","featured":false},{"step":"03","title":"Project-Based Implementation","body":"For defined AI, automation or integration requirements.","featured":false},{"step":"04","title":"Dedicated AI Delivery Pod","body":"For agencies and brands that want an embedded, scalable AI delivery team.","featured":true}]}$json$),
  ('process_timeline', 9, $json${"eyebrow":"Delivery process","heading":"From client opportunity to production deployment","steps":[{"n":"1","title":"Opportunity discussion"},{"n":"2","title":"Business & technical discovery"},{"n":"3","title":"Solution blueprint"},{"n":"4","title":"Prototype / proof of concept"},{"n":"5","title":"Implementation"},{"n":"6","title":"Integration & testing"},{"n":"7","title":"Go-live launch"},{"n":"8","title":"Optimization & support"}]}$json$),
  ('pillars', 10, $json${"eyebrow":"Why teams choose Mavlers.ai","heading":"A delivery partner built around how you actually work","items":[{"title":"Flexible engagement model","body":"Work with us directly or as a behind-the-scenes delivery partner — whatever fits your setup."},{"title":"Established delivery legacy","body":"More than a decade of digital delivery for global agencies and brands."},{"title":"Cross-functional AI teams","body":"Consultants, architects, engineers and QA working as one delivery unit."},{"title":"Flexible scaling","body":"Scale a pod up or down as client demand and opportunity shift."},{"title":"Security & confidentiality","body":"NDA-supported delivery, role-based access and secure environments."},{"title":"Long-term support","body":"Ongoing maintenance, optimization and model updates after launch."}]}$json$),
  ('trust_band', 11, $json${"eyebrow":"How we work with you","text":"Engage us directly as your AI engineering team, or as a behind-the-scenes delivery partner under your brand. Either way — senior engineers, secure delivery, and full ownership stays with you."}$json$),
  ('cta_band', 12, $json${"variant":"final","heading":"Have a client opportunity you want to explore?","body":"Bring us the challenge, use case or early-stage idea. Our AI consultants will help you identify the right implementation pathway.","ctas":[{"label":"Book a Call With an AI Expert","href":"/book-a-call","style":"primary"},{"label":"Or submit a project brief →","href":"/book-a-call","style":"link"}]}$json$)
) as v(type, ord, content)
where public.pages.slug = '';

-- ===========================================================================
-- SERVICES sections
-- ===========================================================================
insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('hero', 1, $json${"badge":"Services","heading_html":"The engineering capability behind your <span>AI and automation ideas.</span>","subhead":"From first proof of concept to production systems running under your brand — a full-stack AI and automation engineering team, available directly or as your behind-the-scenes delivery partner.","primary_cta":{"label":"Book a Call","href":"/book-a-call"},"secondary_cta":{"label":"See Implementations","href":"/implementations"},"trust_items":["Custom AI","RAG & knowledge","Agents","Automation","Integration","MVP"]}$json$),
  ('service_capabilities', 2, $json${"eyebrow":"What we build","heading":"Twelve engineering capabilities, deployed under your brand","items":[{"mono":"RAG","title":"RAG Agent Development","body":"Retrieval-augmented assistants grounded in your client's trusted content and documents."},{"mono":"WF","title":"Workflow Automation","body":"n8n, Make and Langflow automations that remove manual, repetitive work end to end."},{"mono":"API","title":"API & Platform Integration","body":"Connect CRMs, ERPs, LLMs and custom APIs into one orchestrated system."},{"mono":"OR","title":"Multi-System Orchestration","body":"Coordinated multi-agent and multi-model workflows with full observability."},{"mono":"BPA","title":"Business Process Automation","body":"Automate multi-step business processes with human checkpoints where needed."},{"mono":"AI","title":"Custom AI Application Development","body":"Bespoke AI applications, copilots and intelligent interfaces built for your client."},{"mono":"AG","title":"AI Agent Development","body":"Tool-enabled agents that complete real business tasks autonomously."},{"mono":"LLM","title":"LLM Integration","body":"Integrate and route across model providers with cost and quality controls."},{"mono":"MCP","title":"Model Context Protocol (MCP)","body":"Custom MCP servers and connectors for secure, governed tool access."},{"mono":"ERP","title":"CRM & ERP Integration","body":"Bidirectional sync and automation across your client's systems of record."},{"mono":"POC","title":"AI Proof of Concept","body":"Validate technical and business feasibility fast, before committing to build."},{"mono":"MVP","title":"MVP Development","body":"Validate and launch AI products faster with disciplined engineering."}]}$json$),
  ('feature_grid', 3, $json${"eyebrow":"Cross-cutting foundations","heading":"How we engineer, on every project","columns":4,"items":[{"title":"Security by design","body":"Encryption, role-based access and secure environments from day one."},{"title":"Human-in-the-loop","body":"Approval checkpoints wherever judgment or accountability matters."},{"title":"Observability","body":"Logging, tracing and monitoring so behaviour is always visible."},{"title":"Technology agnostic","body":"We pick the right model and stack for the job, not a house favourite."},{"title":"Production-grade","body":"Built to run reliably at scale, not just to demo well."},{"title":"Data governance","body":"Minimisation, retention and PII handling aligned to policy."},{"title":"Flexible engagement","body":"Direct or behind the scenes, project or embedded pod."},{"title":"Ongoing support","body":"Maintenance, optimization and model updates after launch."}]}$json$),
  ('process_timeline', 4, $json${"eyebrow":"Delivery process","heading":"From opportunity to launch and beyond","steps":[{"n":"1","title":"Opportunity discussion"},{"n":"2","title":"Business & technical discovery"},{"n":"3","title":"Solution blueprint"},{"n":"4","title":"Prototype / PoC"},{"n":"5","title":"Implementation"},{"n":"6","title":"Integration & testing"},{"n":"7","title":"Launch"},{"n":"8","title":"Optimization & support"}]}$json$),
  ('cta_band', 5, $json${"variant":"final","heading":"Have a service requirement in mind?","body":"Tell us the capability or client problem you need engineered. We will map it to the right pathway.","ctas":[{"label":"Book a Call","href":"/book-a-call","style":"primary"},{"label":"Submit a requirement →","href":"/book-a-call","style":"link"}]}$json$)
) as v(type, ord, content)
where public.pages.slug = 'services';

-- ===========================================================================
-- ABOUT sections
-- ===========================================================================
insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('hero', 1, $json${"badge":"About Mavlers.ai","heading_html":"Built on a digital delivery legacy. <span>Focused on the AI-enabled future.</span>","subhead":"Mavlers.ai is the AI and automation engineering arm of the Mavlers group — bringing more than 15 years of global digital delivery to production-grade AI.","primary_cta":{"label":"Work with us","href":"/book-a-call"},"secondary_cta":{"label":"Our governance","href":"/governance"},"trust_items":["Uplers","Mavlers","Mavlers.ai","Global delivery"]}$json$),
  ('rich_text', 2, $json${"eyebrow":"Our story","heading":"One group, three capabilities","html":"<p>Mavlers.ai stands on a digital delivery legacy built across the Mavlers group.</p><p><strong>Uplers</strong> — talent and delivery infrastructure at global scale. <strong>Mavlers</strong> — full-service digital and lifecycle marketing for agencies and brands. <strong>Mavlers.ai</strong> — the AI and automation engineering team that turns your ideas into working solutions.</p><h2>Agency-first from day one</h2><p>We built our delivery model around how agencies actually work: flexible engagement, senior engineering, secure by default, and — when you need it — completely invisible under your brand.</p>"}$json$),
  ('stats_bar', 3, $json${"stats":[{"num":"15+","label":"years combined digital experience"},{"num":"500+","label":"agency relationships"},{"num":"Global","label":"delivery experience"},{"num":"80+","label":"AI-efficient developers"},{"num":"10","label":"AI technology consultants"},{"num":"Cross-fn","label":"delivery teams"}]}$json$),
  ('feature_grid', 4, $json${"eyebrow":"Team structure","heading":"Cross-functional AI delivery, as one unit","columns":4,"items":[{"title":"AI Consultants"},{"title":"Solution Architects"},{"title":"AI Engineers"},{"title":"Automation Engineers"},{"title":"Full-Stack Developers"},{"title":"Data & Integration Engineers"},{"title":"UX Designers"},{"title":"QA Engineers"},{"title":"DevOps Specialists"},{"title":"Project Managers"}]}$json$),
  ('pillars', 5, $json${"eyebrow":"Principles","heading":"How we operate","items":[{"title":"Agency-first","body":"Built around agency workflows, brands and client relationships."},{"title":"Business-outcome focused","body":"We engineer to the outcome, not to the hype."},{"title":"Technology agnostic","body":"The right model and stack for the job."},{"title":"Human-guided AI","body":"Judgment and accountability stay with people."},{"title":"Secure by design","body":"Security and confidentiality from day one."},{"title":"Built for integration","body":"Everything connects to the systems you already run."},{"title":"Designed to scale","body":"From prototype to production and beyond."},{"title":"Transparent delivery","body":"Clear communication, visibility and ownership."}]}$json$),
  ('cta_band', 6, $json${"variant":"final","heading":"Build your agency's AI capability without building it alone.","body":"Bring the opportunity. We will bring the engineering.","ctas":[{"label":"Book a Call","href":"/book-a-call","style":"primary"}]}$json$)
) as v(type, ord, content)
where public.pages.slug = 'about';

-- ===========================================================================
-- MVP sections
-- ===========================================================================
insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('hero', 1, $json${"badge":"MVP Development","heading_html":"Launch your AI MVP faster — <span>without traditional development overhead.</span>","subhead":"Up to 70% lower cost than traditional builds (illustrative). The speed of vibe coding, with the discipline of professional product engineering.","primary_cta":{"label":"Start your MVP","href":"/book-a-call"},"secondary_cta":{"label":"See packages","href":"#packages"},"trust_items":["Senior architecture","Product thinking","UI/UX","Code review","Data security","Testing","Deployment","Human oversight"]}$json$),
  ('feature_grid', 2, $json${"eyebrow":"Ideal MVP types","heading":"What we build fastest","columns":4,"items":[{"title":"Internal AI tools"},{"title":"Client portals"},{"title":"Workflow applications"},{"title":"AI copilots"},{"title":"SaaS prototypes"},{"title":"Reporting assistants"},{"title":"Knowledge platforms"},{"title":"Document-processing apps"},{"title":"Marketplace prototypes"},{"title":"Custom dashboards"},{"title":"Vertical AI tools"},{"title":"Marketing productivity tools"}]}$json$),
  ('process_timeline', 3, $json${"eyebrow":"MVP process","heading":"From idea to a scale-up roadmap","steps":[{"n":"1","title":"Idea & outcome definition"},{"n":"2","title":"Feasibility"},{"n":"3","title":"Scope & prioritization"},{"n":"4","title":"Prototype"},{"n":"5","title":"Rapid build"},{"n":"6","title":"AI & system integration"},{"n":"7","title":"Testing & security review"},{"n":"8","title":"Launch"},{"n":"9","title":"Feedback & iteration"},{"n":"10","title":"Scale-up roadmap"}]}$json$),
  ('comparison_table', 4, $json${"eyebrow":"Why it is faster","heading":"Traditional build vs AI-accelerated MVP","columns":["","Traditional","Mavlers.ai"],"rows":[{"label":"Time to prototype","values":["6–10 weeks","3–7 days"]},{"label":"Initial cost","values":["High","Up to 70% lower"]},{"label":"Team size","values":["Large","Lean senior pod"]},{"label":"Iteration speed","values":["Slow","Rapid"]},{"label":"Validation speed","values":["Late","Early"]},{"label":"Documentation","values":["Heavy up front","Right-sized"]},{"label":"Quality controls","values":["Variable","Built in"]},{"label":"Scalability planning","values":["Afterthought","From the start"]}]}$json$),
  ('packages', 5, $json${"eyebrow":"Packages","heading":"Pick the right starting point","items":[{"name":"Prototype Sprint","duration":"1–2 weeks","desc":"A working prototype to validate the core idea.","featured":false},{"name":"Proof-of-Concept Build","duration":"2–4 weeks","desc":"Technical and business feasibility, demonstrated.","featured":false},{"name":"Launch-Ready MVP","duration":"4–8 weeks","desc":"A production-grade MVP ready for real users.","featured":true},{"name":"MVP-to-Scale Partnership","duration":"Rolling","desc":"Ongoing build, iteration and scale-up.","featured":false}]}$json$),
  ('cta_band', 6, $json${"variant":"final","heading":"Have an AI product idea to validate?","body":"Let's turn it into a working MVP — fast, and built to last.","ctas":[{"label":"Book a Call","href":"/book-a-call","style":"primary"}]}$json$)
) as v(type, ord, content)
where public.pages.slug = 'mvp';

-- ===========================================================================
-- GOVERNANCE sections
-- ===========================================================================
insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('hero', 1, $json${"badge":"AI Governance","heading_html":"AI you can trust — <span>governed, secure and accountable.</span>","subhead":"ISO 9001-certified delivery. Our AI governance program is aligned to leading international frameworks so you can adopt AI with confidence.","primary_cta":{"label":"Talk to us about security","href":"/book-a-call"},"trust_items":["ISO/IEC 42001","NIST AI RMF","OECD AI Principles","GDPR","EU AI Act"]}$json$),
  ('feature_grid', 2, $json${"eyebrow":"Data security","heading":"Controls at every layer","columns":3,"items":[{"title":"Encryption everywhere","body":"Data encrypted in transit and at rest."},{"title":"Role-based access control","body":"Least-privilege access to systems and data."},{"title":"Data isolation","body":"Client data kept logically separated."},{"title":"Environment separation","body":"Distinct dev, staging and production environments."},{"title":"Audit logging","body":"Actions and access are logged and reviewable."},{"title":"Data minimisation & retention","body":"We collect and keep only what is needed."},{"title":"Controlled model access","body":"Governed access to model providers and tools."},{"title":"PII handling","body":"Sensitive data handled to policy and regulation."},{"title":"Monitoring & incident response","body":"Continuous monitoring with a defined response plan."}]}$json$),
  ('pillars', 3, $json${"eyebrow":"Responsible AI","heading":"Six principles we enforce","items":[{"title":"Fairness","body":"We test for and mitigate harmful bias."},{"title":"Transparency","body":"Decisions and data flows are explainable."},{"title":"Accountability","body":"Clear ownership for every AI system."},{"title":"Privacy","body":"Privacy-by-design across the lifecycle."},{"title":"Security","body":"Secure engineering from day one."},{"title":"Human oversight","body":"People stay in control of consequential decisions."}]}$json$),
  ('rich_text', 4, $json${"eyebrow":"The policy","heading":"AI Governance Policy","html":"<p><em>Version 1.0 — last reviewed July 2026 — owner: AI Governance Committee.</em></p><h3>1. Purpose & Scope</h3><p>Defines how Mavlers.ai governs the responsible use of AI across all engagements.</p><h3>2. Governance & Accountability</h3><p>Named owners and a governance committee oversee AI systems end to end.</p><h3>3. Acceptable Use</h3><p>Clear boundaries for how AI may and may not be used.</p><h3>4. Data Governance</h3><p>Data minimisation, retention and lineage controls.</p><h3>5. Security Controls</h3><p>Encryption, access control, isolation and monitoring.</p><h3>6. Privacy & Compliance</h3><p>Aligned to GDPR and the EU AI Act.</p><h3>7. Human Oversight</h3><p>Human-in-the-loop for consequential decisions.</p><h3>8. Model & Vendor Management</h3><p>Governed selection and review of models and vendors.</p><h3>9. Quality, Testing & Evaluation</h3><p>Systematic evaluation before and after deployment.</p><h3>10. Monitoring & Auditing</h3><p>Continuous monitoring and periodic audits.</p><h3>11. Incident Response</h3><p>A defined plan for detection, response and remediation.</p><h3>12. Training & Review</h3><p>Ongoing training and scheduled policy review.</p>"}$json$),
  ('process_timeline', 5, $json${"eyebrow":"Governed lifecycle","heading":"Governance across the delivery lifecycle","steps":[{"n":"1","title":"Discovery"},{"n":"2","title":"Design"},{"n":"3","title":"Build & Test"},{"n":"4","title":"Deploy"},{"n":"5","title":"Operate"}]}$json$),
  ('cta_band', 6, $json${"variant":"final","heading":"Need AI that meets your security bar?","body":"Let's walk through our governance, controls and delivery model.","ctas":[{"label":"Book a Call","href":"/book-a-call","style":"primary"}]}$json$)
) as v(type, ord, content)
where public.pages.slug = 'governance';

-- ===========================================================================
-- BOOK A CALL — form + page sections
-- ===========================================================================
insert into public.forms (id, key, name, title, description, submit_label, success_message, recaptcha_enabled, settings)
values (
  '22222222-2222-2222-2222-222222222222',
  'book-a-call',
  'Book a Call / Submit a Requirement',
  'Tell us a little before the call',
  'A few details so your consultant comes prepared. Nothing here is mandatory.',
  'Request a Call',
  'Thanks — we''ve got it. Our team will be in touch shortly.',
  true,
  $json${
    "modes":[
      {"key":"brief","label":"Submit a Requirement","title":"Submit your requirement","subtitle":"Share as much or as little as you have — even a rough idea is a fine place to start.","submit":"Submit Requirement","kind":"requirement"},
      {"key":"call","label":"Book a Call","title":"Grab a time that works for you","subtitle":"Book straight into an AI consultant's calendar below — Calendly captures everything we need, so there's no form to fill in.","submit":"Request a Call","kind":"call request"}
    ],
    "helper_text":"No obligation · NDA available · Your client relationship stays protected",
    "consent":[
      {"name":"nda","label":"I'd like an NDA in place before sharing details. We'll send one before the call."},
      {"name":"agree","label":"I agree to be contacted about my enquiry. See our privacy policy.","required":true}
    ],
    "next_steps":[
      {"title":"We understand the opportunity","body":"A short conversation to understand the client problem or idea."},
      {"title":"We identify a technical pathway","body":"We map it to the right engagement and approach."},
      {"title":"We recommend a next step","body":"Discovery, PoC, project or an embedded pod."}
    ],
    "calendly":{"url":"","modes":["call"],"heading":"Pick a time","note":"Times are shown in your local timezone."}
  }$json$
);

insert into public.form_fields (form_id, name, label, type, placeholder, options, required, sort_order, col_span, conditional) values
  ('22222222-2222-2222-2222-222222222222','name','Name','text','Your name','[]',false,1,1,'{}'),
  ('22222222-2222-2222-2222-222222222222','email','Work email','email','you@agency.com','[]',true,2,1,'{}'),
  ('22222222-2222-2222-2222-222222222222','company','Agency / company','text','Company name','[]',false,3,1,'{}'),
  ('22222222-2222-2222-2222-222222222222','website','Website','url','agency.com','[]',false,4,1,'{}'),
  ('22222222-2222-2222-2222-222222222222','role','Your role','text','e.g. CTO, Delivery Director','[]',false,5,1,'{}'),
  ('22222222-2222-2222-2222-222222222222','opportunity','Type of opportunity','select','', $json$["Early-stage idea","Defined client requirement","AI MVP / new product","Automation / integration","Not sure yet"]$json$, false,6,1,'{}'),
  ('22222222-2222-2222-2222-222222222222','challenge','Current challenge','textarea','What''s the client problem or process you''re trying to solve?','[]',false,7,2, $json${"field":"mode","equals":"brief"}$json$),
  ('22222222-2222-2222-2222-222222222222','outcome','Desired outcome','textarea','What does a good result look like?','[]',false,8,2, $json${"field":"mode","equals":"brief"}$json$),
  ('22222222-2222-2222-2222-222222222222','timeline','Expected timeline','select','', $json$["ASAP","1–3 months","3–6 months","Exploring"]$json$, false,9,1, $json${"field":"mode","equals":"brief"}$json$),
  ('22222222-2222-2222-2222-222222222222','budget','Budget range','select','', $json$["Not sure yet","Under $10k","$10k – $50k","$50k+"]$json$, false,10,1, $json${"field":"mode","equals":"brief"}$json$);

insert into public.page_sections (page_id, type, sort_order, content)
select id, v.type, v.ord, v.content::jsonb from public.pages, (values
  ('hero', 1, $json${"badge":"Book a Call","heading_html":"You don't need a finished AI strategy <span>to start.</span>","subhead":"Bring an idea, a client problem or a defined requirement. Our AI consultants will help you find the right pathway — with an NDA if you want one.","trust_items":["No obligation","NDA available","Client relationship protected"]}$json$),
  ('form', 2, $json${"form_key":"book-a-call"}$json$),
  ('faq', 3, $json${"eyebrow":"FAQ","heading":"Common questions","items":[{"q":"Can we involve our client in the call?","a":"Yes. We can join calls behind the scenes as your delivery partner, or advise you directly beforehand — whatever protects the relationship."},{"q":"Can you sign an NDA?","a":"Absolutely. We can have an NDA in place before you share any details."},{"q":"Do we need a complete scope?","a":"No. A rough idea or client problem is a perfectly good starting point."},{"q":"Can you work with our existing technical team?","a":"Yes. We embed with your team or operate as an independent pod."},{"q":"Can you maintain the solution after launch?","a":"Yes. Ongoing maintenance, optimization and model updates are available."}]}$json$)
) as v(type, ord, content)
where public.pages.slug = 'book-a-call';
