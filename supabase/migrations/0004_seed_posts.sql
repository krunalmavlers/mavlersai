-- ============================================================================
-- Mavlers.ai — Seed: posts (implementations + insights) with taxonomy links.
-- Run AFTER 0003_seed_pages.sql.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- IMPLEMENTATIONS (case studies)
-- meta shape: {type, stack[], result_headline, metrics[], client_context,
--              challenge[], architecture[], delivered[], related[]}
-- ---------------------------------------------------------------------------
insert into public.posts
  (content_type, title, slug, excerpt, status, published_at, reading_time, is_featured, body_html, meta, author_id)
values
  ('implementation','Automated client reporting for a MarTech agency','automated-client-reporting-martech',
   'A RAG-backed reporting pipeline replaced manual multi-source assembly across 40+ client accounts — delivered white-label under the agency''s brand.',
   'published','2026-07-01','7 min', true,
   '<p>A fast-growing MarTech agency was drowning in monthly reporting. Analysts spent days assembling multi-source spreadsheets, and narrative quality varied by person.</p><h2>What we built</h2><p>A retrieval-augmented reporting pipeline that pulls from every connected data source, drafts a client-ready narrative, and routes it through a human approval step before delivery.</p><p>The system runs white-label under the agency''s brand across more than 40 client accounts.</p>',
   $json${"type":"RAG","stack":["RAG","n8n","GPT-4","BigQuery","Vector DB","Python","Cloud deployment","Role-based access"],"result_headline":"3× faster monthly reporting","client_context":"A MarTech agency serving 40+ enterprise accounts with monthly performance reporting.","metrics":[{"value":"3×","label":"faster monthly reporting"},{"value":"60%","label":"less manual processing"},{"value":"40+","label":"client accounts covered"},{"value":"~120 hrs","label":"analyst hours saved / month"}],"challenge":["Days of manual spreadsheet assembly","Inconsistent narrative quality across analysts","Reporting delays late in the month","Errors from copy-paste across tools","No capacity to scale with new clients"],"architecture":["Data sources","Integration layer","AI model (RAG)","Automation workflow","Human approval","Report output"],"delivered":["Discovery","Solution architecture","UX design","Development","Integration","Testing","Deployment","Maintenance"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Content operations workflow for a creative agency','content-operations-workflow',
   'AI agents coordinate briefs, drafts, reviews and publishing so the content team ships more without adding headcount.',
   'published','2026-06-28','5 min', false,
   '<p>Briefs, drafts and reviews lived across disconnected tools. We orchestrated the whole content lifecycle with AI-assisted workflows.</p>',
   $json${"type":"Automation","stack":["n8n","LLM","CMS API","Slack"],"result_headline":"2× content throughput","metrics":[{"value":"2×","label":"content throughput"},{"value":"−45%","label":"coordination overhead"},{"value":"1 wk","label":"faster time-to-publish"}],"challenge":["Manual hand-offs between tools","No single view of content status","Slow review cycles"],"architecture":["Brief intake","AI drafting","Review workflow","Human approval","Publishing"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','In-product support copilot for a B2B platform','support-knowledge-assistant',
   'A knowledge assistant grounded in verified docs deflected routine tickets and cut manual support handling.',
   'published','2026-06-24','6 min', false,
   '<p>Support volume was scaling faster than the team. We built a knowledge assistant grounded in the client''s verified content.</p>',
   $json${"type":"RAG","stack":["LangChain","Vector DB","MCP","Widget"],"result_headline":"60% fewer routine tickets","metrics":[{"value":"60%","label":"fewer routine tickets"},{"value":"24/7","label":"instant answers"},{"value":"+18","label":"CSAT points"}],"challenge":["Rising ticket volume","Slow first response","Knowledge scattered across sources"],"architecture":["Knowledge sources","Ingestion & embeddings","RAG assistant","Escalation to human","Support desk"],"delivered":["Discovery","Solution architecture","Development","Integration","Testing","Deployment","Maintenance"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Ticket triage & routing agent','ticket-triage-routing-agent',
   'An agent classifies, prioritises and routes tickets on arrival, so the right owner picks them up faster.',
   'published','2026-06-20','5 min', false,
   '<p>Incoming tickets sat unassigned. We deployed an agent that triages and routes on arrival.</p>',
   $json${"type":"Agent","stack":["LLM","Webhooks","Zendesk"],"result_headline":"−70% time-to-assign","metrics":[{"value":"−70%","label":"time to assignment"},{"value":"95%","label":"routing accuracy"},{"value":"0","label":"tickets left untriaged"}],"challenge":["Manual triage backlog","Misrouted tickets","Slow SLA response"],"architecture":["Ticket intake","Classification agent","Priority scoring","Routing","Support desk"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Document intelligence pipeline for a property agency','document-intelligence-pipeline',
   'Automated extraction and classification saved a full working week every month.',
   'published','2026-06-16','6 min', false,
   '<p>The team processed hundreds of documents by hand. We automated extraction, validation and filing.</p>',
   $json${"type":"Automation","stack":["OCR","Claude","Make","Cloud storage"],"result_headline":"40 hrs saved / month","metrics":[{"value":"40 hrs","label":"saved per month"},{"value":"99%","label":"extraction accuracy"},{"value":"−80%","label":"manual data entry"}],"challenge":["Manual document processing","Data-entry errors","No searchable archive"],"architecture":["Document intake","OCR & extraction","Validation","Classification","Filing"],"delivered":["Discovery","Development","Integration","Testing","Deployment","Maintenance"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Lead qualification chat for a real-estate brand','lead-qualification-chat',
   'A conversational qualifier captures and scores website leads through natural conversation.',
   'published','2026-06-12','5 min', false,
   '<p>Website visitors bounced before sales could reach them. A conversational qualifier now captures and scores intent live.</p>',
   $json${"type":"Agent","stack":["LLM","CRM","Web widget"],"result_headline":"+35% qualified leads","metrics":[{"value":"+35%","label":"qualified leads"},{"value":"24/7","label":"coverage"},{"value":"−50%","label":"unqualified handoffs"}],"challenge":["Leads lost after hours","No live qualification","Manual data capture"],"architecture":["Website visitor","Conversational agent","Lead scoring","CRM sync","Sales handoff"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Proposal generation assistant','proposal-generation-assistant',
   'Drafts tailored proposals from CRM and discovery notes so sales spends time selling, not formatting.',
   'published','2026-06-08','5 min', false,
   '<p>Proposals took hours to assemble. We built an assistant that drafts them from CRM and discovery notes.</p>',
   $json${"type":"RAG","stack":["RAG","GPT-4","CRM"],"result_headline":"−75% proposal time","metrics":[{"value":"−75%","label":"proposal drafting time"},{"value":"2×","label":"proposals per rep"},{"value":"100%","label":"on-brand output"}],"challenge":["Slow, manual proposals","Inconsistent quality","Reps pulled off selling"],"architecture":["CRM & notes","Retrieval","Draft generation","Human review","Proposal output"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','CRM data hygiene agent','crm-data-hygiene-agent',
   'Continuously deduplicates, corrects and standardises records so the CRM stays trustworthy.',
   'published','2026-06-04','5 min', false,
   '<p>Dirty CRM data undermined reporting and outreach. An agent now keeps records clean continuously.</p>',
   $json${"type":"Agent","stack":["LLM","CRM","Rules engine"],"result_headline":"98% record accuracy","metrics":[{"value":"98%","label":"record accuracy"},{"value":"−90%","label":"duplicate records"},{"value":"daily","label":"continuous cleanup"}],"challenge":["Duplicate and stale records","Inconsistent formatting","Manual clean-up never finished"],"architecture":["CRM records","Detection agent","Normalisation","Human review","Clean CRM"],"delivered":["Discovery","Development","Integration","Testing","Deployment","Maintenance"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Enterprise knowledge assistant','enterprise-knowledge-assistant',
   'Conversational, cited access to policies, docs and institutional memory across the organisation.',
   'published','2026-05-30','7 min', false,
   '<p>Institutional knowledge was locked in scattered documents. We built a cited, conversational assistant over all of it.</p>',
   $json${"type":"RAG","stack":["RAG","Vector DB","SSO","MCP"],"result_headline":"minutes, not hours","metrics":[{"value":"−80%","label":"time to find answers"},{"value":"100%","label":"cited responses"},{"value":"1","label":"unified knowledge layer"}],"challenge":["Knowledge in silos","Slow answer discovery","No source citations"],"architecture":["Knowledge sources","Ingestion & embeddings","RAG assistant","Access control","Answer with citations"],"delivered":["Discovery","Solution architecture","Development","Integration","Testing","Deployment","Maintenance"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Approval workflow automation for a manufacturer','approval-workflow-automation',
   'Orchestrates multi-step approvals with human checkpoints across ERP and internal tools.',
   'published','2026-05-26','5 min', false,
   '<p>Multi-step approvals stalled in email. We orchestrated them with human checkpoints and full traceability.</p>',
   $json${"type":"Automation","stack":["n8n","LLM","ERP"],"result_headline":"−60% approval cycle","metrics":[{"value":"−60%","label":"approval cycle time"},{"value":"100%","label":"auditable steps"},{"value":"0","label":"lost requests"}],"challenge":["Approvals stuck in email","No visibility or audit trail","Frequent bottlenecks"],"architecture":["Request intake","Routing","Approval checkpoints","ERP update","Notification"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Executive summary generation for a finance team','executive-summary-generation',
   'Distils dashboards into board-ready narrative summaries on a schedule, with zero manual assembly.',
   'published','2026-05-22','5 min', false,
   '<p>Leadership needed narrative summaries, not raw dashboards. We generate board-ready summaries on a schedule.</p>',
   $json${"type":"LLM","stack":["LLM","BI API","Scheduler"],"result_headline":"board-ready in minutes","metrics":[{"value":"minutes","label":"to a board-ready summary"},{"value":"−90%","label":"manual assembly"},{"value":"weekly","label":"automated cadence"}],"challenge":["Manual summary writing","Inconsistent framing","Late delivery to leadership"],"architecture":["BI dashboards","Data retrieval","Summary generation","Human review","Distribution"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111'),

  ('implementation','Onboarding assistant for a growing team','onboarding-assistant',
   'Walks new hires through systems, docs and processes so ramp-up does not depend on a busy manager.',
   'published','2026-05-18','5 min', false,
   '<p>Onboarding depended on busy managers. An assistant now guides new hires through systems and processes.</p>',
   $json${"type":"Agent","stack":["LLM","Docs","Slack"],"result_headline":"−50% ramp time","metrics":[{"value":"−50%","label":"time to ramp"},{"value":"24/7","label":"self-serve guidance"},{"value":"+","label":"manager time reclaimed"}],"challenge":["Manager-dependent onboarding","Scattered documentation","Slow ramp-up"],"architecture":["New hire","Onboarding assistant","Docs & systems","Progress tracking","Manager summary"],"delivered":["Discovery","Development","Integration","Testing","Deployment"]}$json$,
   '11111111-1111-1111-1111-111111111111');

-- Implementation → industry + lifecycle links.
-- Each mapping row joins to TWO category rows (its industry and its lifecycle),
-- producing two post_categories rows per implementation.
insert into public.post_categories (post_id, category_id)
select p.id, c.id
from (values
  ('automated-client-reporting-martech','marketing-advertising','reporting-analytics'),
  ('content-operations-workflow',       'marketing-advertising','marketing'),
  ('support-knowledge-assistant',       'saas-technology',      'customer-support'),
  ('ticket-triage-routing-agent',       'saas-technology',      'customer-support'),
  ('document-intelligence-pipeline',    'real-estate',          'operations'),
  ('lead-qualification-chat',           'real-estate',          'website-experience'),
  ('proposal-generation-assistant',     'professional-services','sales'),
  ('crm-data-hygiene-agent',            'professional-services','operations'),
  ('enterprise-knowledge-assistant',    'financial-services',   'knowledge-management'),
  ('approval-workflow-automation',      'manufacturing',        'operations'),
  ('executive-summary-generation',      'financial-services',   'reporting-analytics'),
  ('onboarding-assistant',              'education',            'internal-productivity')
) as m(slug, industry, lifecycle)
join public.posts p on p.content_type = 'implementation' and p.slug = m.slug
join public.categories c
  on (c.taxonomy = 'industry'  and c.slug = m.industry)
  or (c.taxonomy = 'lifecycle' and c.slug = m.lifecycle);

-- Related implementation link (stored in meta for the detail page).
update public.posts set meta = jsonb_set(meta, '{related}', $json$["content-operations-workflow"]$json$::jsonb)
  where content_type = 'implementation' and slug = 'automated-client-reporting-martech';

-- ---------------------------------------------------------------------------
-- INSIGHTS (blog)
-- ---------------------------------------------------------------------------
insert into public.posts
  (content_type, title, slug, excerpt, status, published_at, reading_time, is_featured, cover_image, body_html, author_id)
values
  ('insight','How agencies can sell AI services without building an AI team','sell-ai-services-without-building-a-team',
   'You understand your client''s industry. We provide the AI engineering capability to turn your ideas into working solutions — here is how to package and sell it.',
   'published','2026-07-10','8 min', true, '',
   '<p><strong>Short answer:</strong> You do not need to hire AI engineers to offer AI services. Package outcomes, not models, and partner for delivery so the capability sits behind your brand.</p><h2>Start with the outcome, not the model</h2><p>Clients do not buy RAG or fine-tuning. They buy faster reporting, deflected tickets, or qualified leads. Lead every conversation with the operational outcome and let the engineering stay invisible.</p><h2>Package it into three offers</h2><p>Most agencies can start selling with a simple ladder of offers that map to how buyers actually commit.</p><ul><li><strong>Discovery &amp; feasibility</strong> — a low-risk way to validate an idea.</li><li><strong>Proof of concept</strong> — prove the technical and business case.</li><li><strong>Implementation</strong> — build and launch the production solution.</li></ul><blockquote>You understand your client''s industry. We provide the AI engineering capability to turn your ideas into working solutions.</blockquote><h2>Protect the relationship</h2><p>Deliver white-label, sign NDAs, and keep client ownership with the agency. Your relationship is the asset — the engineering partner should reinforce it, never compete with it.</p>',
   '11111111-1111-1111-1111-111111111111'),

  ('insight','When to use RAG vs fine-tuning for client projects','rag-vs-fine-tuning',
   'A practical decision guide for choosing between retrieval-augmented generation and fine-tuning on real agency engagements.',
   'published','2026-07-08','6 min', false, '',
   '<p>RAG and fine-tuning solve different problems. This is how we decide on real projects.</p><h2>Reach for RAG when</h2><p>The knowledge changes often, must be cited, or lives in documents. RAG keeps answers current and grounded.</p><h2>Consider fine-tuning when</h2><p>You need a consistent style, format or behaviour that prompting alone cannot reliably produce.</p>',
   '11111111-1111-1111-1111-111111111111'),

  ('insight','Five workflow automations every agency should offer','five-workflow-automations',
   'Low-risk, high-value automations you can package and sell to clients this quarter.',
   'published','2026-07-02','5 min', false, '',
   '<p>These five automations are fast to build, easy to sell, and deliver visible value quickly.</p><h2>The shortlist</h2><ul><li>Reporting assembly</li><li>Lead enrichment and routing</li><li>Content operations</li><li>Ticket triage</li><li>Data hygiene</li></ul>',
   '11111111-1111-1111-1111-111111111111'),

  ('insight','How we keep white-label engagements invisible to end clients','white-label-invisible',
   'The operating practices that keep a delivery partner completely behind your brand.',
   'published','2026-06-25','7 min', false, '',
   '<p>White-label only works if it is truly invisible. Here is how we operate behind your brand.</p><h2>Practices that matter</h2><p>Branded communication, NDAs, your tooling where possible, and clear ownership boundaries.</p>',
   '11111111-1111-1111-1111-111111111111'),

  ('insight','Designing human-in-the-loop approval into AI agents','human-in-the-loop-agents',
   'Where to place human checkpoints so agents stay fast without giving up accountability.',
   'published','2026-06-18','8 min', false, '',
   '<p>Autonomy is not all-or-nothing. The art is placing human checkpoints where judgment matters.</p><h2>Where to add checkpoints</h2><p>High-consequence actions, irreversible steps, and anything a client would want to sign off.</p>',
   '11111111-1111-1111-1111-111111111111'),

  ('insight','Vibe coding is fast. Here is what still needs an engineer.','vibe-coding-needs-an-engineer',
   'What AI-accelerated building gets right, and where senior engineering is still non-negotiable.',
   'published','2026-06-11','6 min', false, '',
   '<p>AI-accelerated building is genuinely fast. But shipping something people depend on still needs engineering discipline.</p><h2>Still needs a human</h2><p>Architecture, security, testing, and the judgment to say no to a shortcut.</p>',
   '11111111-1111-1111-1111-111111111111'),

  ('insight','Connecting CRM, email and analytics into one reporting pipeline','crm-email-analytics-pipeline',
   'A reference architecture for unifying disconnected platforms into a single automated reporting flow.',
   'published','2026-06-04','9 min', false, '',
   '<p>Most reporting pain comes from disconnected systems. Here is a reference architecture that unifies them.</p><h2>The pipeline</h2><p>Extract from each source, normalise, enrich with AI narrative, and deliver on a schedule.</p>',
   '11111111-1111-1111-1111-111111111111');

-- Insight → category links
insert into public.post_categories (post_id, category_id)
select p.id, c.id
from (values
  ('sell-ai-services-without-building-a-team','ai-strategy'),
  ('rag-vs-fine-tuning',                      'ai-strategy'),
  ('five-workflow-automations',               'automation'),
  ('white-label-invisible',                   'delivery'),
  ('human-in-the-loop-agents',                'ai-agents'),
  ('vibe-coding-needs-an-engineer',           'mvp'),
  ('crm-email-analytics-pipeline',            'automation')
) as m(slug, cat)
join public.posts p on p.content_type = 'insight' and p.slug = m.slug
join public.categories c on c.taxonomy = 'category' and c.slug = m.cat;

-- Featured insight → tags
insert into public.post_tags (post_id, tag_id)
select p.id, t.id
from (values
  ('sell-ai-services-without-building-a-team','ai-strategy'),
  ('sell-ai-services-without-building-a-team','white-label'),
  ('sell-ai-services-without-building-a-team','agency'),
  ('sell-ai-services-without-building-a-team','sales')
) as m(slug, tag)
join public.posts p on p.content_type = 'insight' and p.slug = m.slug
join public.tags t on t.slug = m.tag;
