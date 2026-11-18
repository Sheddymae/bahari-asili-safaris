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

      // Search crawlers used by AI answer engines.
      // Repeat private exclusions because a specific user-agent group takes precedence
      // over the wildcard group under the robots.txt standard.
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: 'PerplexityBot', allow: '/', disallow: PRIVATE_PATHS },

      // Google-Extended controls Gemini/Vertex AI use of crawled content.
      // It remains allowed, consistent with the existing wildcard policy.
      { userAgent: 'Google-Extended', allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
