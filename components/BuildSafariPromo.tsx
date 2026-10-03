'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BuildSafariPromo() {
  const { t } = useLanguage();
  const e = t.homeExtras;

  return (
    <section className="relative overflow-hidden bg-ocean-deep py-24 lg:py-32">
      <div className="absolute inset-0">
        <Image src="/images/safaris/safari-inside-tsavo-amboseli.jpg" alt="Personalised Kenya safari with Bahari Asili Safaris" fill className="object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 bg-ocean-deep/70" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-orange-400" aria-hidden="true" />
              <span className="editorial-label text-orange-300">{e.buildLabel}</span>
            </div>
            <h2 className="mt-6 font-editorial text-5xl leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-8xl">{e.buildTitle}</h2>
            <p className="mt-7 max-w-2xl font-grotesk text-base leading-7 text-white/75">{e.buildSubtitle}</p>
          </div>
          <Link href="/build-your-safari" prefetch className="inline-flex items-center gap-3 border-b border-white/60 pb-2 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white hover:border-orange-400 hover:text-orange-300">
            {e.buildCta}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
