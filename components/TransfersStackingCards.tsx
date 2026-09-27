'use client';

import Image from 'next/image';
import { ArrowUpRight, CarFront, MapPin, Plane } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type TransferCard = {
  eyebrow: string;
  code?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  action: string;
  actionValue: string;
};

const TRANSFER_CARDS: TransferCard[] = [
  {
    eyebrow: 'Closest airport',
    code: 'MYD',
    title: 'Malindi Airport',
    description: 'The nearest airport to Watamu, with a smooth private transfer to your safari start point.',
    image: '/images/gallery/coast-beach.png',
    imageAlt: 'Kenyan coast near Watamu',
    action: 'MYD transfer',
    actionValue: 'Airport Transfer – MYD (Malindi)',
  },
  {
    eyebrow: 'Coastal hub',
    code: 'MBA',
    title: 'Mombasa Moi Airport',
    description: 'A comfortable private road transfer from Mombasa to Watamu, with your journey planned around your arrival.',
    image: '/images/home/services-safari-jeep.jpg',
    imageAlt: 'Safari vehicle ready for a private transfer',
    action: 'MBA transfer',
    actionValue: 'Airport Transfer – MBA (Mombasa)',
  },
  {
    eyebrow: 'International gateway',
    code: 'NBO',
    title: 'Nairobi JKIA',
    description: 'Connect your international arrival with a coordinated flight and private transfer towards the Kenyan coast.',
    image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg',
    imageAlt: 'Kenyan safari landscape',
    action: 'NBO transfer',
    actionValue: 'Airport Transfer – NBO (Nairobi)',
  },  {
    eyebrow: 'Southern coast',
    code: 'UKD',
    title: 'Diani / Ukunda',
    description: 'Private transfers for Ukunda Airstrip arrivals and departures, with comfortable connections between Diani Beach, Mombasa and other coastal stays.',
    image: '/images/gallery/coast-beach.png',
    imageAlt: 'Kenyan coast near Diani',
    action: 'UKD / Diani transfer',
    actionValue: 'Diani / Ukunda Transfer',
  },

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
              <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                {card.eyebrow}
              </span>
            </div>

            <h2 className="font-poppins text-xl font-bold leading-tight text-ocean-700 sm:text-3xl lg:text-4xl">
              {card.title}
            </h2>

            <p className="mt-4 max-w-[28rem] font-inter text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6 lg:text-base">
              {card.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onBook(card.actionValue)}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-ocean-700/95 px-3.5 py-2.5 font-poppins text-[10px] font-semibold text-white shadow-lg shadow-ocean-700/20 transition hover:-translate-y-0.5 hover:bg-ocean-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500 sm:px-4 sm:py-3 sm:text-xs"
          >
            {card.action}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative min-h-[230px] overflow-hidden md:min-h-0">
          <Image
            src={card.image}
            alt={card.imageAlt}
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
