import type { Metadata } from 'next';
import TransfersPageClient from './TransfersPageClient';

export const metadata: Metadata = {
  title: 'Airport & Safari Transfers — Watamu, Malindi, Mombasa',
  description:
    'Private airport and coastal transfers from Malindi (MYD), Mombasa (MBA) and Nairobi (NBO/JKIA), plus road transfers between Watamu and your safari destination.',
  alternates: { canonical: '/transfers' },
  openGraph: {
    title: 'Airport & Safari Transfers — Bahari Asili Safaris',
    description: 'Private, air-conditioned transfers from Malindi, Mombasa and Nairobi airports, plus safari road transfers.',
    type: 'website',
    url: '/transfers',
  },
};

export default function TransfersPage() {
  return <TransfersPageClient />;
}
