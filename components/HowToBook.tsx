'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getHomeLanding } from '@/lib/home-landing-i18n';
import { MessageCircle, FileText, CheckCircle2, Send } from 'lucide-react';

export default function HowToBook() {
  const { locale } = useLanguage();
  const e = getHomeLanding(locale);
  const icons = [MessageCircle, FileText, CheckCircle2, Send];

  return (
    <section aria-labelledby="how-to-book-title" className="border-y border-line bg-paper py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div><p className="editorial-label text-coral">{e.steps.kicker}</p><h2 id="how-to-book-title" className="mt-5 font-editorial text-5xl leading-[0.9] tracking-[-0.025em] text-ink sm:text-6xl">{e.steps.title}</h2></div>
          <p className="max-w-xl border-b border-line pb-5 font-grotesk text-sm leading-6 text-ink-soft lg:justify-self-end">A simple route from first conversation to confirmed journey.</p>
        </div>
        <ol className="mt-14 grid border-t border-line md:grid-cols-2 lg:grid-cols-4">
          {e.steps.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="border-b border-line py-8 md:px-6 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0">
                <div className="flex items-center justify-between gap-4"><span className="font-mono-editorial text-[10px] text-coral">0{i + 1}</span><Icon className="h-4 w-4 text-ocean" aria-hidden="true" /></div>
                <h3 className="mt-12 font-editorial text-2xl leading-tight text-ink">{item.title}</h3>
                <p className="mt-3 font-grotesk text-sm leading-6 text-ink-soft">{item.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}