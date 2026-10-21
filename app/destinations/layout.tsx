import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kenya Safari Destinations — Tsavo, Amboseli & Beyond',
  description:
    'Explore Kenya safari destinations from Watamu, including Tsavo, Amboseli and other wildlife regions. Compare landscapes, wildlife highlights and the best season to visit.',
  alternates: { canonical: '/destinations' },
  openGraph: {
    title: 'Kenya Safari Destinations — Bahari Asili Safaris',
    description:
      'Explore Kenya wildlife destinations from Watamu and learn about highlights, seasons and safari options.',
    type: 'website',
    url: '/destinations',
  },
};
 
export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
