'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

export default function ContactPageClient() {
  const { t } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const openBooking = useCallback(() => setIsBookingOpen(true), []);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);

  const whatsappNumber = t.footer.phone.replace(/[^\d+]/g, '');

  return (
    <PageShell>
      <section className="py-20 lg:py-28 bg-sand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {t.nav.contact}
            </span>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {t.contact.title}
            </h1>
            <p className="font-inter text-muted-foreground text-base max-w-xl mx-auto">
              24-hour assistance in Italian, English, and French. Reach us however&apos;s easiest.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-card text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-ocean-50 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-ocean-700" />
              </div>
              <p className="font-inter text-sm text-foreground">{t.footer.address}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border shadow-card text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-ocean-50 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-ocean-700" />
              </div>
              <a href={`tel:${t.footer.phone}`} className="font-inter text-sm text-foreground hover:text-ocean-700">
                {t.footer.phone}
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border shadow-card text-center">
              <div className="w-11 h-11 mx-auto rounded-full bg-ocean-50 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-ocean-700" />
              </div>
              <a href={`mailto:${t.footer.email}`} className="font-inter text-sm text-foreground hover:text-ocean-700">
                {t.footer.email}
              </a>
            </div>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-border shadow-card text-center hover:border-safari-300 transition-colors"
            >
              <div className="w-11 h-11 mx-auto rounded-full bg-book/10 flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5 text-book" />
              </div>
              <p className="font-inter text-sm text-foreground">{t.contact.whatsAppTitle}</p>
            </a>
          </div>

          <div className="text-center">
            <button
              onClick={openBooking}
              className="bg-book hover:bg-book-600 text-white font-poppins font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              {t.contact.quoteTitle}
            </button>
          </div>
        </div>
      </section>

      {isBookingOpen && (
        <BookingModal isOpen={isBookingOpen} onClose={closeBooking} selectedTour="General Enquiry" />
      )}
    </PageShell>
  );
}
