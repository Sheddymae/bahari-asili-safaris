'use client';

import { Check } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

export default function HomeIntro() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-intro-title" className="border-b border-black/10 bg-salt py-28 sm:py-40">
      <div className="editorial-shell editorial-grid items-start">
        <div>
          <span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-safari-600">{c.intro.kicker}</span>
          <h2 id="home-intro-title" className="mt-5 font-editorial text-5xl leading-[0.92] text-foreground sm:text-6xl">{c.intro.title}</h2>
          <p className="mt-7 max-w-lg font-grotesk text-base leading-7 text-muted-foreground">{c.intro.body}</p>
        </div>
        <ul className="col-span-12 grid gap-0 lg:col-span-6 lg:col-start-7">
          {c.intro.points.map((point) => (
            <li key={point} className="flex items-start gap-4 border-t border-black/15 py-5">
              <Check className="mt-1 h-3 w-3 shrink-0 text-sun" aria-hidden="true" />
              <span className="font-grotesk text-sm font-medium leading-6 text-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
