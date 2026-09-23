import type { Metadata } from 'next';
import { safaris } from '@/lib/safari-catalogue';
import { getPublicSafaris } from '@/lib/public-content';
import SafariDetailClient from '@/components/SafariDetailEnhanced';

export function generateStaticParams() {
  return safaris.map((s) => ({ slug: s.id }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const managed = await getPublicSafaris('en');
  const safari = managed.find((s) => s.id === slug) || safaris.find((s) => s.id === slug);
  if (!safari) return { title: 'Safari not found | Bahari Asili Safaris' };

  const title = `${safari.name} | ${safari.days} Day Safari | Bahari Asili Safaris`;
  const description = `${safari.tagline}. ${safari.days} days / ${safari.nights} nights visiting ${safari.parks.join(', ')}. Day-by-day itinerary, what is included, and packing tips.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: safari.image ? [safari.image] : undefined,
    },
  };
}

export const dynamicParams = true;

export default async function SafariDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const managed = await getPublicSafaris('en');
  const safari = managed.find((s) => s.id === slug) || safaris.find((s) => s.id === slug);
  return <SafariDetailClient safari={safari || null} slug={slug} />;
}
