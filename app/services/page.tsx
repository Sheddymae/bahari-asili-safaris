import type { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Travel Services — Transfers, Car Rental & More',
  description:
    'Arrange airport transfers, ask about car rental, get currency exchange guidance and SIM support, and access the official Kenya eTA portal from Bahari Asili Safaris.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Travel Services — Bahari Asili Safaris',
    description: 'Airport transfers, car rental enquiries, currency exchange guidance, SIM connectivity help and direct access to official Kenya eTA services.',
    type: 'website',
    url: '/services',
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
