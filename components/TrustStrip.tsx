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
    <section className="border-b border-border bg-white" aria-label={e.trust1}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
        {points.map(({ icon: Icon, label }) => (
          <div key={label} className="flex min-h-20 items-center justify-center gap-2.5 px-4 py-4 text-center">
            <Icon className="h-[18px] w-[18px] shrink-0 text-safari-500" aria-hidden="true" />
            <span className="font-inter text-sm font-medium leading-5 text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
