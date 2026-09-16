'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, Star, ChevronDown, ChevronUp, Check, X, Backpack, Building2, Sun, Sunset, MoonStar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { safaris } from '@/lib/safari-catalogue';
import type { Safari, SafariTab } from '@/lib/tours-data';
import { DEFAULT_INCLUDED, DEFAULT_EXCLUDED, getPriceTier } from '@/lib/tours-data';
import { getLocalizedSafari, type SafariLocale } from '@/lib/safari-content-i18n';

type TabKey = SafariTab | 'multiday';
const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'tsavo', label: 'Tsavo', emoji: '🐘' },
  { key: 'amboseli', label: 'Amboseli', emoji: '🏔️' },
  { key: 'mara', label: 'Masai Mara', emoji: '🦁' },
  { key: 'taita', label: 'Taita Hills', emoji: '🦅' },
  { key: 'multiday', label: 'Multi-day', emoji: '🗺️' },
];

function SafariCard({ safari, t, locale, onBook }: { safari: Safari; t: any; locale: SafariLocale; onBook: (name: string) => void }) {
  const [open, setOpen] = useState<'itinerary' | 'packing' | 'included' | null>(null);
  const s = getLocalizedSafari(safari, locale);
  const tier = getPriceTier(safari);
  const toggle = (key: 'itinerary' | 'packing' | 'included') => setOpen(value => value === key ? null : key);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-card border border-border flex flex-col h-full">
      <div className="relative h-52">
        <Image src={safari.image} alt={s.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {safari.popular && <span className="absolute top-3 left-3 bg-safari-500 text-white rounded-full px-3 py-1 font-inter font-bold text-[10px] tracking-wide uppercase">{t.popular}</span>}
        <div className="absolute top-3 right-3 bg-white/95 rounded-full px-2.5 py-1 flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /><span className="font-inter font-semibold text-xs">{safari.rating}</span></div>
        <div className="absolute bottom-3 left-4 right-4"><h3 className="font-poppins font-bold text-white text-lg leading-tight">{s.name}</h3><p className="font-inter text-white/85 text-xs mt-1">{s.tagline}</p></div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-4"><span className="inline-flex items-center gap-1.5 bg-sand-50 rounded-full px-3 py-1 font-inter text-xs text-ocean-700 font-semibold"><Clock className="w-3.5 h-3.5" />{safari.days} {t.days} / {safari.nights} {t.nights}</span><span className="font-inter text-xs font-semibold text-muted-foreground uppercase">{tier === 'luxury' ? t.priceTierLuxury : tier === 'budget' ? t.priceTierBudget : t.priceTierMidRange}</span></div>

        <div className="mb-3"><div className="flex items-center gap-1.5 mb-1.5"><MapPin className="w-3.5 h-3.5 text-safari-500" /><span className="font-inter text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.parks}</span></div><div className="flex flex-wrap gap-1.5">{s.parks.map((park, i) => <span key={i} className="bg-ocean-50 text-ocean-700 font-inter text-xs px-2.5 py-0.5 rounded-full border border-ocean-100">{park}</span>)}</div></div>
        <div className="flex flex-wrap gap-1.5 mb-4">{s.highlights.slice(0, 3).map((item, i) => <span key={i} className="bg-sand-50 text-foreground font-inter text-xs px-2 py-0.5 rounded-full">{item}</span>)}</div>
        <Link href={`/safaris/${safari.id}`} className="font-inter text-xs font-semibold text-ocean-700 hover:text-ocean-800 mb-4">{t.readMore} →</Link>

        <div className="space-y-2 mb-4">
          <button type="button" onClick={() => toggle('itinerary')} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-sand-50"><span className="font-inter text-sm font-semibold">{t.itinerary}</span>{open === 'itinerary' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
          {open === 'itinerary' && <div className="space-y-3 max-h-72 overflow-y-auto">{s.itinerary.map((day, i) => <div key={i} className="border border-border rounded-xl overflow-hidden"><div className="bg-ocean-700 px-4 py-2"><span className="font-poppins font-bold text-white text-sm">{day.day}</span><span className="font-inter text-white/80 text-xs ml-2">{day.title}</span></div><div className="p-3 space-y-2"><div className="flex gap-2"><Sun className="w-4 h-4 flex-shrink-0" /><div><div className="text-xs font-semibold text-muted-foreground">{t.morning}</div><p className="text-xs leading-relaxed">{day.morning}</p></div></div><div className="flex gap-2"><Sunset className="w-4 h-4 flex-shrink-0" /><div><div className="text-xs font-semibold text-muted-foreground">{t.afternoon}</div><p className="text-xs leading-relaxed">{day.afternoon}</p></div></div><div className="flex gap-2"><MoonStar className="w-4 h-4 flex-shrink-0" /><div><div className="text-xs font-semibold text-muted-foreground">{t.overnight}</div><p className="text-xs">{day.overnight}</p></div></div></div></div>)}<div className="bg-sand-50 rounded-xl p-3"><div className="flex items-center gap-1.5 mb-2"><Building2 className="w-3.5 h-3.5" /><span className="text-xs font-semibold uppercase">{t.lodges}</span></div><div className="flex flex-wrap gap-1.5">{s.lodges.map((lodge, i) => <span key={i} className="bg-white text-xs px-2.5 py-1 rounded-lg border border-border">{lodge}</span>)}</div></div></div>}

          <button type="button" onClick={() => toggle('packing')} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-sand-50"><span className="font-inter text-sm font-semibold"><Backpack className="w-4 h-4 inline mr-1.5" />{t.packing}</span>{open === 'packing' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
          {open === 'packing' && <ul className="bg-sand-50 rounded-xl p-3 space-y-1.5">{s.packingTips.map((tip, i) => <li key={i} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /><span className="text-xs leading-relaxed">{tip}</span></li>)}</ul>}

          <button type="button" onClick={() => toggle('included')} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-sand-50"><span className="font-inter text-sm font-semibold">{t.included}</span>{open === 'included' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
          {open === 'included' && <div className="grid grid-cols-2 gap-3 bg-sand-50 rounded-xl p-3"><div><p className="text-xs font-semibold uppercase mb-2">{t.includedTitle}</p><ul className="space-y-1.5">{(s.included?.length ? s.included : DEFAULT_INCLUDED).map((item, i) => <li key={i} className="flex gap-1.5"><Check className="w-3.5 h-3.5 flex-shrink-0" /><span className="text-xs leading-relaxed">{item}</span></li>)}</ul></div><div><p className="text-xs font-semibold uppercase mb-2">{t.excludedTitle}</p><ul className="space-y-1.5">{(s.excluded?.length ? s.excluded : DEFAULT_EXCLUDED).map((item, i) => <li key={i} className="flex gap-1.5"><X className="w-3.5 h-3.5 flex-shrink-0" /><span className="text-xs leading-relaxed">{item}</span></li>)}</ul></div></div>}
        </div>
        <p className="text-xs text-muted-foreground text-center mb-3">{t.pricePerPersonNote}</p>
        <button type="button" onClick={() => onBook(s.name)} className="mt-auto w-full bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm py-3 rounded-xl">{t.bookNow}</button>
      </div>
    </article>
  );
}

