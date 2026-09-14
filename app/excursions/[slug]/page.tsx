import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { excursions } from '@/lib/tours-data';
import { getPublicExcursions } from '@/lib/public-content';
import ExcursionDetailClient from '@/components/ExcursionDetailClient';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return excursions.map((e) => ({ slug: e.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const all = await getPublicExcursions();
  const excursion = all.find((e) => e.id === params.slug);
  if (!excursion) return { title: 'Excursion not found — Bahari Asili Safaris' };
  const title = `${excursion.name} — Watamu Excursion`;
  const description = `${excursion.description} Duration: ${excursion.duration}. Book this excursion with Bahari Asili Safaris.`;
  return { title, description, alternates: { canonical: `/excursions/${excursion.id}` }, openGraph: { title, description, images: excursion.image ? [excursion.image] : undefined, type: 'website', url: `/excursions/${excursion.id}` } };
}

export default async function ExcursionPage({ params }: { params: { slug: string } }) {
  const all = await getPublicExcursions();
  const excursion = all.find((e) => e.id === params.slug);
  if (!excursion) notFound();
  return <ExcursionDetailClient excursion={excursion} />;
}
