import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us — Kenyan-Owned Safari Operator in Watamu',
  description:
    'Bahari Asili Safaris is a Kenyan-owned safari operator based in Watamu — not a foreign agency reselling local operators. Learn our mission, values, and story.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Bahari Asili Safaris',
    description: 'A Kenyan-owned safari operator based in Watamu, running safaris to Tsavo, Amboseli, Masai Mara and Taita Hills.',
    type: 'website',
    url: '/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
