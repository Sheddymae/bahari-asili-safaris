import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safari & Travel Partners — Bahari Asili Safaris',
  description: 'Learn about the lodges, camps and local suppliers featured in Bahari Asili Safaris itineraries.',
  openGraph: {
    title: 'Safari & Travel Partners — Bahari Asili Safaris',
    description: 'Lodges, camps and local suppliers featured in our safari itineraries.',
    type: 'website',
    url: '/partners',
  },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
