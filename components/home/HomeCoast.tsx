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
    <section aria-labelledby="home-coast-title" className="bg-sand-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><SectionHeader kicker={c.coast.kicker} title={c.coast.title} sub={c.coast.sub} /><Link href="/excursions" className="mb-10 inline-flex shrink-0 items-center gap-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{c.coast.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link></div>
        <span id="home-coast-title" className="sr-only">{c.coast.title}</span>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((excursion) => <Link key={excursion.id} href={`/excursions/${excursion.id}`} className="group overflow-hidden rounded-xl border border-border bg-white shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600"><div className="relative h-40"><Image src={excursion.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-4"><h3 className="font-poppins text-sm font-bold leading-snug text-foreground">{locale === 'it' ? excursion.nameIt : excursion.name}</h3><p className="mt-1 font-inter text-xs text-muted-foreground">{excursion.duration}</p></div></Link>)}</div>
        <Link href="/transfers" className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-card hover:border-ocean-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ocean-700 text-white"><Plane className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-poppins text-sm font-bold text-foreground">{c.coast.transfersTitle}</span><span className="block font-inter text-sm text-muted-foreground">{c.coast.transfersBody}</span></span><span className="hidden items-center gap-2 font-inter text-sm font-semibold text-ocean-700 sm:inline-flex">{c.coast.seeTransfers} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></span></Link>
      </div>
    </section>
  );
}
