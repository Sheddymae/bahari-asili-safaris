import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us — Bahari Asili Safaris, Watamu',
  description:
    'Get in touch with Bahari Asili Safaris in Watamu, Kenya. WhatsApp, phone, and email — plan your safari or coastal trip with a local team.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Bahari Asili Safaris',
    description: 'Reach our Watamu-based team by WhatsApp, phone, or email to plan your Kenya safari.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
