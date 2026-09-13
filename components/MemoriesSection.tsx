'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MemoriesSection({ onBook }: { onBook: () => void }) {
  const { t } = useLanguage();

  const features = [
    { num: '01', title: t.memories.feature1Title, desc: t.memories.feature1Desc },
    { num: '02', title: t.memories.feature2Title, desc: t.memories.feature2Desc },
    { num: '03', title: t.memories.feature3Title, desc: t.memories.feature3Desc },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
            {t.memories.title}
          </h2>
          <p className="font-inter text-muted-foreground text-base">{t.memories.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-10 h-10 bg-ocean-700 text-white rounded-xl flex items-center justify-center font-poppins font-bold text-sm flex-shrink-0">
                  {feature.num}
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                  <p className="font-inter text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={onBook}
              className="inline-flex items-center gap-2 bg-ocean-700 hover:bg-ocean-800 text-white font-poppins font-semibold text-sm px-7 py-3.5 rounded-xl transition-all hover:shadow-lg mt-2"
            >
              {t.memories.startExplore}
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/about"
              prefetch
              className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-ocean-700 hover:text-ocean-800 transition-colors mt-2 sm:ml-4"
            >
              {t.homeExtras.learnMore}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden h-96 lg:h-[480px] relative shadow-card-hover">
              <Image
                src="/images/gallery/coast-beach.png"
                alt="Watamu coast, Kenya"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="absolute top-8 -left-4 sm:-left-8 bg-white rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-3 min-w-[180px] z-10">
              <div className="w-9 h-9 rounded-full bg-safari-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-safari-500" />
              </div>
              <div>
                <div className="font-poppins font-semibold text-foreground text-xs leading-none mb-1">
                  {t.footer.kwsLicensed}
                </div>
                <div className="font-inter text-xs text-muted-foreground">Kenya Wildlife Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
