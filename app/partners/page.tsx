'use client';

import { ShieldCheck, Building2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { safaris } from '@/lib/tours-data';
import { useLanguage } from '@/contexts/LanguageContext';

// Lodge names pulled straight from the existing safaris dataset, so this
// list stays in sync with whatever lodges are actually used on itineraries
// (no separate lodges table to maintain).
const lodges = Array.from(new Set(safaris.flatMap((s) => s.lodges ?? []))).sort();

export default function PartnersPage() {
  const { t } = useLanguage();
  const p = t.partners;
  return (
    <PageShell>
      <section className="py-20 lg:py-28 bg-sand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {p.label}
            </span>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {p.title}
            </h1>
            <p className="font-inter text-muted-foreground text-base max-w-xl mx-auto">
              {p.subtitle}
            </p>
          </div>

          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-ocean-700" />
              <h2 className="font-poppins font-semibold text-lg text-foreground">{p.lodgesTitle}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {lodges.map((lodge) => (
                <div
                  key={lodge}
                  className="bg-white rounded-xl border border-border shadow-card px-5 py-6 flex items-center justify-center text-center"
                >
                  <span className="font-poppins font-semibold text-sm text-foreground">{lodge}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-ocean-700" />
              <h2 className="font-poppins font-semibold text-lg text-foreground">{p.licensingTitle}</h2>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-card px-8 py-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-ocean-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-8 h-8 text-ocean-700" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-foreground mb-1">{p.kwsTitle}</h3>
                <p className="font-inter text-sm text-foreground leading-relaxed">
                  {p.kwsDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
