'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Plane } from 'lucide-react';
import { excursions, type Excursion } from '@/lib/tours-data';
import { useHomeCopy } from './useHomeCopy';

const FEATURED_IDS = ['safari-blu-mida', 'dolphin-turtle-swim', 'malindi-tour', 'gede-ruins'];
const STATIC_AVAILABLE = excursions.filter((e) => !e.id.startsWith('safari-blu-'));

export default function HomeCoast() {
  const { c, locale } = useHomeCopy();
  const [available, setAvailable] = useState<Excursion[]>(STATIC_AVAILABLE);

  useEffect(() => {
    let active = true;
    fetch('/api/excursions').then((r) => r.json()).then((data) => {
      if (active && data?.success && Array.isArray(data.excursions) && data.excursions.length) setAvailable(data.excursions as Excursion[]);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const byId = new Map(available.map((e) => [e.id, e]));
  const featured = [...FEATURED_IDS.map((id) => byId.get(id)).filter((e): e is Excursion => Boolean(e)), ...available.filter((e) => !FEATURED_IDS.includes(e.id))].slice(0, 4);

  return (
    <section aria-labelledby="home-coast-title" className="relative overflow-hidden bg-ocean-deep py-24 text-paper sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-coral/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="mb-7 flex items-center gap-4"><p className="editorial-label text-coral">{c.coast.kicker}</p><span className="h-px flex-1 bg-white/15" aria-hidden="true" /></div>
            <h2 id="home-coast-title" className="max-w-4xl font-editorial text-5xl leading-[0.88] tracking-[-0.025em] text-paper sm:text-6xl lg:text-8xl">{c.coast.title}</h2>
          </div>
          <div className="lg:pt-10">
            <p className="max-w-md font-grotesk text-base leading-7 text-white/70">{c.coast.sub}</p>
            <Link href="/excursions" className="mt-6 inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.17em] text-coral hover:text-white">{c.coast.seeAll}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 lg:grid-cols-12">
          {featured.map((excursion, index) => {
            const isLead = index === 0;
            const isSecond = index === 1;
            const isFourth = index === 3;
            return (
              <Link key={excursion.id} href={'/excursions/' + excursion.id} className={'group block ' + (isLead ? 'lg:col-span-7' : isFourth ? 'lg:col-span-7 lg:col-start-6' : 'lg:col-span-5')}>
                <div className={'relative overflow-hidden bg-ocean ' + (isLead ? 'h-[29rem] sm:h-[38rem]' : isSecond ? 'h-72 sm:h-80' : 'h-64 sm:h-72')}>
                  <Image src={excursion.image} alt="" fill sizes={isLead ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'} className="object-cover transition duration-1000 ease-out group-hover:scale-[1.045]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/75 via-transparent to-transparent" />
                  {isLead && <span className="absolute left-4 top-4 border border-white/35 bg-ocean-deep/35 px-2 py-1 font-mono-editorial text-[8px] uppercase tracking-[0.15em] text-white backdrop-blur-md">Indian Ocean / Watamu</span>}
                </div>
                <div className="flex items-start justify-between gap-5 border-b border-white/15 pt-5 pb-6">
                  <div><p className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/45">0{index + 1} / {excursion.duration}</p><h3 className="mt-2 font-editorial text-2xl leading-tight text-paper sm:text-3xl">{locale === 'it' ? excursion.nameIt : excursion.name}</h3></div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-coral transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>

        <Link href="/transfers" className="group mt-16 grid gap-5 border-y border-white/15 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <span className="flex h-10 w-10 items-center justify-center border border-coral text-coral transition-colors group-hover:bg-coral group-hover:text-white"><Plane className="h-4 w-4" aria-hidden="true" /></span>
          <span><span className="block font-mono-editorial text-[9px] uppercase tracking-[0.15em] text-white/45">Transfers</span><span className="mt-1 block font-editorial text-2xl text-paper">{c.coast.transfersTitle}</span><span className="mt-1 block font-grotesk text-sm text-white/65">{c.coast.transfersBody}</span></span>
          <span className="inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.15em] text-coral group-hover:text-white">{c.coast.seeTransfers}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </Link>
      </div>
    </section>
  );
}
