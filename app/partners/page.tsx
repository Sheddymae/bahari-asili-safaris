'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Handshake, ShieldCheck } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { safaris } from '@/lib/tours-data';
import { useLanguage } from '@/contexts/LanguageContext';

// These names are sourced from current itinerary data; they are not a
// representation that each property has a formal commercial partnership.
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
            <p className="font-inter text-muted-foreground text-base max-w-2xl mx-auto">
              {p.subtitle}
            </p>
          </div>

          <section aria-labelledby="partner-lodges-title" className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-ocean-700" aria-hidden="true" />
              <h2 id="partner-lodges-title" className="font-poppins font-semibold text-lg text-foreground">
                {p.lodgesTitle}
              </h2>
            </div>
            {lodges.length > 0 ? (
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
            ) : (
              <p className="font-inter text-sm text-muted-foreground">{p.partnerDisclaimer}</p>
            )}
            <p className="mt-4 font-inter text-xs text-muted-foreground leading-relaxed">
              {p.partnerDisclaimer}
            </p>
          </section>

          <section aria-labelledby="partner-work-title" className="bg-white rounded-2xl border border-border shadow-card px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-ocean-50 flex items-center justify-center flex-shrink-0">
                <Handshake className="w-7 h-7 text-ocean-700" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-ocean-700" aria-hidden="true" />
                  <span className="font-inter text-safari-600 font-semibold text-xs uppercase tracking-wider">
                    {p.licensingTitle}
                  </span>
                </div>
                <h2 id="partner-work-title" className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-3">
                  {p.partnerInquiryTitle}
                </h2>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-6">
                  {p.kwsDesc} {p.partnerInquiryDesc}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ocean-700 px-6 py-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-ocean-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2"
                >
                  {p.partnerInquiryCta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
