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
    <section id="tours" aria-labelledby="home-popular-title" className="bg-paper py-24 lg:py-36">
      <div className="editorial-shell">
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader kicker={c.popular.kicker} title={c.popular.title} sub={c.popular.sub} />
          <Link href="/tours" className="mb-10 inline-flex shrink-0 items-center gap-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{c.popular.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></Link>
        </div>
        <span id="home-popular-title" className="sr-only">{c.popular.title}</span>
        <div className="editorial-grid">
          {featured.map((safari, index) => {
            const s = getLocalizedSafari(safari, safariLocale);
            return (
              <article key={safari.id} className={`group col-span-12 flex flex-col overflow-hidden border-t border-black/20 pt-4 sm:col-span-6 ${index % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:mt-24"}`}>
                <Link href={`/safaris/${safari.id}`} className="relative block h-[22rem] sm:h-[28rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-inset">
                  <Image src={safari.image} alt={s.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col py-5">
                  <span className="inline-flex w-fit items-center gap-1.5 font-mono-editorial text-[11px] uppercase tracking-[0.08em] text-ocean-700"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{unit(safari.days, safari.days === 1 ? c.units.day : c.units.days)}{safari.nights > 0 && <> / {unit(safari.nights, safari.nights === 1 ? c.units.night : c.units.nights)}</>}</span>
                  <h3 className="mt-4 font-editorial text-3xl leading-none text-foreground sm:text-4xl">{s.name}</h3>
                  <p className="mt-3 font-mono-editorial text-[11px] uppercase tracking-[0.06em] text-muted-foreground">{safari.parks.slice(0, 3).join(' · ')}</p>
                  <div className="mt-8 flex flex-row flex-wrap items-center gap-4 pt-2">
                    <Link href={`/safaris/${safari.id}`} className="inline-flex items-center justify-center rounded-sm bg-ocean-700 px-5 py-3 font-mono-editorial text-[11px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-ocean-800">{c.popular.viewSafari}</Link>
                    <button type="button" onClick={() => { trackConversion('booking_started', { location: 'popular_safari' }); onBook(s.name); }} className="border-b border-ocean-700/40 px-1 py-2 font-mono-editorial text-[11px] font-semibold uppercase tracking-[0.08em] text-ocean-700 hover:border-ocean-700">{c.popular.requestItinerary}</button>
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
