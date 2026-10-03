'use client';

import { MapPin, Compass, Users, Waves, MessageCircle, Languages } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useHomeCopy } from './useHomeCopy';

const ICONS = [MapPin, Compass, Users, Waves, MessageCircle, Languages];

export default function HomeWhy() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-why-title" className="bg-paper py-28 lg:py-40">
      <div className="editorial-shell">
        <SectionHeader kicker={c.why.kicker} title={c.why.title} />
        <span id="home-why-title" className="sr-only">{c.why.title}</span>
        <div className="mt-20 grid grid-cols-12 gap-0">
          {c.why.items.map((item, i) => { const Icon = ICONS[i]; return <div key={item.title} className="col-span-12 border-t border-black/15 py-7 sm:col-span-6 lg:col-span-4"><div className="mb-5 font-mono-editorial text-[11px] uppercase tracking-[0.08em] text-ocean-700">0{i + 1}</div><div className="flex items-start gap-4"><span className="mt-1 shrink-0 text-sun"><Icon className="h-4 w-4" aria-hidden="true" /></span><div><h3 className="font-editorial text-2xl text-foreground">{item.title}</h3><p className="mt-2 max-w-sm font-grotesk text-sm leading-6 text-muted-foreground">{item.body}</p></div></div>; })}
        </div>
      </div>
    </section>
  );
}