export default function ToursSection({ onBook }: { onBook: (tourName?: string) => void }) {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('tsavo');
  const currentSafaris = useMemo(() => activeTab === 'multiday' ? safaris.filter(s => s.category === 'long') : safaris.filter(s => s.tabs.includes(activeTab as SafariTab) && s.category !== 'long'), [activeTab]);
  const safariLocale: SafariLocale = (['en','it','fr','es','de','ar','zh','sw'].includes(locale) ? locale : 'en') as SafariLocale;
  const tabs = (t.tours?.tabLabels ?? {}) as Record<string, string>;

  return (
    <section id="tours" className="py-24 lg:py-32 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12"><span className="font-inter text-safari-500 font-semibold text-xs tracking-widest uppercase block mb-4">{t.tours?.label}</span><h2 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">{t.tours?.packagesLabel}</h2><p className="font-inter text-muted-foreground mt-4 max-w-2xl">{t.tours?.subtitle}</p></div>
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">{TABS.map(tab => <button type="button" key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 font-inter font-semibold text-sm px-5 py-2.5 rounded-full border whitespace-nowrap flex-shrink-0 ${activeTab === tab.key ? 'bg-ocean-700 text-white border-ocean-700' : 'bg-white text-foreground border-border'}`}><span>{tab.emoji}</span><span>{tabs[tab.key] || tab.label}</span></button>)}</div>
        {currentSafaris.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{currentSafaris.map(safari => <SafariCard key={safari.id} safari={safari} t={t.tours} locale={safariLocale} onBook={onBook} />)}</div> : <div className="text-center py-16 text-muted-foreground">{t.tours?.noSafarisInCategory}</div>}
      </div>
    </section>
  );
}
