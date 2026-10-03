'use client';

import { ArrowDownRight } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

export default function HomeIntro() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-intro-title" className="relative overflow-hidden border-b border-line bg-shell py-24 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-coral/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:gap-24">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="editorial-label text-coral">{c.intro.kicker}</span>
              <span className="editorial-rule flex-1 bg-line" aria-hidden="true" />
            </div>
            <h2 id="home-intro-title" className="max-w-5xl font-editorial text-[3.5rem] leading-[0.86] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[7.2rem]">
              {c.intro.title}
            </h2>
            <p className="mt-9 max-w-2xl font-grotesk text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">{c.intro.body}</p>
          </div>
          <aside className="self-end border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-9">
            <p className="font-mono-editorial text-[9px] uppercase tracking-[0.22em] text-muted">The Kenya journal</p>
            <ul className="mt-7 divide-y divide-line border-y border-line">
              {c.intro.points.map((point, index) => (
                <li key={point} className="flex items-start gap-4 py-5">
                  <span className="font-mono-editorial text-[10px] text-coral">0{index + 1}</span>
                  <span className="font-grotesk text-sm leading-6 text-ink">{point}</span>
                </li>
              ))}
            </ul>
            <ArrowDownRight className="mt-8 h-6 w-6 text-coral" aria-hidden="true" />
          </aside>
        </div>
      </div>
    </section>
  );
}
