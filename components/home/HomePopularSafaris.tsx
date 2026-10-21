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
    <section id="tours" aria-labelledby="home-popular-title" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-[var(--brand-border)] pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
          <SectionHeader kicker={c.popular.kicker} title={c.popular.title} sub={c.popular.sub} />
          <Link href="/tours" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-inter text-sm font-bold text-[var(--brand-primary-deep)] underline decoration-[var(--brand-secondary)] decoration-2 underline-offset-4 hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]">
            {c.popular.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
        <span id="home-popular-title" className="sr-only">{c.popular.title}</span>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((safari, index) => {
            const s = getLocalizedSafari(safari, safariLocale);
            return (
              <article key={safari.id} className="group flex min-w-0 flex-col overflow-hidden border border-[var(--brand-border)] bg-white transition-shadow duration-200 hover:shadow-[var(--shadow-lg)]">
                <Link href={`/safaris/${safari.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--brand-sand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] focus-visible:ring-inset" aria-label={s.name}>
                  <Image src={safari.image} alt={s.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 font-inter text-xs font-bold text-[var(--brand-primary-deep)] shadow-sm">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />{unit(safari.days, safari.days === 1 ? c.units.day : c.units.days)}{safari.nights > 0 && <> / {unit(safari.nights, safari.nights === 1 ? c.units.night : c.units.nights)}</>}
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-[var(--brand-secondary)] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-primary-deep)]">{String(index + 1).padStart(2, '0')} / {c.popular.kicker}</span>
                  <h3 className="mt-2 font-poppins text-base font-bold leading-snug text-[var(--brand-text)]">{s.name}</h3>
                  <p className="mt-2 min-h-10 font-inter text-xs leading-5 text-[var(--brand-text-muted)]">{safari.parks.slice(0, 3).join(' · ')}</p>
                  <div className="mt-auto flex flex-col gap-1 border-t border-[var(--brand-border)] pt-4">
                    <Link href={`/safaris/${safari.id}`} className="inline-flex min-h-11 items-center justify-between gap-2 bg-[var(--brand-primary-deep)] px-4 py-2.5 font-inter text-sm font-bold text-white transition-colors hover:bg-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] focus-visible:ring-offset-2">
                      {c.popular.viewSafari}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                    <button type="button" onClick={() => { trackConversion('booking_started', { location: 'popular_safari' }); onBook(s.name); }} className="inline-flex min-h-10 items-center justify-center px-3 py-2 font-inter text-sm font-semibold text-[var(--brand-primary-deep)] underline decoration-[var(--brand-secondary)] underline-offset-4 hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]">
                      {c.popular.requestItinerary}
                    </button>
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
