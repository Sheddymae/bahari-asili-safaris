'use client';

import Link from 'next/link';
import { Plane, UserRound, Car, Clock, Ticket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Reveal from '@/components/Reveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type TransfersVariant = 'home' | 'full';

interface TransfersSectionProps {
  onBook: (transferType: string) => void;
  variant?: TransfersVariant;
}

interface AirportOption {
  code: string;
  name: string;
  blurbEn: string;
  blurbIt: string;
  bookingValue: string;
  featured?: boolean;
}

const AIRPORTS: AirportOption[] = [
  { code: 'MYD', name: 'Malindi Airport', blurbEn: 'Closest airport to Watamu — 30 min transfer', blurbIt: "Aeroporto più vicino a Watamu — 30 min di trasferimento", bookingValue: 'Airport Transfer – MYD (Malindi)', featured: true },
  { code: 'MBA', name: 'Mombasa Moi Airport', blurbEn: 'Major coastal hub — 2h transfer to Watamu', blurbIt: 'Principale hub costiero — 2h di trasferimento a Watamu', bookingValue: 'Airport Transfer – MBA (Mombasa)' },
  { code: 'NBO', name: 'Nairobi JKIA', blurbEn: 'International gateway — flight + transfer arranged', blurbIt: 'Porta internazionale — volo + trasferimento organizzati', bookingValue: 'Airport Transfer – NBO (Nairobi)' },
];

const SERVICES = [
  { icon: UserRound, titleEn: 'Meet & Greet', titleIt: 'Accoglienza', descEn: 'Name board, porter, fast track', descIt: 'Cartello con nome, facchino, corsia rapida' },
  { icon: Car, titleEn: 'Private 4×4 Driver', titleIt: 'Autista privato 4×4', descEn: 'Air-conditioned vehicle', descIt: 'Veicolo climatizzato' },
  { icon: Clock, titleEn: '24/24 Assistance', titleIt: 'Assistenza 24/24', descEn: 'Italian, English, French — always', descIt: 'Italiano, Inglese, Francese — sempre' },
  { icon: Ticket, titleEn: 'Tickets & Permits', titleIt: 'Biglietti e permessi', descEn: 'All park entry fees, marine reserve permits handled', descIt: "Tutti gli ingressi ai parchi e i permessi della riserva marina inclusi" },
];

export default function TransfersSection({ onBook, variant = 'full' }: TransfersSectionProps) {
  const { t } = useLanguage();
  const tr = t.transfers;
  const airportsRef = useScrollReveal<HTMLDivElement>({ itemSelector: '[data-reveal-item]', y: 24 });
  const servicesRef = useScrollReveal<HTMLDivElement>({ itemSelector: '[data-reveal-item]', y: 20, start: 'top 85%' });

  if (variant === 'home') {
    return (
      <section id="transfers" className="bg-white py-14 lg:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 rounded-2xl border border-border bg-sand-50 px-5 py-5 sm:px-7">
            <div className="flex flex-wrap items-center gap-2.5">
              {AIRPORTS.map((airport) => <span key={airport.code} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-sand-200 px-3 py-1.5 font-poppins text-xs font-bold text-ocean-700"><Plane className="h-3.5 w-3.5 text-safari-500" />{airport.code}</span>)}
              <p className="font-inter text-sm text-foreground/80 sm:ml-1">{tr.subtitle}</p>
            </div>
            <Link href="/transfers" className="shrink-0 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{t.nav.transfers} →</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="transfers" className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12"><p className="font-inter text-xs font-semibold tracking-[0.15em] text-safari-500 uppercase mb-3">{tr.label}</p><h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground mb-4">{tr.title} <span className="text-safari-500">{tr.titleHighlight}</span></h2><p className="font-inter text-muted-foreground">{tr.subtitle}</p></Reveal>
        <div ref={airportsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {AIRPORTS.map((airport) => <button key={airport.code} type="button" data-reveal-item onClick={() => onBook(airport.bookingValue)} aria-label={`${t.common.bookNow}: ${airport.name}`} className={`text-left rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 ${airport.featured ? 'bg-ocean-700 text-white' : 'bg-white border border-border text-foreground'}`}><div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${airport.featured ? 'bg-white/15' : 'bg-safari-50'}`}><Plane className={`w-5 h-5 ${airport.featured ? 'text-white' : 'text-ocean-600'}`} /></div><p className="font-poppins font-extrabold text-2xl mb-1">{airport.code}</p><p className={`font-poppins font-semibold text-base mb-2 ${airport.featured ? 'text-white' : 'text-foreground'}`}>{airport.name}</p><p className={`font-inter text-sm ${airport.featured ? 'text-ocean-100' : 'text-muted-foreground'}`}>{tr.airports.find((a: any) => a.code === airport.code)?.desc || airport.blurbEn}</p></button>)}
        </div>
        <div ref={servicesRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {SERVICES.map((service) => { const Icon = service.icon; return <div key={service.titleEn} data-reveal-item className="rounded-3xl border border-border bg-white p-5"><div className="w-10 h-10 rounded-xl bg-safari-50 flex items-center justify-center mb-4"><Icon className="w-4 h-4 text-safari-500" /></div><p className="font-poppins font-semibold text-sm text-foreground mb-1">{tr.services.find((x: any) => x.title === service.titleEn)?.title || service.titleEn}</p><p className="font-inter text-xs text-muted-foreground">{tr.services.find((x: any) => x.title === service.titleEn)?.desc || service.descEn}</p></div>; })}
        </div>
        <Reveal delay={0.1} className="text-center mt-10"><button type="button" onClick={() => onBook('Private 4×4 Driver')} className="font-poppins font-semibold text-sm text-white bg-safari-500 hover:bg-safari-600 px-6 py-3 rounded-xl transition-all hover:shadow-md">{tr.cta}</button></Reveal>
      </div>
    </section>
  );
}
