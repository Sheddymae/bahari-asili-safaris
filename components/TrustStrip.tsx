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
    <section className="relative -mt-px bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6">
          {points.map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-safari-500 flex-shrink-0" />
              <span className="font-inter text-sm font-medium text-foreground whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
