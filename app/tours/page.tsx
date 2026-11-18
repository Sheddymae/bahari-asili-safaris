import type { Metadata } from 'next';
import Link from 'next/link';
import ToursPageClient from './ToursPageClient';
import { safaris, excursions } from '@/lib/safari-catalogue';

export const metadata: Metadata = {
  title: 'Kenya Safaris & Day Excursions — Tsavo, Amboseli, Masai Mara',
  description:
    'Private and group safaris from Watamu to Tsavo, Amboseli, Masai Mara and Taita Hills, plus day excursions along the Kenya coast. Full itineraries, no fixed prices online — get a personalised quote.',
  alternates: { canonical: '/tours' },
  openGraph: {
    title: 'Kenya Safaris & Excursions — Bahari Asili Safaris',
    description: 'Private and group safaris from Watamu to Tsavo, Amboseli, Masai Mara and Taita Hills, plus day excursions.',
    type: 'website',
    url: '/tours',
  },
};

export default function ToursPage() {
  return (
    <>
      <ToursPageClient />
      <noscript>
        <section aria-label="Safari and excursion itineraries" className="mx-auto max-w-7xl px-4 py-10">
          <h2>Explore all safari itineraries</h2>
          <ul>
            {safaris.map((safari) => (
              <li key={safari.id}>
                <Link href={`/safaris/${encodeURIComponent(safari.id)}`}>
                  {safari.name} — {safari.days} day safari
                </Link>
              </li>
            ))}
          </ul>
          <h2>Explore all day excursions</h2>
          <ul>
            {excursions.map((excursion) => (
              <li key={excursion.id}>
                <Link href={`/excursions/${encodeURIComponent(excursion.id)}`}>
                  {excursion.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </noscript>
    </>
  );
}
