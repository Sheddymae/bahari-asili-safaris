import type { Metadata } from 'next';
import { safaris } from '@/lib/safari-catalogue';
import SafariDetailClient from '@/components/SafariDetailEnhanced';

export function generateStaticParams() {
  return safaris.map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const safari = safaris.find((s) => s.id === params.slug);
  if (!safari) return { title: 'Safari not found | Bahari Asili Safaris' };

  const title = `${safari.name} | ${safari.days} Day Safari | Bahari Asili Safaris`;
  const description = `${safari.tagline}. ${safari.days} days / ${safari.nights} nights visiting ${safari.parks.join(', ')}. Day-by-day itinerary, what is included, and packing tips.`;

  return {
    title,
    description,
    alternates: { canonical: `/safaris/${safari.id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/safaris/${safari.id}`,
      images: safari.image ? [safari.image] : undefined,
    },
  };
}

export const dynamicParams = true;

export default function SafariDetailPage({ params }: { params: { slug: string } }) {
  const safari = safaris.find((s) => s.id === params.slug);
  return <SafariDetailClient safari={safari || null} slug={params.slug} />;
}
