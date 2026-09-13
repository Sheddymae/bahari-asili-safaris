import type { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Experiences — 24/7 Support, Private Transport & More',
  description:
    'What travelling with Bahari Asili Safaris includes: 24/7 assistance, private air-conditioned transport, and personalised support from your first message to your last day in Kenya.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Experiences — Bahari Asili Safaris',
    description: '24/7 assistance, private transport, and personalised support for your Kenya safari and coastal trip.',
    type: 'website',
    url: '/services',
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
