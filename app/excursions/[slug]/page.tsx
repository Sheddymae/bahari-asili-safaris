import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { excursions } from '@/lib/tours-data';
import ExcursionDetailClient from '@/components/ExcursionDetailClient';

export function generateStaticParams() {
  return excursions.map((e) => ({ slug: e.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const excursion = excursions.find((e) => e.id === params.slug);
  if (!excursion) return { title: 'Excursion not found — Bahari Asili Safaris' };

  const title = `${excursion.name} — Watamu Excursion`;
  const description = `${excursion.description} Duration: ${excursion.duration}. Book this excursion with Bahari Asili Safaris.`;

  return {
    title,
    description,
    alternates: { canonical: `/excursions/${excursion.id}` },
    openGraph: {
      title,
      description,
      images: [excursion.image],
      type: 'website',
      url: `/excursions/${excursion.id}`,
    },
  };
}

export default function ExcursionPage({ params }: { params: { slug: string } }) {
  const excursion = excursions.find((e) => e.id === params.slug);
  if (!excursion) notFound();

  return <ExcursionDetailClient excursion={excursion} />;
}
