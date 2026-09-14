import type { Metadata } from 'next';
import ExcursionsCatalogueClient from '@/components/ExcursionsCatalogueClient';
import { getPublicExcursions } from '@/lib/public-content';

export const metadata: Metadata = {
  title: 'Watamu Excursions — Marine, Nature & Culture Day Trips',
  description: 'Day and half-day excursions from Watamu: snorkelling at Mida Creek, mangrove canoe trips, Gede Ruins, Marafa gorge, Malindi town, and Dabaso village. Book alongside or instead of a safari.',
  alternates: { canonical: '/excursions' },
  openGraph: { title: 'Watamu Excursions — Bahari Asili Safaris', description: 'Marine, nature, and cultural excursions from Watamu — snorkelling, mangroves, ruins, and village life on the Kenyan coast.', type: 'website', url: '/excursions' },
};

export const dynamic = 'force-dynamic';

export default async function ExcursionsPage() {
  const items = await getPublicExcursions();
  return <ExcursionsCatalogueClient excursions={items} />;
}
