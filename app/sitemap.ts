import type { MetadataRoute } from 'next';
import { safaris } from '@/lib/safari-catalogue';
import { excursions as staticExcursions } from '@/lib/tours-data';
import { destinations } from '@/lib/destinations-data';
import { hubGuides } from '@/lib/guides';
import { getPublicExcursions, getPublicSafariBlu } from '@/lib/public-content';
import { SITE_URL } from '@/lib/site';
import { localeAlternates } from '@/lib/i18n-routing';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getPublicSafaris } from '@/lib/public-content';



function routeEntry(path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, SITE_URL).toString(),
    alternates: { languages: localeAlternates(path, SITE_URL) },
    ...(lastModified ? { lastModified } : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '', '/about', '/contact', '/faq', '/blog', '/partners', '/destinations',
    '/tours', '/excursions', '/build-your-safari', '/transfers', '/services', '/travel-guide',
    '/guides', '/terms', '/privacy',
  ];

  // Keep the sitemap aligned with published CMS content while retaining the
  // checked-in catalogue if the CMS is temporarily unavailable.
  let publicSafaris = safaris;
  let publicExcursions = staticExcursions.filter((item) => !item.id.startsWith('safari-blu-'));
  let publicSafariBlu = staticExcursions.filter((item) => item.id.startsWith('safari-blu-'));
  let publishedBlogPosts: { slug: string; updated_at?: string | null; published_at?: string | null }[] = [];
  try {
    const managedSafaris = await getPublicSafaris('en');
    if (managedSafaris.length > 0) publicSafaris = managedSafaris;
  } catch {
    // Keep the checked-in safari catalogue available without CMS credentials.
  }

  try {
    publicExcursions = await getPublicExcursions();
  } catch {
    // Keep the static excursion catalogue available if the CMS is unavailable.
  }

  try {
    publicSafariBlu = await getPublicSafariBlu();
  } catch {
    // Keep the static Blue Safari entries available if the CMS is unavailable.
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('cms_content')
      .select('slug,updated_at,published_at')
      .eq('content_type', 'blog')
      .eq('locale', 'en')
      .eq('status', 'published');
    if (!error) publishedBlogPosts = data || [];
  } catch {
    // Blog listing remains in the sitemap even when CMS credentials are absent.
  }

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((path) => routeEntry(path)),
    ...publicSafaris.map((safari) => routeEntry(`/safaris/${encodeURIComponent(safari.id)}`)),
    ...publishedBlogPosts.map((post) =>
      routeEntry(`/blog/${encodeURIComponent(post.slug)}`, post.updated_at || post.published_at || undefined),
    ),
    ...hubGuides.map((guide) => routeEntry(`/guides/${guide.slug}`, guide.lastReviewedAt)),
    ...destinations.map((destination) => routeEntry(`/destinations/${encodeURIComponent(destination.slug)}`)),
    ...publicExcursions.map((excursion) => routeEntry(`/excursions/${encodeURIComponent(excursion.id)}`)),
    ...publicSafariBlu.map((excursion) => routeEntry(`/excursions/${encodeURIComponent(excursion.id)}`)),
  ];

  // Avoid duplicate URLs if static and CMS catalogue entries overlap.
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
