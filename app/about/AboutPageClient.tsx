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
  HeartHandshake,
  ListChecks,
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

const whyTravel = [
  { icon: Compass, titleKey: 'whyLocalTitle', bodyKey: 'whyLocalBody' },
  { icon: Sparkles, titleKey: 'whyTailorTitle', bodyKey: 'whyTailorBody' },
  { icon: ShieldCheck, titleKey: 'whyTrustedTitle', bodyKey: 'whyTrustedBody' },
  { icon: HeartHandshake, titleKey: 'whyAuthenticTitle', bodyKey: 'whyAuthenticBody' },
  { icon: ListChecks, titleKey: 'whyDetailTitle', bodyKey: 'whyDetailBody' },
] as const;

export default function AboutPageClient() {
  const { t } = useLanguage();
  const aboutPage = t.aboutPage;

  return (
    <PageShell>
      <section className="relative flex min-h-[68vh] items-end overflow-hidden border-b border-line bg-ocean-deep">
        <Image
          src="/images/gallery/safari-gamedrive.png"
          alt={aboutPage.heroImageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20">
          <p className="editorial-label text-orange-300">{aboutPage.label}</p>
          <h1 className="mt-5 max-w-5xl font-editorial text-5xl leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-8xl">
            {aboutPage.heroTitle}
          </h1>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-10">
          <div>
            <p className="editorial-label text-ocean-700">01 / Our story</p>
            <h2 className="mt-5 max-w-md font-editorial text-4xl leading-[0.95] tracking-tight text-ink sm:text-5xl">
              {aboutPage.whoWeAreTitle}
            </h2>
          </div>
          <div className="max-w-3xl border-t border-line pt-6">
            <p className="font-grotesk text-base leading-8 text-ink-soft sm:text-lg">{aboutPage.whoWeAreBody}</p>
            <div className="mt-10 grid gap-6 border-t border-line pt-5 sm:grid-cols-3">
              <div><p className="font-mono-editorial text-[9px] uppercase tracking-[0.15em] text-muted">Origin</p><p className="mt-2 font-editorial text-xl text-ink">Watamu</p></div>
              <div><p className="font-mono-editorial text-[9px] uppercase tracking-[0.15em] text-muted">Perspective</p><p className="mt-2 font-editorial text-xl text-ink">Kenyan</p></div>
              <div><p className="font-mono-editorial text-[9px] uppercase tracking-[0.15em] text-muted">Journey</p><p className="mt-2 font-editorial text-xl text-ink">Coast → Bush</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-sand-50 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
            <div>
              <p className="editorial-label text-orange-600">02 / Principles</p>
              <h2 className="mt-3 font-editorial text-4xl leading-none text-ink sm:text-5xl">{aboutPage.setsApartTitle}</h2>
            </div>
          </div>
          <div className="border-t border-line">
            {setsApart.map(({ icon: Icon, key }, index) => (
              <article key={key} className="grid gap-5 border-b border-line py-7 sm:grid-cols-[3rem_3rem_0.55fr_1fr] sm:items-start sm:gap-6">
                <span className="font-mono-editorial text-[10px] text-orange-600">0{index + 1}</span>
                <Icon className="mt-0.5 h-4 w-4 text-ocean-700" aria-hidden="true" />
                <h3 className="font-editorial text-2xl leading-tight text-ink sm:text-3xl">{aboutPage.setsApart[key].title}</h3>
                <p className="font-grotesk text-sm leading-6 text-ink-soft">{aboutPage.setsApart[key].body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="editorial-label text-ocean-700">03 / Working with you</p>
              <h2 className="mt-4 max-w-md font-editorial text-4xl leading-[0.95] text-ink sm:text-5xl">{t.about.whyTitle}</h2>
              <p className="mt-5 max-w-sm font-grotesk text-sm leading-6 text-ink-soft">{t.about.whySubtitle}</p>
            </div>
            <div className="border-t border-line">
              {whyTravel.map(({ icon: Icon, titleKey, bodyKey }, index) => (
                <article key={titleKey} className="grid gap-5 border-b border-line py-6 sm:grid-cols-[3rem_1fr]">
                  <div className="flex h-7 w-7 items-center justify-center border border-line text-ocean-700">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-editorial text-2xl leading-tight text-ink">{t.about[titleKey as keyof typeof t.about] as string}</h3>
                      <span className="hidden font-mono-editorial text-[9px] text-muted sm:block">0{index + 1}</span>
                    </div>
                    <p className="mt-2 max-w-2xl font-grotesk text-sm leading-6 text-ink-soft">{t.about[bodyKey as keyof typeof t.about] as string}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ocean-deep py-20 text-paper sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="editorial-label text-orange-300">04 / The field team</p>
              <h2 className="mt-4 max-w-md font-editorial text-4xl leading-[0.95] sm:text-5xl">{aboutPage.guidesTitle}</h2>
              <p className="mt-5 max-w-sm font-grotesk text-sm leading-6 text-white/65">{aboutPage.guidesIntro}</p>
            </div>
            <div className="border-t border-white/15">
              {guideQualities.map(({ icon: Icon, key }, index) => (
                <article key={key} className="grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[3rem_3rem_1fr] sm:items-start">
                  <span className="font-mono-editorial text-[10px] text-orange-300">0{index + 1}</span>
                  <Icon className="mt-0.5 h-4 w-4 text-white/65" aria-hidden="true" />
                  <div>
                    <h3 className="font-editorial text-2xl leading-tight">{aboutPage.guides[key].title}</h3>
                    <p className="mt-2 max-w-xl font-grotesk text-sm leading-6 text-white/60">{aboutPage.guides[key].body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="border-t border-line pt-6">
            <p className="font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-muted">{aboutPage.signatureIntro}</p>
            <p className="mt-3 font-editorial text-4xl text-ocean-deep sm:text-5xl">— Shadrack</p>
            <p className="mt-2 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-muted">Bahari Asili Safaris / Watamu, Kenya</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
