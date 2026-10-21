import type { MetadataRoute } from 'next';
import { safaris } from '@/lib/safari-catalogue';
import { excursions as staticExcursions } from '@/lib/tours-data';
import { destinations } from '@/lib/destinations-data';
import { getPublicExcursions } from '@/lib/public-content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app';

function routeEntry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, siteUrl).toString(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '', '/about', '/contact', '/faq', '/blog', '/partners', '/destinations',
    '/tours', '/excursions', '/build-your-safari', '/transfers', '/travel-guide',
    '/terms', '/privacy',
  ];

  // The CMS can add published excursions, so use the same public catalogue
  // as the customer-facing page and fall back safely to the static catalogue.
  let publicExcursions = staticExcursions;
  try {
    publicExcursions = await getPublicExcursions();
  } catch {
    // Keep the sitemap available even if the CMS is temporarily unavailable.
  }

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((path) => routeEntry(path, path === '' ? 1 : 0.7, path === '' ? 'weekly' : 'monthly')),
    ...safaris.map((safari) => routeEntry(`/safaris/${encodeURIComponent(safari.id)}`, 0.9)),
    ...destinations.map((destination) => routeEntry(`/destinations/${encodeURIComponent(destination.slug)}`, 0.8)),
    ...publicExcursions.map((excursion) => routeEntry(`/excursions/${encodeURIComponent(excursion.id)}`, 0.8)),
  ];

  // Avoid duplicate URLs if static and CMS catalogue entries overlap.
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
