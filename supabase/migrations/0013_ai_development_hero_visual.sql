-- ============================================================================
-- Mavlers.ai — animated hero visual for /services/ai-development.
--
-- The sub-page heroes ship copy only, which leaves the right half of the hero
-- empty on large screens. This turns on the `ai-pipeline` visual there: a
-- retrieval → LLM → outcomes animation built from the page's own capabilities
-- (RAG, Custom AI, Agents, LLM integration, dashboards). Rendering lives in
-- src/components/sections/HeroAiPipeline.tsx.
--
-- Safe to re-run.
-- ============================================================================

update public.page_sections s
   set content = s.content || jsonb_build_object('visual', 'ai-pipeline')
  from public.pages p
 where p.id = s.page_id
   and p.slug = 'services/ai-development'
   and s.type = 'hero';
