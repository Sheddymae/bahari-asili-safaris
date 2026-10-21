'use client';

import { Check } from 'lucide-react';
import { useHomeCopy } from './useHomeCopy';

export default function HomeIntro() {
  const { c } = useHomeCopy();
  return (
    <section aria-labelledby="home-intro-title" className="relative overflow-hidden border-y border-[var(--brand-border)] bg-[var(--brand-sand)] py-14 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[var(--brand-primary)]/10 sm:-right-12 sm:-top-28 sm:h-80 sm:w-80" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-8">
        <div className="relative">
          <span className="inline-flex items-center gap-3 font-inter text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-primary-deep)]">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--brand-secondary)]" />
            {c.intro.kicker}
          </span>
          <h2 id="home-intro-title" className="mt-4 max-w-2xl font-poppins text-3xl font-bold leading-[1.12] tracking-tight text-[var(--brand-text)] sm:text-4xl lg:text-[2.7rem]">{c.intro.title}</h2>
          <p className="mt-5 max-w-xl font-inter text-base leading-7 text-[var(--brand-text-muted)] sm:text-lg sm:leading-8">{c.intro.body}</p>
        </div>
        <ul className="relative grid gap-3 sm:grid-cols-2 lg:gap-4">
          {c.intro.points.map((point, index) => (
            <li key={point} className="group flex min-h-[104px] items-start gap-3 border border-[var(--brand-border)] bg-white p-4 shadow-[var(--shadow-sm)] transition-transform duration-200 hover:-translate-y-0.5 sm:p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 font-poppins text-xs font-bold text-[var(--brand-primary-deep)]">{String(index + 1).padStart(2, '0')}</span>
              <span className="pt-1 font-inter text-sm font-semibold leading-6 text-[var(--brand-text)]">{point}</span>
              <Check className="ml-auto mt-1 h-4 w-4 shrink-0 text-[var(--brand-primary)] opacity-80" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
