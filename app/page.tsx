'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustStrip from '@/components/TrustStrip';
import AboutSection from '@/components/AboutSection';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { safaris, excursions } from '@/lib/tours-data';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HeroBookingSelection } from '@/components/HeroBookingModal';

// Heavy sections -> lazy load only when user scrolls to them
const ToursSection = dynamic(() => import('@/components/ToursSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});
const HomeDestinationsSection = dynamic(() => import('@/components/HomeDestinationsSection'), {
  loading: () => <div className="h-96 bg-sand-50 animate-pulse" />,
});
const BuildSafariPromo = dynamic(() => import('@/components/BuildSafariPromo'), {
  loading: () => <div className="h-96 bg-foreground animate-pulse" />,
});
const ExcursionsSection = dynamic(() => import('@/components/ExcursionsSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});
const WildlifeCalendarSection = dynamic(() => import('@/components/WildlifeCalendarSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});
const TransfersSection = dynamic(() => import('@/components/TransfersSection'), {
  loading: () => <div className="h-96 bg-sand-50 animate-pulse" />,
});
const GallerySection = dynamic(() => import('@/components/GallerySection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});
const MemoriesSection = dynamic(() => import('@/components/MemoriesSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />,
});
const FinalCtaSection = dynamic(() => import('@/components/FinalCtaSection'), {
  loading: () => <div className="h-64 bg-ocean-700 animate-pulse" />,
});
const Footer = dynamic(() => import('@/components/Footer'));

// Booking dialogs are client-only because they use browser APIs and form state.
const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });
const HeroBookingModal = dynamic(() => import('@/components/HeroBookingModal'), { ssr: false });
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });

export default function Home() {
  const { t } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHeroBookingOpen, setIsHeroBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<string>('');
  const [heroBookingSelection, setHeroBookingSelection] = useState<HeroBookingSelection>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const openBooking = useCallback((tourName?: string) => {
    setSelectedTour(tourName || '');
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  const openHeroBooking = useCallback((selection: HeroBookingSelection = {}) => {
    setHeroBookingSelection(selection);
    setIsHeroBookingOpen(true);
  }, []);

  const closeHeroBooking = useCallback(() => {
    setIsHeroBookingOpen(false);
  }, []);

  // If arriving from a /safaris/[slug] or /excursions/[slug] detail page's
  // "Book This" button (?book=<id>), open the booking modal pre-filled.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookSlug = params.get('book');
    if (!bookSlug) return;
    const safari = safaris.find((s) => s.id === bookSlug);
    if (safari) {
      openBooking(safari.name);
      document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const excursion = excursions.find((e) => e.id === bookSlug);
    if (excursion) {
      openBooking(excursion.name);
      document.getElementById('excursions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [openBooking]);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection onBook={openHeroBooking} />
        <TrustStrip />

        <AnimateOnScroll direction="up">
          <AboutSection />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <ToursSection onBook={openBooking} />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <HomeDestinationsSection />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <BuildSafariPromo />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <ExcursionsSection onBook={openBooking} />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <WildlifeCalendarSection />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <MemoriesSection onBook={() => openBooking()} />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <TransfersSection onBook={openBooking} />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <GallerySection />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <ReviewsSection />
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <FinalCtaSection onBook={() => openHeroBooking()} />
        </AnimateOnScroll>
      </main>
      <Footer />

      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={closeBooking}
          selectedTour={selectedTour}
        />
      )}

      <HeroBookingModal
        isOpen={isHeroBookingOpen}
        onClose={closeHeroBooking}
        initialSelection={heroBookingSelection}
      />

      {bookingSuccess && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-primary px-6 py-4 font-inter text-white shadow-lg">
          {t.inquiryStatus.receivedDesc}
        </div>
      )}
      <WhatsAppButton />
    </>
  );
}
