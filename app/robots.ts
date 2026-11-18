import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app';

const PRIVATE_PATHS = ['/api/', '/admin/', '/auth/', '/dashboard/', '/account/', '/login', '/signup'];

/**
 * Search and answer engines that fetch pages for retrieval, plus the
 * traditional crawlers. Training-only crawlers (GPTBot, ClaudeBot,
 * Google-Extended) are deliberately not mentioned: allowing or blocking them is
 * a business decision for the owner, not something this file should settle.
 */
const SEARCH_AND_ANSWER_BOTS = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Applebot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      ...SEARCH_AND_ANSWER_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
