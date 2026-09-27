'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Car, CheckCircle2, Plane, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const TRANSFERS = [
  { code: 'MYD', image: '/images/gallery/coast-beach.png', bookingValue: 'Airport Transfer – MYD (Malindi)' },
  { code: 'MBA', image: '/images/home/services-safari-jeep.jpg', bookingValue: 'Airport Transfer – MBA (Mombasa)' },
  { code: 'NBO', image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg', bookingValue: 'Airport Transfer – NBO (Nairobi)' },
];

export default function HomeTransfersInfiniteStack({ onBook }: { onBook: (transferType: string) => void }) {
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
    const timer = window.setInterval(advance, 5000);
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.72),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(14,95,107,0.16),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/45 px-4 py-2 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-ocean-700 shadow-[0_10px_30px_rgba(14,95,107,0.08)] backdrop-blur-2xl">
            <Plane className="h-3.5 w-3.5 text-safari-500" />
            {tr.label}
          </span>
          <h2 className="mt-4 font-poppins text-3xl font-bold leading-tight text-ocean-700 sm:text-4xl lg:text-5xl">
            {tr.title} <span className="text-safari-500">{tr.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-inter text-sm leading-6 text-ocean-700/70 sm:text-base">
            {tr.subtitle}
          </p>
        </div>

        <div className="relative mx-auto flex h-[510px] w-full max-w-[1180px] items-start justify-center overflow-visible sm:h-[535px]">
          {visibleCards.map(({ card, offset }) => {
            const isActive = offset === 0;
            const airport = tr.airports.find((item: { code: string }) => item.code === card.code) ?? tr.airports[0];
            return (
              <motion.article
                key={`${card.code}-${activeIndex}`}
                initial={{ opacity: 0, x: offset * 80, scale: isActive ? 0.96 : 0.88 }}
                animate={{
                  opacity: isActive ? 1 : 0.56,
                  x: offset * (isMobile ? 112 : 360),
                  scale: isActive ? 1 : 0.9,
                  y: isActive ? 0 : 28,
                }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ left: isMobile ? '2%' : 'calc(50% - 290px)', width: isMobile ? '96%' : '580px' }}
                className={`group absolute top-0 h-[455px] overflow-hidden rounded-[32px] border border-white/75 bg-white/25 shadow-[0_30px_90px_rgba(14,95,107,0.20)] backdrop-blur-3xl ring-1 ring-white/40 transition-all duration-500 sm:h-[475px] ${isActive ? 'z-30' : 'z-10 pointer-events-none'}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/25 to-ocean-700/10" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />

                <div className="relative grid h-full grid-rows-[42%_58%]">
                  <div className="relative overflow-hidden">
                    <Image
                      src={card.image}
                      alt={airport.name}
                      fill
                      sizes="(max-width: 767px) 96vw, 580px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/75 via-ocean-900/10 to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-center gap-3 text-center">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 font-poppins text-[10px] font-extrabold tracking-[0.14em] text-white shadow-lg backdrop-blur-xl">
                          <Plane className="h-3.5 w-3.5" />
                          {card.code}
                        </span>
                        <h3 className="mt-2 font-poppins text-2xl font-bold text-white drop-shadow-md sm:text-3xl">{airport.name}</h3>
                      </div>
                      <MapPin className="absolute bottom-1 right-1 hidden h-7 w-7 text-white/90 sm:block" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-4 sm:p-5">
                    <div>
                      <p className="font-poppins text-xs font-bold uppercase tracking-[0.12em] text-safari-500">{airport.name}</p>
                      <p className="mt-2 font-inter text-[13px] leading-5 text-ocean-700/80">{airport.desc}</p>
                      <div className="mx-auto mt-3 grid w-full max-w-[540px] grid-cols-1 gap-1.5 sm:grid-cols-3">
                        {tr.services.slice(0, 3).map((service) => (
                          <div key={service.title} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/80 bg-white/40 px-2.5 py-2 text-center shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:bg-white/55">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-safari-500" />
                            <span className="font-inter text-[11px] leading-4 text-ocean-700/80">{service.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/35 px-3 py-1.5 font-inter text-xs font-semibold text-ocean-700/70 shadow-sm backdrop-blur-xl">
                        <Car className="h-4 w-4 text-safari-500" />
                        {tr.services?.[1]?.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => onBook(card.bookingValue)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-ocean-700/95 px-4 py-2.5 font-poppins text-xs font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:-translate-y-0.5 hover:bg-ocean-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500"
                      >
                        {tr.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="relative z-40 mx-auto -mt-1 flex max-w-xl items-center justify-between rounded-full border border-white/75 bg-white/35 px-3 py-2 shadow-[0_14px_40px_rgba(14,95,107,0.10)] backdrop-blur-2xl">
          <button type="button" onClick={previous} aria-label={tr.title} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/45 text-ocean-700 transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-center gap-2">
            {cards.map((card, index) => (
              <button key={card.code} type="button" onClick={() => setActiveIndex(index)} aria-label={airport.name} className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-10 bg-safari-500' : 'w-2 bg-ocean-700/20'}`} />
            ))}
          </div>
          <button type="button" onClick={advance} aria-label={tr.titleHighlight || tr.title} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/45 text-ocean-700 transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
