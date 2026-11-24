import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { excursions } from '@/lib/tours-data';
import { getPublicExcursions, getPublicSafariBlu } from '@/lib/public-content';
import { cleanMetaDescription } from '@/lib/format';
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
  const [excursions, safariBlu] = await Promise.all([getPublicExcursions(), getPublicSafariBlu()]);
  const excursion = [...excursions, ...safariBlu].find((e) => e.id === slug);
  if (!excursion) return { title: 'Excursion not found' };
  const title = `${excursion.name} | Watamu Excursion`;
  const description = cleanMetaDescription(`${excursion.description} Duration: ${excursion.duration}. Explore this coastal experience with Bahari Asili Safaris.`);
  const image = excursion.image ? [excursion.image] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, images: image, type: 'website', url: `/excursions/${encodeURIComponent(excursion.id)}` },
    twitter: { card: 'summary_large_image', title, description, images: image },
  };
}

export default async function ExcursionPage({ params }: PageProps) {
  const { slug } = await params;
  const [all, safariBlu] = await Promise.all([getPublicExcursions(), getPublicSafariBlu()]);
  const excursion = [...all, ...safariBlu].find((e) => e.id === slug);
  if (!excursion) notFound();
  return <ExcursionDetailClient excursion={excursion} />;
}
