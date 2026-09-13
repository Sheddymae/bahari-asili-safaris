import { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import SafariBuilder from '@/components/safari-builder/SafariBuilder';

export const metadata: Metadata = {
  title: 'Build Your Safari',
  description:
    'Create your personalized Kenya safari itinerary with Bahari Asili Safaris — choose your dates, travellers, style, and destinations, and get an instant estimated quotation.',
  alternates: { canonical: '/build-your-safari' },
  openGraph: {
    title: 'Build Your Safari — Bahari Asili Safaris',
    description: 'Create your personalized Kenya safari itinerary — choose your dates, travellers, style, and destinations.',
    type: 'website',
    url: '/build-your-safari',
  },
};

export default function BuildYourSafariPage() {
  return (
    <PageShell>
      <SafariBuilder />
    </PageShell>
  );
}
