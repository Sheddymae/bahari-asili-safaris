import type { Metadata } from 'next';
import PrivacyPageClient from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bahari Asili Safaris collects, uses, and protects the personal data you share with us.',
  robots: { index: true, follow: true },
  openGraph: { title: 'Privacy Policy — Bahari Asili Safaris', description: 'How Bahari Asili Safaris collects, uses, and protects the personal data you share with us.', type: 'website', url: '/privacy' },
  twitter: { card: 'summary', title: 'Privacy Policy — Bahari Asili Safaris', description: 'How Bahari Asili Safaris collects, uses, and protects the personal data you share with us.' },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
