import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { destinations } from '@/lib/destinations-data';
import DestinationDetailClient from '@/components/DestinationDetailClient';

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) return { title: 'Destination not found — Bahari Asili Safaris' };

  const title = `${destination.name} Safaris — Bahari Asili Safaris`;
  const description = `${destination.tagline}. Wildlife highlights, best time to visit, and safari packages to ${destination.name} from Bahari Asili Safaris.`;

  return {
    title,
    description,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: { title, description, images: [destination.heroImage], type: 'website', url: `/destinations/${destination.slug}` },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) notFound();

  return <DestinationDetailClient destination={destination} />;
}
