'use client';

import Image from 'next/image';
import { ArrowUpRight, CarFront, MapPin, Plane } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type TransferCard = {
  code: string;
  image: string;
  actionValue: string;
};

const TRANSFER_CARDS = [
  { code: 'MYD', image: '/images/gallery/coast-beach.png', actionValue: 'Airport Transfer – MYD (Malindi)' },
  { code: 'MBA', image: '/images/home/services-safari-jeep.jpg', actionValue: 'Airport Transfer – MBA (Mombasa)' },
  { code: 'NBO', image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg', actionValue: 'Airport Transfer – NBO (Nairobi)' },
];

function StackingCard({
  card,
  index,
  onBook,
}: {
  card: TransferCard;
  index: number;
  onBook: (value: string) => void;
}) {
  const { t } = useLanguage();
  const tr = t.transfers;
  const airport = tr.airports.find((item: { code: string }) => item.code === card.code) ?? tr.airports[0];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 90px'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <motion.article
      ref={ref}
      style={{ scale, top: `calc(90px + ${index * 40}px)` }}
      className="sticky z-10 mb-10 h-auto min-h-[520px] w-full overflow-hidden rounded-[30px] border border-white/75 bg-white/25 shadow-[0_30px_90px_-15px_rgba(14,95,107,0.22)] backdrop-blur-3xl ring-1 ring-white/45 sm:min-h-[470px] lg:h-[470px]"
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[45%_55%]">
        <div className="relative flex min-w-0 flex-col justify-between p-5 sm:p-7 lg:p-10">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {card.code ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-safari-500 px-3 py-1.5 font-poppins text-[10px] font-extrabold tracking-[0.12em] text-white sm:text-xs">
                  <Plane className="h-3.5 w-3.5" />
                  {card.code}
                </span>
              ) : null}

            </div>

            <h2 className="font-poppins text-xl font-bold leading-tight text-ocean-700 sm:text-3xl lg:text-4xl">
              {airport.name}
            </h2>

            <p className="mt-4 max-w-[28rem] font-inter text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6 lg:text-base">
              {airport.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onBook(card.actionValue)}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-ocean-700/95 px-3.5 py-2.5 font-poppins text-[10px] font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:-translate-y-0.5 hover:bg-ocean-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500 sm:px-4 sm:py-3 sm:text-xs"
          >
            {tr.cta}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative min-h-[230px] overflow-hidden md:min-h-0">
          <Image
            src={card.image}
            alt={airport.name}
            fill
            sizes="(max-width: 767px) 55vw, (max-width: 1279px) 38vw, 35vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      </div>
    </motion.article>
  );
}


export default function TransfersStackingCards({
  onBook,
}: {
  onBook: (value: string) => void;
}) {
  const { t } = useLanguage();
  const tr = t.transfers;
  const wildlife = t.wildlifeCalendar;

  return (
    <section className="relative overflow-hidden bg-sand-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.72),transparent_30%),radial-gradient(circle_at_70%_35%,rgba(14,95,107,0.15),transparent_44%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:gap-16">
        <div className="self-start lg:sticky lg:top-[90px]">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/45 px-3 py-1.5 font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-ocean-700 shadow-sm backdrop-blur-2xl sm:text-xs">
              <MapPin className="h-3.5 w-3.5 text-safari-500" />
              {tr.label}
            </div>
            <h1 className="font-poppins text-4xl font-bold leading-[1.02] text-ocean-700 sm:text-5xl lg:text-6xl">
              {tr.title}
              <span className="mt-1 block text-safari-500">{tr.titleHighlight}</span>
            </h1>
            <p className="mt-5 max-w-lg font-inter text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {tr.subtitle}
            </p>
          </div>
        </div>

        <div className="relative min-h-[1950px]">
          {TRANSFER_CARDS.map((card, index) => (
            <StackingCard key={card.code} card={card} index={index} onBook={onBook} />
          ))}

        </div>
      </div>
    </section>
  );
}
