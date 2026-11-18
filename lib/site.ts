const DEFAULT_SITE_URL = 'https://www.bahariasilisafaris.co.ke';

function resolveSiteUrl(value?: string): string {
  if (!value) return DEFAULT_SITE_URL;

  try {
    const parsed = new URL(value);
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const isDeploymentAlias = parsed.hostname.endsWith('.vercel.app') || parsed.hostname.endsWith('.netlify.app');

    if (parsed.protocol !== 'https:' || isLocalHost || isDeploymentAlias || parsed.username || parsed.password) {
      return DEFAULT_SITE_URL;
    }

    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Canonical public origin for metadata, robots, sitemap and redirects. */
export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** A deployment is indexable only when its hosting platform marks it production. */
const IS_EXPLICIT_PREVIEW =
  process.env.VERCEL_ENV === 'preview' ||
  process.env.VERCEL_ENV === 'development' ||
  process.env.CONTEXT === 'deploy-preview' ||
  process.env.CONTEXT === 'branch-deploy';

export const IS_PRODUCTION_DEPLOYMENT =
  process.env.VERCEL_ENV === 'production' ||
  process.env.CONTEXT === 'production' ||
  (process.env.NODE_ENV === 'production' && !IS_EXPLICIT_PREVIEW);
