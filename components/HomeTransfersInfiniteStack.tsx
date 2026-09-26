'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Car, Plane, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type StackCard = {
  code: string;
  title: string;
  description: string;
  bookingValue: string;
  kind: 'airport' | 'peak';
};

const AIRPORT_CODES = ['MYD', 'MBA', 'NBO'] as const;

export default function HomeTransfersInfiniteStack({
  onBook,
}: {
  onBook: (transferType: string) => void;
}) {
  const { t } = useLanguage();
  const tr = t.transfers;
  const wildlife = t.wildlifeCalendar;

  const cards = useMemo<StackCard[]>(() => {
    const airportCards = AIRPORT_CODES.map((code) => {
      const airport = tr.airports?.find((item: { code: string }) => item.code === code);
      const names: Record<(typeof AIRPORT_CODES)[number], string> = {
        MYD: 'Malindi Airport',
        MBA: 'Mombasa Moi Airport',
        NBO: 'Nairobi JKIA',
      };

      return {
        code,
        title: airport?.name || names[code],
        description: airport?.desc || '',
        bookingValue: `Airport Transfer – ${code} (${code === 'MYD' ? 'Malindi' : code === 'MBA' ? 'Mombasa' : 'Nairobi'})`,
        kind: 'airport' as const,
      };
    });

    return [
      ...airportCards,
      {
        code: 'PEAK',
        title: wildlife?.legendPeak || 'Peak Viewing',
        description:
          wildlife?.footnote ||
          'Highlighted months are peak viewing windows. Wildlife sightings can never be 100% guaranteed.',
        bookingValue: 'Private 4×4 Driver',
        kind: 'peak' as const,
      },
    ];
  }, [tr.airports, wildlife]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const advance = useCallback(() => {
    setActiveIndex((current) => (current + 1) % cards.length);
  }, [cards.length]);

  useEffect(() => {
    if (isHovered || cards.length < 2) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const delay = window.setTimeout(() => {
      interval = window.setInterval(advance, 3500);
    }, 2000);

    return () => {
      window.clearTimeout(delay);
      if (interval) window.clearInterval(interval);
    };
  }, [advance, isHovered, cards.length]);

  const activeCard = cards[activeIndex];
  const behindCards = [1, 2, 3].map((depth) => cards[(activeIndex + depth) % cards.length]);

  return (
    <aside
      className="w-full lg:sticky lg:top-[100px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Airport transfers and peak viewing"
    >
      <div className="mb-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF7A18]">
          {tr.label || 'Transfers'}
        </p>
        <h2 className="mt-1 font-poppins text-2xl font-bold leading-tight text-[#0E5F6B]">
          {tr.title || 'We take care of everything'}
        </h2>
        <p className="mt-2 font-inter text-sm leading-5 text-[#0E5F6B]/75">
          {tr.subtitle || 'Airport connections and private transfers, arranged around your itinerary.'}
        </p>
      </div>

      <div className="relative h-[390px] w-full max-w-[460px] mx-auto lg:max-w-none">
        {behindCards.map((card, depth) => (
          <motion.div
            key={`${card.code}-behind-${depth}-${activeIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: depth * 14, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 h-[330px] rounded-[20px] border border-[#0E5F6B]/10 bg-[#FFFBEB] shadow-[0_18px_45px_rgba(14,95,107,0.10)]"
            style={{ zIndex: 10 - depth }}
            aria-hidden="true"
          >
            <div className="h-full rounded-[20px] border border-[#FF7A18]/10" />
          </motion.div>
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCard.code}
            initial={{ opacity: 0, x: 28, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, y: -6, scale: 0.96 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 z-30 h-[330px] overflow-hidden rounded-[20px] border border-[#0E5F6B]/10 bg-white shadow-[0_22px_55px_rgba(14,95,107,0.16)]"
          >
            <div className="flex h-full flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A18] px-3 py-1.5 font-poppins text-[10px] font-extrabold tracking-[0.12em] text-white">
                    {activeCard.kind === 'peak' ? (
                      <Sparkles className="h-3.5 w-3.5" />
                    ) : (
                      <Plane className="h-3.5 w-3.5" />
                    )}
                    {activeCard.code}
                  </span>

                  <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0E5F6B]/55">
                    {activeCard.kind === 'peak' ? 'Seasonal guide' : 'Private transfer'}
                  </span>
                </div>

                <div className="mt-8 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFFBEB] text-[#0E5F6B]">
                    {activeCard.kind === 'peak' ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <Car className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-poppins text-xl font-bold leading-tight text-[#0E5F6B]">
                      {activeCard.title}
                    </h3>
                    <p className="mt-3 font-inter text-sm leading-6 text-[#0E5F6B]/70">
                      {activeCard.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onBook(activeCard.bookingValue)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0E5F6B] px-4 py-3 font-poppins text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
                >
                  {tr.cta || 'Plan your transfer'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <div className="mt-4 flex items-center gap-1.5" aria-label="Transfer card progress">
                  {cards.map((card) => (
                    <span
                      key={card.code}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        card.code === activeCard.code
                          ? 'w-7 bg-[#FF7A18]'
                          : 'w-1.5 bg-[#0E5F6B]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
