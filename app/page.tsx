'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HomeIntro from '@/components/home/HomeIntro';
import StructuredData from '@/components/StructuredData';
import HowToBook from '@/components/HowToBook';
import { safaris, excursions } from '@/lib/tours-data';
import type { HeroBookingSelection } from '@/components/HeroBookingModal';

const HomePopularSafaris = dynamic(() => import('@/components/home/HomePopularSafaris'), { loading: () => <div className="h-64 bg-sand-50" /> });
const HomeFromWatamu = dynamic(() => import('@/components/home/HomeFromWatamu'), { loading: () => <div className="h-64 bg-white" /> });
const HomeCoast = dynamic(() => import('@/components/home/HomeCoast'), { loading: () => <div className="h-64 bg-sand-50" /> });
const HomeWhy = dynamic(() => import('@/components/home/HomeWhy'), { loading: () => <div className="h-64 bg-white" /> });
const BuildSafariPromo = dynamic(() => import('@/components/BuildSafariPromo'), { loading: () => <div className="h-64 bg-foreground" /> });
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'), { loading: () => <div className="h-64 bg-sand-50" /> });
const HomeTeam = dynamic(() => import('@/components/home/HomeTeam'), { loading: () => <div className="h-64 bg-sand-50" /> });
const FinalCtaSection = dynamic(() => import('@/components/FinalCtaSection'), { loading: () => <div className="h-48 bg-ocean-800" /> });
const Footer = dynamic(() => import('@/components/Footer'));
const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });
const HeroBookingModal = dynamic(() => import('@/components/HeroBookingModal'), { ssr: false });

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHeroBookingOpen, setIsHeroBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<string>('');
  const [heroBookingSelection, setHeroBookingSelection] = useState<HeroBookingSelection>({});
  const openBooking = useCallback((tourName?: string) => { setSelectedTour(tourName || ''); setIsBookingOpen(true); }, []);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);
  const openHeroBooking = useCallback((selection: HeroBookingSelection = {}) => { setHeroBookingSelection(selection); setIsHeroBookingOpen(true); }, []);
  const closeHeroBooking = useCallback(() => setIsHeroBookingOpen(false), []);
  useEffect(() => { const params = new URLSearchParams(window.location.search); const bookSlug = params.get('book'); if (!bookSlug) return; const safari = safaris.find((s) => s.id === bookSlug); if (safari) { openBooking(safari.name); document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; } const excursion = excursions.find((e) => e.id === bookSlug); if (excursion) { openBooking(excursion.name); document.getElementById('excursions')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, [openBooking]);
  return (
    <>
      <StructuredData />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="homepage-main min-w-0 overflow-x-clip outline-none">
        <HeroSection onBook={openHeroBooking} />
        <HomeIntro />
        <HomePopularSafaris onBook={openBooking} />
        <HomeFromWatamu />
        <HomeCoast />
        <HomeWhy />
        <BuildSafariPromo />
        <HowToBook />
        <ReviewsSection />
        <HomeTeam />
        <FinalCtaSection onBook={() => openHeroBooking()} />
      </main>
      <Footer />
      {isBookingOpen && <BookingModal isOpen={isBookingOpen} onClose={closeBooking} selectedTour={selectedTour} />}
      <HeroBookingModal isOpen={isHeroBookingOpen} onClose={closeHeroBooking} initialSelection={heroBookingSelection} />
    </>
  );
}
