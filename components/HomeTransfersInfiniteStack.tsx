'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Car, CheckCircle2, Plane, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

type TransferCard = {
  code: string;
  title: string;
  description: string;
  route: string;
  details: string[];
  bookingValue: string;
  image: string;
};

const TRANSFERS: TransferCard[] = [
  {
    code: 'MYD',
    title: 'Malindi Airport',
    description: 'A smooth private connection from Malindi Airport to Watamu hotels, beach resorts and safari starting points.',
    route: 'Malindi Airport → Watamu',
    details: ['Private air-conditioned vehicle', 'Meet & greet on arrival', 'Approx. 30 min to Watamu'],
    bookingValue: 'Airport Transfer – MYD (Malindi)',
    image: '/images/gallery/coast-beach.png',
  },
  {
    code: 'MBA',
    title: 'Mombasa Moi Airport',
    description: 'Comfortable door-to-door coastal transfer from Mombasa to Watamu, planned around your arrival or departure time.',
    route: 'Mombasa Airport → Watamu',
    details: ['Private road transfer', 'Luggage assistance', 'Approx. 2 hours to Watamu'],
    bookingValue: 'Airport Transfer – MBA (Mombasa)',
    image: '/images/home/services-safari-jeep.jpg',
  },
  {
    code: 'NBO',
    title: 'Nairobi JKIA',
    description: 'Connect an international Nairobi arrival with your coast holiday or safari using a coordinated flight and private transfer.',
    route: 'JKIA → Kenya Coast',
    details: ['Airport coordination', 'Private transfer option', 'Safari + coast connections'],
    bookingValue: 'Airport Transfer – NBO (Nairobi)',
    image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg',
  },
  {
    code: 'UKD',
    title: 'Diani / Ukunda',
    description: 'Private transfers for travellers arriving at Ukunda Airstrip or moving between Diani Beach, Mombasa and other coastal destinations.',
    route: 'Ukunda / Diani → Coast',
    details: ['Ukunda Airstrip pickup', 'Diani hotel transfers', 'Private air-conditioned vehicle'],
    bookingValue: 'Diani / Ukunda Transfer',
    image: '/images/gallery/coast-beach.png',
  },
];

export default function HomeTransfersInfiniteStack({
  onBook,
}: {
  onBook: (transferType: string) => void;
}) {
  const { t } = useLanguage();
  const tr = t.transfers;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cards = useMemo(() => TRANSFERS, []);

  const advance = useCallback(() => {
    setActiveIndex((current) => (current + 1) % cards.length);
  }, [cards.length]);

  const previous = useCallback(() => {
    setActiveIndex((current) => (current - 1 + cards.length) % cards.length);
  }, [cards.length]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (paused || cards.length < 2) return;
    const timer = window.setInterval(advance, 4200);
    return () => window.clearInterval(timer);
  }, [advance, paused, cards.length]);

  const visibleCards = [-1, 0, 1].map((offset) => ({
    card: cards[(activeIndex + offset + cards.length) % cards.length],
    offset,
  }));

  return (
    <section
      id="transfers"
      className="relative overflow-hidden bg-sand-100 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,95,107,0.14),transparent_48%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-ocean-700 shadow-sm backdrop-blur-xl">
            <Plane className="h-3.5 w-3.5 text-safari-500" />
            {tr.label || 'Transfers & Services'}
          </span>
          <h2 className="mt-4 font-poppins text-3xl font-bold leading-tight text-ocean-700 sm:text-4xl lg:text-5xl">
            {tr.title || 'We take care of'} <span className="text-safari-500">{tr.titleHighlight || 'everything'}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-inter text-sm leading-6 text-ocean-700/70 sm:text-base">
            {tr.subtitle || 'Private airport, coastal and safari transfers arranged around your itinerary.'}
          </p>
        </div>

        <div className="relative mx-auto h-[520px] max-w-6xl overflow-visible sm:h-[550px]">
          {visibleCards.map(({ card, offset }) => {
            const isActive = offset === 0;
            return (
              <motion.article
                key={`${card.code}-${activeIndex}`}
                initial={{ opacity: 0, x: offset * 80, scale: isActive ? 0.96 : 0.88 }}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  x: offset * (isMobile ? 145 : 390),
                  scale: isActive ? 1 : 0.88,
                  y: isActive ? 0 : 26,
                }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute left-1/2 top-0 h-[470px] w-[88%] max-w-[650px] -translate-x-1/2 overflow-hidden rounded-[32px] border border-white/50 bg-white/30 shadow-[0_30px_90px_rgba(14,95,107,0.20)] backdrop-blur-2xl sm:h-[500px] sm:w-[620px] ${isActive ? 'z-30' : 'z-10 pointer-events-none'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/65 via-white/25 to-ocean-700/10" />
                <div className="relative grid h-full grid-rows-[42%_58%]">
                  <div className="relative overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 font-poppins text-[10px] font-extrabold tracking-[0.14em] text-white backdrop-blur-md">
                          <Plane className="h-3.5 w-3.5" />
                          {card.code}
                        </span>
                        <h3 className="mt-2 font-poppins text-2xl font-bold text-white sm:text-3xl">{card.title}</h3>
                      </div>
                      <MapPin className="mb-1 hidden h-7 w-7 text-white/90 sm:block" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-7">
                    <div>
                      <p className="font-poppins text-xs font-bold uppercase tracking-[0.12em] text-safari-500">{card.route}</p>
                      <p className="mt-2 font-inter text-sm leading-6 text-ocean-700/80">{card.description}</p>
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {card.details.map((detail) => (
                          <div key={detail} className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/45 px-3 py-2.5 backdrop-blur-md">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safari-500" />
                            <span className="font-inter text-[11px] leading-4 text-ocean-700/80">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 font-inter text-xs font-semibold text-ocean-700/65">
                        <Car className="h-4 w-4 text-safari-500" />
                        Private transfer service
                      </span>
                      <button
                        type="button"
                        onClick={() => onBook(card.bookingValue)}
                        className="inline-flex items-center gap-2 rounded-xl bg-ocean-700 px-5 py-3 font-poppins text-xs font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:-translate-y-0.5 hover:bg-ocean-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500"
                      >
                        {tr.cta || 'Request your transfer'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}

          <button
            type="button"
            onClick={previous}
            aria-label="Previous transfer"
            className="absolute left-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-full border border-white/60 bg-white/45 p-4 text-ocean-700 shadow-xl backdrop-blur-xl transition hover:scale-105 hover:bg-white/70 md:flex"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={advance}
            aria-label="Next transfer"
            className="absolute right-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-full border border-white/60 bg-white/45 p-4 text-ocean-700 shadow-xl backdrop-blur-xl transition hover:scale-105 hover:bg-white/70 md:flex"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-2">
          {cards.map((card, index) => (
            <button
              key={card.code}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${card.title}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-10 bg-safari-500' : 'w-2 bg-ocean-700/20'}`}
            />
          ))}
        </div>

        <div className="mx-auto mt-7 flex max-w-2xl items-center justify-center gap-2 text-center font-inter text-xs text-ocean-700/60">
          <span className="inline-flex h-2 w-2 rounded-full bg-safari-500 shadow-[0_0_0_5px_rgba(255,122,24,0.12)]" />
          Auto-rotating transfer routes • pause by hovering
        </div>
      </div>
    </section>
  );
}
