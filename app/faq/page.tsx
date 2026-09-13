import type { Metadata } from 'next';
import FaqPageClient from './FaqPageClient';

export const metadata: Metadata = {
  title: 'FAQ — Booking, Safaris, Families, Transport & Payment',
  description:
    'Answers to common questions about booking a Bahari Asili Safaris trip: deposits, cancellations, what to pack, family travel, transport, and coastal excursions.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — Bahari Asili Safaris',
    description: 'Common questions about booking, safaris, families, transport, payment and cancellations.',
    type: 'website',
    url: '/faq',
  },
};

export default function FaqPage() {
  return <FaqPageClient />;
}
