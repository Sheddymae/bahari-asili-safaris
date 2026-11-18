import type { MetadataRoute } from 'next';
import { IS_PRODUCTION_DEPLOYMENT, SITE_URL } from '@/lib/site';

const PRIVATE_PATHS = [
  '/api/',
  '/admin',
  '/auth/',
  '/dashboard',
  '/account',
  '/login',
  '/signup',
];

const PUBLIC_CRAWLERS = [
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
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      // Keep all public pages discoverable while excluding private application areas.
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },

      // Explicit search and user-request crawlers. Repeat private exclusions because
      // a specific user-agent group takes precedence over the wildcard group.
      ...PUBLIC_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
