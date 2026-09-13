import type { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Booking terms, payment, cancellations, and client responsibilities for trips booked with Bahari Asili Safaris.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
