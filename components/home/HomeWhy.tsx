'use client';

import { MapPin, Compass, Users, Waves, MessageCircle, Languages } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

const ICONS = [MapPin, Compass, Users, Waves, MessageCircle, Languages];

export default function HomeWhy() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-why-title" className="bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 border-t border-line pt-5 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="editorial-label text-orange-600">{c.why.kicker}</p>
            <h2 id="home-why-title" className="mt-4 max-w-sm font-editorial text-5xl leading-none tracking-tight text-ink sm:text-6xl">{c.why.title}</h2>
          </div>
          <div className="grid border-t border-line sm:grid-cols-2">
            {c.why.items.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <article key={item.title} className="border-b border-line py-6 sm:px-6 sm:odd:border-r">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono-editorial text-[10px] text-ocean-600">0{i + 1}</span>
                    <Icon className="h-4 w-4 text-ocean-700" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-editorial text-2xl leading-tight text-ink">{item.title}</h3>
                  <p className="mt-2 max-w-sm font-grotesk text-sm leading-6 text-ink-soft">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
