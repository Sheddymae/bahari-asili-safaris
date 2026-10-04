'use client';

import { MapPin, Compass, Users, Waves, MessageCircle, Languages } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useHomeCopy } from './useHomeCopy';

const ICONS = [MapPin, Compass, Users, Waves, MessageCircle, Languages];

export default function HomeWhy() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-why-title" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader kicker={c.why.kicker} title={c.why.title} />
        <span id="home-why-title" className="sr-only">{c.why.title}</span>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {c.why.items.map((item, i) => { const Icon = ICONS[i]; return <div key={item.title} className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-ocean-50 text-ocean-700"><Icon className="h-5 w-5" aria-hidden="true" /></span><div><h3 className="font-poppins text-base font-bold text-foreground">{item.title}</h3><p className="mt-1 font-inter text-sm leading-6 text-muted-foreground">{item.body}</p></div></div>; })}
        </div>
      </div>
    </section>
  );
}
