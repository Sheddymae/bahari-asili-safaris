'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plane } from 'lucide-react';
import { excursions, type Excursion } from '@/lib/tours-data';
import SectionHeader from './SectionHeader';
import { useHomeCopy } from './useHomeCopy';

const FEATURED_IDS = ['safari-blu-mida', 'dolphin-turtle-swim', 'malindi-tour', 'gede-ruins'];
const STATIC_AVAILABLE = excursions.filter((e) => !e.id.startsWith('safari-blu-'));

export default function HomeCoast() {
  const { c, locale } = useHomeCopy();
  const [available, setAvailable] = useState<Excursion[]>(STATIC_AVAILABLE);
  useEffect(() => {
    let active = true;
    fetch('/api/excursions').then((r) => r.json()).then((data) => { if (active && data?.success && Array.isArray(data.excursions) && data.excursions.length) setAvailable(data.excursions as Excursion[]); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const byId = new Map(available.map((e) => [e.id, e]));
  const featured = [...FEATURED_IDS.map((id) => byId.get(id)).filter((e): e is Excursion => Boolean(e)), ...available.filter((e) => !FEATURED_IDS.includes(e.id))].slice(0, 4);
  return (
    <section aria-labelledby="home-coast-title" className="bg-sand-50 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeader kicker={c.coast.kicker} title={c.coast.title} sub={c.coast.sub} />
          <Link href="/excursions" className="mb-0 inline-flex min-h-11 w-fit shrink-0 items-center gap-2 font-inter text-sm font-semibold text-ocean-700 underline decoration-[var(--brand-secondary)] decoration-2 underline-offset-4 hover:text-ocean-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">
            {c.coast.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
        <span id="home-coast-title" className="sr-only">{c.coast.title}</span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {featured.map((excursion) => (
            <Link key={excursion.id} href={`/excursions/${excursion.id}`} className="group flex min-w-0 flex-col overflow-hidden border border-border bg-white transition-shadow duration-200 hover:shadow-[var(--shadow-lg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
                <Image src={excursion.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-poppins text-sm font-bold leading-snug text-foreground">{locale === 'it' ? excursion.nameIt : excursion.name}</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{excursion.duration}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-inter text-sm font-semibold text-ocean-700">{c.coast.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/transfers" className="mt-5 flex min-w-0 items-center gap-3 border border-border bg-white p-4 transition-colors hover:border-ocean-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 sm:gap-4 sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-ocean-700 text-white"><Plane className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block font-poppins text-sm font-bold text-foreground">{c.coast.transfersTitle}</span><span className="mt-1 block break-words font-inter text-sm leading-6 text-muted-foreground">{c.coast.transfersBody}</span></span>
          <span className="hidden shrink-0 items-center gap-2 font-inter text-sm font-semibold text-ocean-700 sm:inline-flex">{c.coast.seeTransfers} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></span>
        </Link>
      </div>
    </section>
  );
}
