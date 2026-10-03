'use client';

import { MapPin, Compass, Users, Waves, MessageCircle, Languages } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

const ICONS = [MapPin, Compass, Users, Waves, MessageCircle, Languages];

export default function HomeWhy() {
  const { c } = useHomeCopy();

  return (
    <section aria-labelledby="home-why-title" className="border-y border-line bg-ocean-deep py-20 text-paper sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-4">
              <p className="editorial-label text-orange-400">{c.why.kicker}</p>
              <span className="h-px flex-1 bg-white/20" aria-hidden="true" />
            </div>
            <h2 id="home-why-title" className="mt-5 max-w-md font-editorial text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              {c.why.title}
            </h2>
            <p className="mt-8 max-w-sm font-grotesk text-sm leading-7 text-white/65">
              {c.intro.body}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-6 border-t border-white/15 pt-4">
              <span className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/45">Watamu / Kenya</span>
              <span className="text-right font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/45">Coast → Bush</span>
            </div>
          </div>

          <div className="border-t border-white/15">
            {c.why.items.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <article
                  key={item.title}
                  className="group grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[3rem_3rem_1fr_auto] sm:items-start sm:gap-6"
                >
                  <span className="font-mono-editorial text-[10px] text-orange-400">0{i + 1}</span>
                  <Icon className="mt-0.5 h-4 w-4 text-white/55 transition-colors group-hover:text-orange-400" aria-hidden="true" />
                  <div>
                    <h3 className="font-editorial text-2xl leading-tight text-paper sm:text-3xl">{item.title}</h3>
                    <p className="mt-2 max-w-xl font-grotesk text-sm leading-6 text-white/60">{item.body}</p>
                  </div>
                  <span className="hidden pt-1 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/30 sm:block">
                    Bahari Asili
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}