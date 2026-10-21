import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import TravelerEssentials from '@/components/TravelerEssentials';
import OfficialTravelResources from '@/components/OfficialTravelResources';

export const metadata: Metadata = {
  title: 'Travel Guide — Plan Your Kenya Safari',
  description: 'Practical Kenya travel guidance covering entry documents, official eTA resources, when to travel, packing, money, health and route planning.',
  alternates: { canonical: '/travel-guide' },
  openGraph: {
    title: 'Kenya Travel Guide | Bahari Asili Safaris',
    description: 'Practical guidance to help you prepare for your Kenya safari and coastal holiday.',
    type: 'website',
    url: '/travel-guide',
  },
};

export default function TravelGuidePage() {
  return (
    <PageShell>
      <TravelerEssentials />
      <OfficialTravelResources />
    </PageShell>
  );
}
