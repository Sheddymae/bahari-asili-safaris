'use client';

import { Check } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

export default function HomeIntro() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-intro-title" className="border-b border-border bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-safari-600">{c.intro.kicker}</span>
          <h2 id="home-intro-title" className="mt-2 font-poppins text-3xl font-bold leading-tight text-foreground sm:text-4xl">{c.intro.title}</h2>
          <p className="mt-4 max-w-xl font-inter text-base leading-7 text-muted-foreground">{c.intro.body}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {c.intro.points.map((point) => (
            <li key={point} className="flex items-start gap-3 rounded-[4px] border border-border bg-sand-50 p-4">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-ocean-700" aria-hidden="true" />
              <span className="font-inter text-sm font-medium leading-5 text-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
