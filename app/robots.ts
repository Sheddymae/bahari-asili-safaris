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
    rules: [{ userAgent: '*', allow: '/', disallow: PRIVATE_PATHS }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
