'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { excursions } from '@/lib/tours-data';
import { getLocalizedExcursion, type SupportedLocale } from '@/lib/excursion-content-i18n';

type ExcursionsVariant = 'home' | 'full';
const WHATSAPP_NUMBER = '254101923355';
const whatsappHref = (name: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Bahari Asili, I'm interested in the ${name}. Please send me more details.`)}`;

export default function ExcursionsSection({ onBook, variant = 'full' }: { onBook: (name?: string) => void; variant?: ExcursionsVariant }) {
  const { t, locale } = useLanguage();
  const [managedExcursions, setManagedExcursions] = useState(excursions);
  useEffect(() => {
    let active = true;
    fetch('/api/excursions', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (active && data?.success && Array.isArray(data.excursions) && data.excursions.length > 0) setManagedExcursions(data.excursions);
      })
      .catch(() => { /* keep static catalogue as fallback */ });
    return () => { active = false; };
  }, []);
  const homeExcursions = variant === 'home' ? [...managedExcursions.filter(exc => exc.popular), ...managedExcursions.filter(exc => !exc.popular)].slice(0, 6) : managedExcursions;
  return <section id="excursions" className={`${variant === 'home' ? 'py-16 lg:py-20' : 'py-20 lg:py-28'} bg-white`}><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12"><div><span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">{t.excursions.label}</span><h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">{t.excursions.title}{' '}<span className="text-safari-500">{t.excursions.titleHighlight}</span></h2></div><div className="flex flex-col items-start lg:items-end gap-3"><p className="font-inter text-muted-foreground text-base max-w-md lg:text-right">{t.excursions.subtitle}</p>{variant === 'home' && <Link href="/excursions" className="font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{t.nav.excursions} →</Link>}</div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">{homeExcursions.map(exc => { const localized = getLocalizedExcursion(exc, locale as SupportedLocale); return <div key={exc.id} className="tour-card bg-white border border-border rounded-2xl overflow-hidden shadow-card flex flex-col group">
      <div className={`relative ${variant === 'home' ? 'h-44' : 'h-48'} overflow-hidden`}><Link href={`/excursions/${exc.id}`} aria-label={`${t.excursions.viewExcursion}: ${localized.name}`} prefetch><Image src={exc.image} alt={localized.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /></Link><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" /><div className="absolute bottom-3 left-3 right-3 pointer-events-none"><h3 className="font-poppins font-bold text-white text-base leading-snug">{localized.name}</h3></div><div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1"><Clock className="w-3 h-3 text-safari-500" /><span className="font-inter text-xs font-semibold text-foreground">{localized.duration}</span></div>{exc.popular && <div className="absolute top-3 left-3 bg-safari-500 rounded-full px-3 py-1 shadow-sm"><span className="font-inter font-bold text-[10px] tracking-wide uppercase text-white">{t.excursions.popular}</span></div>}</div>
      <div className="p-5 flex flex-col flex-1"><p className="font-inter text-muted-foreground text-sm leading-relaxed mb-4">{localized.description}</p>{variant === 'full' && <div className="flex flex-wrap gap-1.5 mb-4">{localized.highlights.map((h, i) => <span key={i} className="bg-sand-50 text-foreground font-inter text-xs px-2.5 py-0.5 rounded-full border border-sand-200">{h}</span>)}</div>}
        <div className="mt-auto grid grid-cols-2 gap-2"><Link href={`/excursions/${exc.id}`} prefetch className="w-full inline-flex items-center justify-center gap-1.5 border border-border hover:border-safari-400 text-foreground hover:text-safari-700 font-poppins font-semibold text-xs sm:text-sm py-3 rounded-xl">{t.excursions.viewExcursion}<ArrowRight className="w-3.5 h-3.5" /></Link><button type="button" onClick={() => onBook(localized.name)} className="w-full flex items-center justify-center gap-1.5 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-xs sm:text-sm py-3 rounded-xl">{t.excursions.bookNow}<ChevronRight className="w-4 h-4" /></button></div>
        <a href={whatsappHref(localized.name)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center justify-center gap-1.5 text-[#168f45] text-xs font-semibold py-2"><MessageCircle className="w-3.5 h-3.5" />WhatsApp about this excursion</a>
      </div>
    </div>; })}</div>
    {variant === 'home' && <div className="mt-8 text-center"><Link href="/excursions" className="inline-flex items-center font-poppins font-semibold text-sm text-ocean-700 hover:text-ocean-800">{t.nav.excursions} →</Link></div>}
  </div></section>;
}
