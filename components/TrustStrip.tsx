'use client';

import { Compass, MapPin, Users, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrustStrip() {
  const { t } = useLanguage();
  const e = t.homeExtras;

  const points = [
    { icon: Compass, label: e.trust1 },
    { icon: MapPin, label: e.trust2 },
    { icon: Users, label: e.trust3 },
    { icon: Sparkles, label: e.trust4 },
    { icon: Clock, label: e.trust5 },
  ];

  return (
    <section className="relative -mt-px overflow-hidden border-b border-border bg-white" aria-label="Why travel with Bahari Asili Safaris">
      <div className="trust-marquee-mask">
        <div className="trust-marquee-track" tabIndex={0} aria-label="Safari service highlights">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="trust-marquee-group flex shrink-0 items-center justify-center gap-x-10 px-5 py-6 sm:gap-x-14 sm:px-7 lg:gap-x-16 lg:px-8"
              aria-hidden={copy === 1}
            >
              {points.map(({ icon: Icon, label }, i) => (
                <div key={`${copy}-${i}`} className="flex shrink-0 items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-safari-500 sm:h-[18px] sm:w-[18px]" />
                  <span className="whitespace-nowrap font-inter text-sm font-medium text-foreground sm:text-[15px]">{label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
