import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { excursions } from '@/lib/tours-data';
import { getPublicExcursions } from '@/lib/public-content';
import ExcursionDetailClient from '@/components/ExcursionDetailClient';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return excursions.map((e) => ({ slug: e.id }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const all = await getPublicExcursions();
  const excursion = all.find((e) => e.id === slug);
  if (!excursion) return { title: 'Excursion not found — Bahari Asili Safaris' };
  const title = `${excursion.name} — Watamu Excursion`;
  const description = `${excursion.description} Duration: ${excursion.duration}. Book this excursion with Bahari Asili Safaris.`;
  return { title, description, alternates: { canonical: `/excursions/${excursion.id}` }, openGraph: { title, description, images: excursion.image ? [excursion.image] : undefined, type: 'website', url: `/excursions/${excursion.id}` } };
}

export default async function ExcursionPage({ params }: PageProps) {
  const { slug } = await params;
  const all = await getPublicExcursions();
  const excursion = all.find((e) => e.id === slug);
  if (!excursion) notFound();
  return <ExcursionDetailClient excursion={excursion} />;
}
