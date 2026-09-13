'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BuildSafariPromo() {
  const { t } = useLanguage();
  const e = t.homeExtras;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/safaris/safari-inside-tsavo-amboseli.jpg"
          alt="Personalised Kenya safari with Bahari Asili Safaris"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 font-inter text-safari-400 font-semibold text-sm tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            {e.buildLabel}
          </span>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-5">
            {e.buildTitle}
          </h2>
          <p className="font-inter text-white/85 text-base leading-relaxed mb-8">
            {e.buildSubtitle}
          </p>
          <Link
            href="/build-your-safari"
            prefetch
            className="inline-flex items-center gap-2 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm px-7 py-3.5 rounded-xl transition-all hover:shadow-lg"
          >
            {e.buildCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
