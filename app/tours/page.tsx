import type { Metadata } from 'next';
import ToursPageClient from './ToursPageClient';

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
  return <ToursPageClient />;
}
