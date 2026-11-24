import type { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Booking terms, payment, cancellations, and client responsibilities for trips booked with Bahari Asili Safaris.',
  robots: { index: true, follow: true },
  openGraph: { title: 'Terms & Conditions — Bahari Asili Safaris', description: 'Booking terms, payment, cancellations, and client responsibilities for trips booked with Bahari Asili Safaris.', type: 'website', url: '/terms' },
  twitter: { card: 'summary', title: 'Terms & Conditions — Bahari Asili Safaris', description: 'Booking terms, payment, cancellations, and client responsibilities for trips booked with Bahari Asili Safaris.' },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
