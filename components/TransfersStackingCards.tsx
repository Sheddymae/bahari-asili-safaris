'use client';

import Image from 'next/image';
import { ArrowUpRight, CarFront, MapPin, Plane } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type TransferCard = {
  eyebrow: string;
  code: string;
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
    description: 'Start your Watamu stay with a private transfer from the nearest airport to the coast.',
    image: '/images/gallery/coast-beach.png',
    imageAlt: 'Kenyan coastline close to Watamu',
    action: 'Request MYD transfer',
    actionValue: 'Airport Transfer – MYD (Malindi)',
  },
  {
    eyebrow: 'Coastal gateway',
    code: 'MBA',
    title: 'Mombasa Moi Airport',
    description: 'Arrange a road transfer between Mombasa and Watamu around your arrival and accommodation plans.',
    image: '/images/home/services-safari-jeep.jpg',
    imageAlt: 'Vehicle ready for a private Kenyan coast transfer',
    action: 'Request MBA transfer',
    actionValue: 'Airport Transfer – MBA (Mombasa)',
  },
  {
    eyebrow: 'International gateway',
    code: 'NBO',
    title: 'Nairobi JKIA',
    description: 'Plan a connection from Nairobi to the coast, with your preferred route and timing confirmed in advance.',
    image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg',
    imageAlt: 'Kenyan landscape along a safari route',
    action: 'Request NBO transfer',
    actionValue: 'Airport Transfer – NBO (Nairobi)',
  },
  {
    eyebrow: 'Southern coast',
    code: 'UKD',
    title: 'Diani and Ukunda',
    description: 'Request transfers for Ukunda Airstrip and connections between Diani, Mombasa and other coastal stays.',
    image: '/images/gallery/coast-beach.png',
    imageAlt: 'Beach along the Kenyan coast near Diani',
    action: 'Request Diani transfer',
    actionValue: 'Diani / Ukunda Transfer',
  },
];

function TransferCardView({
  card,
  onBook,
}: {
  card: TransferCard;
  onBook: (value: string) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-24px_rgba(31,41,55,0.38)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-24px_rgba(22,125,149,0.42)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/10" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-slate-950/35 px-3 py-1.5 font-poppins text-xs font-bold tracking-[0.12em] text-white backdrop-blur-sm">
          <Plane className="h-3.5 w-3.5" aria-hidden="true" />
          {card.code}
        </span>
        <span className="absolute bottom-4 left-4 font-inter text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
          {card.eyebrow}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-poppins text-xl font-bold leading-tight text-[var(--brand-primary-deep)] sm:text-2xl">
          {card.title}
        </h2>
        <p className="mt-3 flex-1 font-inter text-sm leading-6 text-slate-600">
          {card.description}
        </p>
        <button
          type="button"
          onClick={() => onBook(card.actionValue)}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-3 font-poppins text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-primary-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)] focus-visible:ring-offset-2"
        >
          {card.action}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function TransfersStackingCards({
  onBook,
}: {
  onBook: (value: string) => void;
}) {
  const { t } = useLanguage();
  const tr = t.transfers;

  return (
    <section className="relative isolate overflow-hidden bg-[var(--brand-sand)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,125,149,0.18),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/20 bg-white/75 px-4 py-2 font-poppins text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand-primary-deep)] sm:text-xs">
            <MapPin className="h-4 w-4 text-[var(--brand-secondary)]" aria-hidden="true" />
            {tr.label}
          </span>

          <h1 className="mt-5 font-poppins text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--brand-primary-deep)] sm:text-5xl lg:text-6xl">
            {tr.title}
            <span className="mt-2 block text-[var(--brand-secondary)]">{tr.titleHighlight}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {tr.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {TRANSFER_CARDS.map((card) => (
              <span
                key={card.code}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 font-inter text-xs font-semibold text-slate-700 shadow-sm sm:text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]" aria-hidden="true" />
                {card.code}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {TRANSFER_CARDS.map((card) => (
            <TransferCardView key={card.code} card={card} onBook={onBook} />
          ))}
        </div>

        <aside className="mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--brand-primary)]/15 bg-white/75 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
              <CarFront className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-poppins text-base font-bold text-[var(--brand-primary-deep)] sm:text-lg">
                Need a different route?
              </h2>
              <p className="mt-1 max-w-2xl font-inter text-sm leading-6 text-slate-600">
                Send your arrival airport, travel date, passenger count and destination. We’ll confirm the route and availability with you.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onBook('Private transfer – custom route')}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--brand-primary)] px-5 py-3 font-poppins text-sm font-semibold text-[var(--brand-primary-deep)] transition-colors hover:bg-[var(--brand-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)] focus-visible:ring-offset-2"
          >
            Plan a transfer
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </aside>
      </div>
    </section>
  );
}
