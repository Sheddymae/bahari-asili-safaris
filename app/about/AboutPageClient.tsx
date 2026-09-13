'use client';

import Image from 'next/image';
import {
  Compass,
  Heart,
  Sparkles,
  Home as HomeIcon,
  Languages,
  Users,
  Handshake,
  ShieldCheck,
} from 'lucide-react';

import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';

const values = [
  { icon: Compass, key: 'mission' },
  { icon: Sparkles, key: 'vision' },
  { icon: Heart, key: 'values' },
] as const;

const setsApart = [
  { icon: HomeIcon, key: 'kenyanOwned' },
  { icon: Compass, key: 'bornInWatamu' },
  { icon: Languages, key: 'multilingual' },
  { icon: Handshake, key: 'noMiddlemen' },
] as const;

const guideQualities = [
  { icon: ShieldCheck, key: 'kwsLicensed' },
  { icon: HomeIcon, key: 'localRegion' },
  { icon: Languages, key: 'guideMultilingual' },
] as const;

export default function AboutPageClient() {
  const { t } = useLanguage();

  const aboutPage = t.aboutPage;

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/images/gallery/safari-gamedrive.png"
          alt={aboutPage.heroImageAlt}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <span className="font-inter text-safari-300 font-semibold text-sm tracking-widest uppercase block mb-3">
            {aboutPage.label}
          </span>

          <h1 className="font-poppins font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            {aboutPage.heroTitle}
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 lg:py-24 bg-sand-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-foreground mb-5">
            {aboutPage.whoWeAreTitle}
          </h2>

          <p className="font-inter text-foreground text-base leading-relaxed">
            {aboutPage.whoWeAreBody}
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-sand-50 rounded-2xl p-7 border border-sand-200 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-ocean-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-ocean-700" />
                </div>

                <h3 className="font-poppins font-bold text-lg text-foreground mb-2">
                  {aboutPage.values[key].title}
                </h3>

                <p className="font-inter text-sm text-foreground leading-relaxed">
                  {aboutPage.values[key].body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 lg:py-24 bg-sand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-foreground text-center mb-10">
            {aboutPage.setsApartTitle}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {setsApart.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-white rounded-2xl p-6 border border-border shadow-card"
              >
                <Icon className="w-6 h-6 text-safari-500 mb-3" />

                <h3 className="font-poppins font-semibold text-base text-foreground mb-1.5">
                  {aboutPage.setsApart[key].title}
                </h3>

                <p className="font-inter text-sm text-foreground leading-relaxed">
                  {aboutPage.setsApart[key].body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Guides */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Users className="w-5 h-5 text-safari-500" />

            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-foreground">
              {aboutPage.guidesTitle}
            </h2>
          </div>

          <p className="font-inter text-muted-foreground text-sm text-center max-w-xl mx-auto mb-10">
            {aboutPage.guidesIntro}
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {guideQualities.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-sand-50 rounded-2xl p-6 border border-sand-200 text-center"
              >
                <Icon className="w-8 h-8 mx-auto text-safari-500 mb-4" />

                <h3 className="font-poppins font-bold text-base text-foreground mb-1.5">
                  {aboutPage.guides[key].title}
                </h3>

                <p className="font-inter text-sm text-muted-foreground">
                  {aboutPage.guides[key].body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder signature */}
      <section className="pb-20 lg:pb-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-inter text-muted-foreground text-sm mb-2">
            {aboutPage.signatureIntro}
          </p>

          <p className="font-caveat text-5xl text-ocean-800">
            — Shadrack
          </p>
        </div>
      </section>
    </PageShell>
  );
}