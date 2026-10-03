'use client';

import { ArrowDownRight } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

export default function HomeIntro() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-intro-title" className="border-b border-line bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-20">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="editorial-label text-ocean-600">{c.intro.kicker}</span>
              <span className="editorial-rule flex-1" aria-hidden="true" />
            </div>
            <h2 id="home-intro-title" className="max-w-5xl font-editorial text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-8xl">{c.intro.title}</h2>
            <p className="mt-8 max-w-2xl font-grotesk text-base leading-7 text-ink-soft sm:text-lg">{c.intro.body}</p>
          </div>
          <aside className="self-end border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pl-8">
            <p className="font-mono-editorial text-[10px] uppercase tracking-[0.18em] text-muted">The Kenya journal</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {c.intro.points.map((point, index) => (
                <li key={point} className="flex items-start gap-4 py-4">
                  <span className="font-mono-editorial text-[10px] text-ocean-600">0{index + 1}</span>
                  <span className="font-grotesk text-sm leading-6 text-ink">{point}</span>
                </li>
              ))}
            </ul>
            <ArrowDownRight className="mt-7 h-6 w-6 text-orange-500" aria-hidden="true" />
          </aside>
        </div>
      </div>
    </section>
  );
}
