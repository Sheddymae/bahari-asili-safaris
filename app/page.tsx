'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustStrip from '@/components/TrustStrip';
import AboutSection from '@/components/AboutSection';
import HomeConversionSection from '@/components/HomeConversionSection';
import StructuredData from '@/components/StructuredData';
import ScrollReveal from '@/components/ScrollReveal';
import HowToBook from '@/components/HowToBook';
import TravelerEssentials from '@/components/TravelerEssentials';
import { safaris, excursions } from '@/lib/tours-data';
import type { HeroBookingSelection } from '@/components/HeroBookingModal';

const ToursSection = dynamic(() => import('@/components/ToursSection'), { loading: () => <div className="h-64 bg-sand-50 animate-pulse" /> });
const HomeDestinationsSection = dynamic(() => import('@/components/HomeDestinationsSection'), { loading: () => <div className="h-64 bg-sand-50 animate-pulse" /> });
const BuildSafariPromo = dynamic(() => import('@/components/BuildSafariPromo'), { loading: () => <div className="h-64 bg-foreground animate-pulse" /> });
const ExcursionsSection = dynamic(() => import('@/components/ExcursionsSection'), { loading: () => <div className="h-64 bg-white animate-pulse" /> });
const WildlifeCalendarSection = dynamic(() => import('@/components/WildlifeCalendarSection'), { loading: () => <div className="h-64 bg-white animate-pulse" /> });
const GallerySection = dynamic(() => import('@/components/GallerySection'), { loading: () => <div className="h-64 bg-white animate-pulse" /> });
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'), { loading: () => <div className="h-64 bg-white animate-pulse" /> });
const FinalCtaSection = dynamic(() => import('@/components/FinalCtaSection'), { loading: () => <div className="h-48 bg-ocean-700 animate-pulse" /> });
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
        <ScrollReveal direction="up"><HeroSection onBook={openHeroBooking} /></ScrollReveal>
        <ScrollReveal direction="up"><TrustStrip /></ScrollReveal>
        <ScrollReveal direction="up"><HowToBook /></ScrollReveal>
        <ScrollReveal direction="left"><HomeConversionSection onBook={() => openHeroBooking()} /></ScrollReveal>
        <ScrollReveal direction="right"><AboutSection variant="home" /></ScrollReveal>
        <ScrollReveal direction="up"><ToursSection variant="home" onBook={openBooking} /></ScrollReveal>
        <ScrollReveal direction="left"><HomeDestinationsSection /></ScrollReveal>
        <ScrollReveal direction="right"><BuildSafariPromo /></ScrollReveal>
        <ScrollReveal direction="up"><TravelerEssentials /></ScrollReveal>
        <ScrollReveal direction="left"><ExcursionsSection variant="home" onBook={openBooking} /></ScrollReveal>
        <ScrollReveal direction="up">
          <section className="bg-sand-50/60 py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-[62%] min-w-0">
                  <WildlifeCalendarSection embedded />
                </div>

                <div className="w-full lg:w-[38%] min-w-0">
                  <aside className="rounded-3xl bg-[#FFFBEB] p-8 border border-orange-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                    <p className="text-[#FF7A18] text-xs tracking-widest uppercase font-bold">
                      Transfers &amp; Services
                    </p>
                    <h2 className="mt-3 text-[#0E5F6B] text-3xl sm:text-4xl font-black leading-tight">
                      We take care of everything
                    </h2>
                    <p className="mt-4 text-slate-600 text-sm leading-6">
                      From the moment you land to the moment you leave, we are with you.
                    </p>
                    <a
                      href="/transfers"
                      className="mt-7 inline-flex items-center rounded-full bg-[#0E5F6B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0E5F6B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18] focus-visible:ring-offset-2"
                    >
                      Explore Transfers →
                    </a>
                  </aside>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
                <ScrollReveal direction="right"><GallerySection variant="home" /></ScrollReveal>
        <ScrollReveal direction="up"><ReviewsSection /></ScrollReveal>
        <ScrollReveal direction="right"><FinalCtaSection onBook={() => openHeroBooking()} /></ScrollReveal>
      </main>
      <ScrollReveal direction="up"><Footer /></ScrollReveal>
      {isBookingOpen && <BookingModal isOpen={isBookingOpen} onClose={closeBooking} selectedTour={selectedTour} />}
      <HeroBookingModal isOpen={isHeroBookingOpen} onClose={closeHeroBooking} initialSelection={heroBookingSelection} />
      {/* Safari Assistant intentionally disabled. Re-enable by restoring <SafariAssistant onRequestQuote={() => openHeroBooking()} /> here. */}
    </>
  );
}
