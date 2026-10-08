'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { trackConversion } from '@/components/Analytics';
import { getLocalizedSafari } from '@/lib/safari-content-i18n';
import SectionHeader from './SectionHeader';
import { useHomeCopy } from './useHomeCopy';
import { useSafariCatalogue } from './useSafariCatalogue';

export default function HomePopularSafaris({ onBook }: { onBook: (name?: string) => void }) {
  const { c, locale, unit } = useHomeCopy();
  const { safaris, safariLocale } = useSafariCatalogue(locale);
  const featured = useMemo(() => {
    const popular = safaris.filter((s) => s.popular && s.category !== 'long');
    const rest = safaris.filter((s) => !s.popular && s.category !== 'long');
    return [...popular, ...rest].slice(0, 4);
  }, [safaris]);
  return (
    <section id="tours" aria-labelledby="home-popular-title" className="bg-sand-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader kicker={c.popular.kicker} title={c.popular.title} sub={c.popular.sub} />
          <Link href="/tours" className="mb-10 inline-flex shrink-0 items-center gap-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{c.popular.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></Link>
        </div>
        <span id="home-popular-title" className="sr-only">{c.popular.title}</span>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((safari) => {
            const s = getLocalizedSafari(safari, safariLocale);
            return (
              <article key={safari.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card">
                <Link href={`/safaris/${safari.id}`} className="relative block h-44 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-inset">
                  <Image src={safari.image} alt={s.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sand-50 px-3 py-1 font-inter text-xs font-semibold text-ocean-700"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{unit(safari.days, safari.days === 1 ? c.units.day : c.units.days)}{safari.nights > 0 && <> / {unit(safari.nights, safari.nights === 1 ? c.units.night : c.units.nights)}</>}</span>
                  <h3 className="mt-3 font-poppins text-base font-bold leading-snug text-foreground">{s.name}</h3>
                  <p className="mt-1 font-inter text-xs text-muted-foreground">{safari.parks.slice(0, 3).join(' · ')}</p>
                  <div className="mt-auto flex flex-col gap-1 pt-4">
                    <Link href={`/safaris/${safari.id}`} className="inline-flex items-center justify-center rounded-lg bg-ocean-700 px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-ocean-800">{c.popular.viewSafari}</Link>
                    <button type="button" onClick={() => { trackConversion('booking_started', { location: 'popular_safari' }); onBook(s.name); }} className="rounded-lg px-4 py-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{c.popular.requestItinerary}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
