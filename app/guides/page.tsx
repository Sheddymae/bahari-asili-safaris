import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hubGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Kenya Safari Travel Guides — Costs, Best Time, Family & Packing',
  description:
    'Practical Kenya safari guides: what a safari costs, the best months for safari and coast, travelling with children or older guests, and a complete packing list.',
  openGraph: {
    title: 'Kenya Safari Travel Guides — Bahari Asili Safaris',
    description: 'Costs, best time to travel, family and accessibility advice, and packing for a Kenya safari from Watamu.',
    type: 'website',
    url: '/guides',
  },
  twitter: { card: 'summary', title: 'Kenya Safari Travel Guides — Bahari Asili Safaris', description: 'Costs, best time to travel, family and accessibility advice, and packing for a Kenya safari from Watamu.' },
};

export default function GuidesIndexPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 font-inter text-sm text-muted-foreground">
          <Link href="/" className="hover:text-ocean-700">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Travel guides</span>
        </nav>
        <h1 className="font-poppins text-3xl font-extrabold text-foreground sm:text-4xl">Kenya safari travel guides</h1>
        <p className="mt-4 max-w-2xl font-inter text-base leading-relaxed text-foreground">
          Straight answers to the questions travellers ask before booking: what a safari really costs, which months work best, whether it suits children or older guests, and what to pack. No invented prices or promises about wildlife.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {hubGuides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`} className="block h-full rounded-2xl border border-border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
                <h2 className="font-poppins text-lg font-bold text-foreground">{guide.h1}</h2>
                <p className="mt-2 font-inter text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
                <span className="mt-4 inline-block font-inter text-sm font-semibold text-ocean-700">Read the guide →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-inter text-sm text-muted-foreground">Updated {hubGuides[0].updated}.</p>
      </main>
      <Footer />
    </>
  );
}
