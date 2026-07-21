import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

// AI / LLM crawlers we explicitly welcome (GEO/AIO). Each is allowed the full
// public site but kept out of /admin and /api, same as everyone else.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',
  'Meta-ExternalAgent',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // Explicitly allow every listed AI model to crawl the public site.
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: siteUrl('/sitemap.xml'),
  };
}
