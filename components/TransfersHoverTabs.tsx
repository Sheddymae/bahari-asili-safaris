'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CarFront, Globe2, Plane } from 'lucide-react';
import PageShell from '@/components/PageShell';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

type Transfer = {
  code: 'MBA' | 'MYD' | 'NBO';
  title: string;
  subtitle: string;
  detail: string;
  image: string;
  imageAlt: string;
  bullets: string[];
  Icon: typeof Plane;
};

const TRANSFERS: Transfer[] = [
  {
    code: 'MBA',
    title: 'MBA - Mombasa Moi',
    subtitle: 'Major coastal hub',
    detail: 'Major coastal hub, 2h transfer to Watamu. Private Land Cruiser, AC, bottled water, WiFi, luggage handled. SGR train link available.',
    image: '/images/home/services-safari-jeep.jpg',
    imageAlt: 'Safari vehicle ready for a private transfer from Mombasa',
    bullets: ['Private Land Cruiser transfer to Watamu', 'Air conditioning, bottled water and WiFi', 'Luggage handling and coordinated SGR connection'],
    Icon: Plane,
  },
  {
    code: 'MYD',
    title: 'MYD - Malindi Airport',
    subtitle: 'Closest airport to Watamu',
    detail: 'Malindi Airport - Closest to Watamu, 15min transfer. VIP fast-track, private driver waiting outside arrivals.',
    image: '/images/gallery/coast-beach.png',
    imageAlt: 'Kenyan coast near Watamu and Malindi',
    bullets: ['Approximately 15-minute private transfer to Watamu', 'VIP fast-track assistance on arrival', 'Private driver waiting outside arrivals'],
    Icon: CarFront,
  },
  {
    code: 'NBO',
    title: 'NBO - Nairobi JKIA',
    subtitle: 'International gateway',
    detail: 'Jomo Kenyatta Nairobi - International gateway, domestic flight to Masai Mara, overnight hotel option, meet & greet inside terminal.',
    image: '/images/safaris/safari-4day-naivasha-nakuru-mara.jpg',
    imageAlt: 'Kenyan safari landscape connected from Nairobi',
    bullets: ['International arrival meet & greet inside the terminal', 'Domestic flight connection toward Masai Mara', 'Optional Nairobi overnight hotel coordination'],
    Icon: Globe2,
  },
];

function TransferTab({
  transfer,
  index,
  active,
  reducedMotion,
  onActivate,
  onReset,
  onRequest,
}: {
  transfer: Transfer;
  index: number;
  active: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onReset: () => void;
  onRequest: () => void;
}) {
  const Icon = transfer.Icon;
  return (
    <motion.article
      layout
      onMouseEnter={onActivate}
      onMouseLeave={onReset}
      onClick={onActivate}
      animate={reducedMotion ? undefined : { y: active ? -12 : 0, scale: active ? 1.02 : 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'relative w-full cursor-pointer overflow-hidden border border-gray-200 bg-white p-0 text-center',
        'transition-[border-color,box-shadow,transform] duration-300',
        index === 0 ? 'rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none' : '',
        index === 2 ? 'rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none' : '',
        index === 1 ? 'rounded-none' : '',
        active ? 'z-10 border-orange-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]' : 'z-0',
      ].join(' ')}
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={transfer.title}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate();
        }
      }}
    >
      <div className={['flex h-32 items-center justify-center bg-gradient-to-b transition-colors duration-300', active ? 'from-[#0E5F6B] to-[#0E5F6B] text-white' : 'from-gray-50 to-gray-100 text-gray-400'].join(' ')}>
        <Icon className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <div className="px-6 py-7">
        <span className="font-inter text-[10px] font-black tracking-[0.18em] text-[#FF7A18]">{transfer.code}</span>
        <h2 className="mt-2 font-poppins text-lg font-bold text-slate-900">{transfer.title}</h2>
        <p className="mt-1 font-inter text-sm text-slate-500">{transfer.subtitle}</p>
        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, height: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.28 }}
              className="overflow-hidden"
            >
              <p className="pt-5 font-inter text-xs leading-5 text-slate-600">{transfer.detail}</p>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); onRequest(); }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0E5F6B] px-5 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0E5F6B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
              >
                Request your transfer <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {!active && <p className="mt-5 font-inter text-xs text-gray-400">Private transfer service</p>}
      </div>
    </motion.article>
  );
}

export default function TransfersHoverTabs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState('');
  const reducedMotion = useReducedMotion();
  const activeTransfer = TRANSFERS[activeIndex ?? 0];

  const openBooking = (transfer: Transfer) => {
    setSelectedTransfer(`Airport Transfer – ${transfer.code}`);
    setIsBookingOpen(true);
  };

  return (
    <PageShell>
      <section className="bg-[#FFFBEB]/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-inter text-xs font-black tracking-[0.2em] text-[#FF7A18]">TRANSFERS &amp; SERVICES</p>
            <h1 className="mt-3 font-poppins text-4xl font-black leading-tight text-[#0E5F6B] sm:text-5xl">Seamless Transfers Included</h1>
            <p className="mx-auto mt-4 max-w-2xl font-inter text-sm leading-6 text-slate-600 sm:text-base">Private drivers, AC vehicles, meet &amp; greet at MYD MBA NBO</p>
          </header>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-0 md:grid-cols-3" aria-label="Transfer options">
            {TRANSFERS.map((transfer, index) => (
              <TransferTab
                key={transfer.code}
                transfer={transfer}
                index={index}
                active={activeIndex === index}
                reducedMotion={Boolean(reducedMotion)}
                onActivate={() => setActiveIndex(index)}
                onReset={() => setActiveIndex(null)}
                onRequest={() => openBooking(transfer)}
              />
            ))}
          </div>

          <section className="mt-16 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[300px] lg:min-h-[430px]">
                <Image src={activeTransfer.image} alt={activeTransfer.imageAlt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="font-inter text-xs font-black tracking-[0.18em] text-[#FF7A18]">{activeTransfer.code}</span>
                <h2 className="mt-2 font-poppins text-3xl font-black leading-tight text-[#0E5F6B]">Full transfer details</h2>
                <p className="mt-4 font-inter text-sm leading-6 text-slate-600">{activeTransfer.detail}</p>
                <ul className="mt-6 space-y-3">
                  {activeTransfer.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 font-inter text-sm leading-6 text-slate-600">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FF7A18]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openBooking(activeTransfer)}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#0E5F6B] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0E5F6B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
                >
                  Request your transfer <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
          <p className="mt-5 text-center font-inter text-xs text-slate-500 md:hidden">Tap a transfer card to expand its details.</p>
        </div>
      </section>
      {isBookingOpen && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} selectedTour={selectedTransfer} />
      )}
    </PageShell>
  );
}
