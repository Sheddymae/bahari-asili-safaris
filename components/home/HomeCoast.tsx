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
    fetch('/api/excursions').then((r) => r.json()).then((data) => { if (active && data?.success && Array.isArray(data.excursions) && data.excursions.length) setAvailable(data.excursions as Excursion[]); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const byId = new Map(available.map((e) => [e.id, e]));
  const featured = [...FEATURED_IDS.map((id) => byId.get(id)).filter((e): e is Excursion => Boolean(e)), ...available.filter((e) => !FEATURED_IDS.includes(e.id))].slice(0, 4);

  return (
    <section aria-labelledby="home-coast-title" className="bg-sand-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <p className="editorial-label text-ocean-600">{c.coast.kicker}</p>
              <span className="editorial-rule flex-1" aria-hidden="true" />
            </div>
            <h2 id="home-coast-title" className="max-w-3xl font-editorial text-5xl leading-[0.94] tracking-tight text-ink sm:text-6xl lg:text-7xl">{c.coast.title}</h2>
          </div>
          <div className="lg:pt-10">
            <p className="max-w-md font-grotesk text-base leading-7 text-ink-soft">{c.coast.sub}</p>
            <Link href="/excursions" className="mt-5 inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.15em] text-ocean-700 hover:text-orange-600">
              {c.coast.seeAll}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {featured.slice(0, 3).map((excursion, index) => (
            <Link key={excursion.id} href={'/excursions/' + excursion.id} className={'group ' + (index === 0 ? 'lg:col-span-7' : 'lg:col-span-5')}>
              <div className={'relative overflow-hidden ' + (index === 0 ? 'h-[26rem] sm:h-[34rem]' : 'h-64 sm:h-72')}>
                <Image src={excursion.image} alt="" fill sizes={index === 0 ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'} className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
              </div>
              <div className="flex items-start justify-between gap-5 border-b border-line pt-4 pb-5">
                <div>
                  <p className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-muted">0{index + 1} / {excursion.duration}</p>
                  <h3 className="mt-2 font-editorial text-2xl leading-tight text-ink">{locale === 'it' ? excursion.nameIt : excursion.name}</h3>
                </div>
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ocean-700" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <Link href="/transfers" className="group mt-12 grid gap-5 border-y border-line py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-offset-2">
          <span className="flex h-10 w-10 items-center justify-center border border-ocean-600 text-ocean-700"><Plane className="h-4 w-4" aria-hidden="true" /></span>
          <span>
            <span className="block font-mono-editorial text-[9px] uppercase tracking-[0.15em] text-muted">Transfers</span>
            <span className="mt-1 block font-editorial text-2xl text-ink">{c.coast.transfersTitle}</span>
            <span className="mt-1 block font-grotesk text-sm text-ink-soft">{c.coast.transfersBody}</span>
          </span>
          <span className="inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.15em] text-ocean-700 group-hover:text-orange-600">{c.coast.seeTransfers}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </Link>
      </div>
    </section>
  );
}
