'use client';

import Image from 'next/image';
import { ArrowUpRight, CalendarDays, CarFront, MapPin, Plane } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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
    action: 'Arrange MYD transfer',
    actionValue: 'Airport Transfer – MYD (Malindi)',
  },
  {
    eyebrow: 'Coastal hub',
    code: 'MBA',
    title: 'Mombasa Moi Airport',
    description: 'A comfortable private road transfer from Mombasa to Watamu, with your journey planned around your arrival.',
    image: '/images/home/services-safari-jeep.jpg',
    imageAlt: 'Safari vehicle ready for a private transfer',
    action: 'Arrange MBA transfer',
    actionValue: 'Airport Transfer – MBA (Mombasa)',
  },
  {
    eyebrow: 'International gateway',
    code: 'NBO',
    title: 'Nairobi JKIA',
    description: 'Connect your international arrival with a coordinated flight and private transfer towards the Kenyan coast.',
    image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg',
    imageAlt: 'Kenyan safari landscape',
    action: 'Arrange NBO transfer',
    actionValue: 'Airport Transfer – NBO (Nairobi)',
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
      className="sticky z-10 mb-10 h-[390px] w-full overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] ring-1 ring-slate-200/80 sm:h-[430px] lg:h-[470px]"
    >
      <div className="grid h-full grid-cols-[45%_55%]">
        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-7 lg:p-10">
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
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-ocean-700 px-3.5 py-2.5 font-poppins text-[10px] font-semibold text-white hover:bg-ocean-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 sm:px-4 sm:py-3 sm:text-xs"
          >
            {card.action}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative min-h-0 overflow-hidden">
          <Image
            src={card.image}
            alt={card.imageAlt}
            fill
            sizes="(max-width: 767px) 55vw, (max-width: 1279px) 38vw, 35vw"
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5" />
        </div>
      </div>
    </motion.article>
  );
}

function PeakViewingCard({ onBook, index }: { onBook: (value: string) => void; index: number }) {
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
      className="sticky z-10 mb-10 h-[390px] w-full overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] ring-1 ring-slate-200/80 sm:h-[430px] lg:h-[470px]"
    >
      <div className="grid h-full grid-cols-[45%_55%]">
        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-7 lg:p-10">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-safari-500 px-3 py-1.5 font-poppins text-[10px] font-extrabold text-white sm:text-xs">
                <CalendarDays className="h-3.5 w-3.5" />
                Peak viewing
              </span>
              <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                Seasonal guide
              </span>
            </div>

            <h2 className="font-poppins text-xl font-bold leading-tight text-ocean-700 sm:text-3xl lg:text-4xl">
              Peak Viewing + Transfers
            </h2>

            <div className="mt-4 space-y-2.5 font-inter text-[10px] text-muted-foreground sm:text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-8 rounded-full bg-safari-500" />
                <span>Peak viewing window</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-slate-200" />
                <span>Off-peak</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-safari-500" />
                <span>Current month</span>
              </div>
            </div>

            <p className="mt-4 font-inter text-[10px] italic leading-4 text-slate-500 sm:text-xs sm:leading-5">
              Wildlife sightings can never be 100% guaranteed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onBook('Private 4×4 Driver')}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-ocean-700 px-3.5 py-2.5 font-poppins text-[10px] font-semibold text-ocean-700 hover:bg-ocean-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 sm:px-4 sm:py-3 sm:text-xs"
          >
            <CarFront className="h-3.5 w-3.5" />
            Plan your transfer
          </button>
        </div>

        <div className="relative min-h-0 overflow-hidden">
          <Image
            src="/images/gallery/safari-wildebeest.png"
            alt="Wildebeest during a Kenyan safari"
            fill
            sizes="(max-width: 767px) 55vw, (max-width: 1279px) 38vw, 35vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5" />
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
  return (
    <section className="bg-sand-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:gap-16">
        <div className="self-start lg:sticky lg:top-[90px]">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sand-300 bg-white px-3 py-1.5 font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-ocean-700 sm:text-xs">
              <MapPin className="h-3.5 w-3.5 text-safari-500" />
              Kenya transfers
            </div>
            <h1 className="font-poppins text-4xl font-bold leading-[1.02] text-ocean-700 sm:text-5xl lg:text-6xl">
              Move smoothly.
              <span className="mt-1 block text-safari-500">Explore further.</span>
            </h1>
            <p className="mt-5 max-w-lg font-inter text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Private airport and safari transfers from Malindi, Mombasa and Nairobi, arranged around your itinerary.
            </p>
          </div>
        </div>

        <div className="relative min-h-[1550px]">
          {TRANSFER_CARDS.map((card, index) => (
            <StackingCard key={card.code} card={card} index={index} onBook={onBook} />
          ))}
          <PeakViewingCard onBook={onBook} index={TRANSFER_CARDS.length} />
        </div>
      </div>
    </section>
  );
}
