import type { MetadataRoute } from 'next';
import { safaris, excursions } from '@/lib/tours-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    '', '/about', '/contact', '/faq', '/blog', '/partners', '/destinations',
    '/excursions', '/build-your-safari', '/transfers', '/travel-guide', '/terms', '/privacy',
  ];
  const safariRoutes = safaris.map((safari) => `/safaris/${safari.id}`);
  const excursionRoutes = excursions.map((excursion) => `/excursions/${excursion.id}`);

  return [...staticRoutes, ...safariRoutes, ...excursionRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/safaris/') ? 0.9 : 0.7,
  }));
}
