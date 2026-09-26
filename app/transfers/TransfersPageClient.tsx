'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock3, Plane, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Locale } from '@/lib/i18n';

const CARD_IMAGES = [
  '/images/home/services-safari-jeep.jpg',
  '/images/gallery/coast-beach.png',
  '/images/gallery/safari-gamedrive.png',
  '/images/home/bahari_safari_jeep.jpg.webp',
];

const STACK_COPY: Record<Locale, {
  arrivalLabel: string;
  cards: [string, string, string, string];
  includedTitle: string;
  arrivalCta: string;
}> = {
  en: { arrivalLabel: 'Seamless arrival', cards: ['Touch Down in Paradise', 'Coastal Gateway', 'Safari Starts Here', 'Transfers Included in Every Safari'], includedTitle: 'Transfers included in every safari', arrivalCta: 'Plan my arrival' },
  it: { arrivalLabel: 'Arrivo senza pensieri', cards: ['Atterra in paradiso', 'Porta d’accesso alla costa', 'Il safari inizia qui', 'Trasferimenti inclusi in ogni safari'], includedTitle: 'Trasferimenti inclusi in ogni safari', arrivalCta: 'Pianifica il mio arrivo' },
  fr: { arrivalLabel: 'Une arrivée sans souci', cards: ['Atterrissez au paradis', 'Porte d’entrée de la côte', 'Le safari commence ici', 'Transferts inclus dans chaque safari'], includedTitle: 'Transferts inclus dans chaque safari', arrivalCta: 'Planifier mon arrivée' },
  es: { arrivalLabel: 'Llegada sin preocupaciones', cards: ['Aterriza en el paraíso', 'Puerta de entrada a la costa', 'El safari comienza aquí', 'Traslados incluidos en cada safari'], includedTitle: 'Traslados incluidos en cada safari', arrivalCta: 'Planificar mi llegada' },
  de: { arrivalLabel: 'Entspannte Ankunft', cards: ['Im Paradies landen', 'Tor zur Küste', 'Die Safari beginnt hier', 'Transfers in jeder Safari inklusive'], includedTitle: 'Transfers in jeder Safari inklusive', arrivalCta: 'Meine Ankunft planen' },
  ar: { arrivalLabel: 'وصول سلس ومريح', cards: ['الوصول إلى الجنة', 'بوابة الساحل', 'تبدأ رحلتك في السفاري من هنا', 'النقل مشمول في كل رحلة سفاري'], includedTitle: 'النقل مشمول في كل رحلة سفاري', arrivalCta: 'خطط لوصولي' },
  zh: { arrivalLabel: '无忧抵达', cards: ['抵达天堂', '海岸门户', '从这里开启野生动物之旅', '每次狩猎之旅均包含接送'], includedTitle: '每次狩猎之旅均包含接送', arrivalCta: '规划我的抵达' },
  sw: { arrivalLabel: 'Kuwasili bila usumbufu', cards: ['Fika Peponi', 'Lango la Pwani', 'Safari inaanzia hapa', 'Usafiri umejumuishwa katika kila safari'], includedTitle: 'Usafiri umejumuishwa katika kila safari', arrivalCta: 'Panga kuwasili kwangu' },
};

function StackingCard({
  index,
  code,
  title,
  description,
  image,
  children,
  cta,
}: {
  index: number;
  code: string;
  title: string;
  description: string;
  image: string;
  children?: ReactNode;
  cta: string;
}) {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const brightness = useTransform(scrollYProgress, [0, 1], ['brightness(1)', 'brightness(0.68)']);
  const y = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <div ref={wrapperRef} className="relative h-[calc(75vh+120px)] min-h-[660px]">
      <motion.article
        style={reducedMotion ? undefined : { scale, filter: brightness, y }}
        className="sticky top-[120px] z-10 mx-auto grid h-[75vh] min-h-[560px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)]"
      >
        <div className="grid min-h-0 md:grid-cols-2">
          <div className="flex min-h-0 flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div>
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0E7482]/8 px-4 py-2 font-inter text-xs font-bold uppercase tracking-[0.16em] text-[#0E7482]">
                  <Plane className="h-3.5 w-3.5" />
                  {code}
                </span>
                <span className="font-inter text-xs font-semibold text-slate-400">0{index + 1} / 04</span>
              </div>
              <h2 className="max-w-xl font-poppins text-3xl font-bold leading-tight text-[#0E7482] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl font-inter text-base leading-7 text-slate-600 sm:text-lg">
                {description}
              </p>
              {children}
            </div>
            <Link
              href={code === 'ALL' ? '/build-your-safari' : '/transfers'}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#0E7482] px-5 py-3 font-inter text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b6370] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2"
            >
              {cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[260px] overflow-hidden bg-slate-100 md:min-h-0">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-white/15 px-4 py-2 font-inter text-xs font-semibold text-white backdrop-blur-md">
              Bahari Asili Safaris
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function TransfersPageClient() {
  const { locale, t } = useLanguage();
  const tr = t.transfers;
  const wildlife = t.wildlifeCalendar;
  const copy = STACK_COPY[locale] ?? STACK_COPY.en;
  const airports = tr.airports;
  const services = tr.services;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7f8f7]">
      <Navbar />

      <main className="pt-28">
        <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-6xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0E7482]/15 bg-white px-4 py-2 font-inter text-xs font-bold uppercase tracking-[0.16em] text-[#0E7482] shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#FF7A00]" />
                {tr.label}
              </span>
              <h1 className="mt-7 max-w-4xl font-poppins text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-slate-950 sm:text-6xl lg:text-8xl">
                {tr.title}{' '}
                <span className="text-[#0E7482]">{tr.titleHighlight}</span>
              </h1>
              <p className="mt-7 max-w-2xl font-inter text-base leading-7 text-slate-600 sm:text-lg">
                {tr.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-inter font-semibold text-slate-500">
                {airports.map((airport) => (
                  <span key={airport.code} className="rounded-full border border-slate-200 bg-white px-3.5 py-2">
                    {airport.code} · {airport.name}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl pb-5">
            <p className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-[#FF7A00]">
              {copy.arrivalLabel}
            </p>
            <p className="mt-2 max-w-2xl font-inter text-sm leading-6 text-slate-500">
              {tr.subtitle}
            </p>
          </div>

          <StackingCard
            index={0}
            code={airports[0].code}
            title={copy.cards[0]}
            description={airports[0].desc}
            image={CARD_IMAGES[0]}
            cta={copy.arrivalCta}
          />

          <StackingCard
            index={1}
            code={airports[1].code}
            title={copy.cards[1]}
            description={airports[1].desc}
            image={CARD_IMAGES[1]}
            cta={copy.arrivalCta}
          />

          <StackingCard
            index={2}
            code={airports[2].code}
            title={copy.cards[2]}
            description={airports[2].desc}
            image={CARD_IMAGES[2]}
            cta={copy.arrivalCta}
          />

          <StackingCard
            index={3}
            code="ALL"
            title={copy.cards[3]}
            description={wildlife.subtitle}
            image={CARD_IMAGES[3]}
            cta={t.homeExtras.buildCta}
          >
            <div className="mt-7 space-y-5">
              <div className="rounded-2xl bg-[#0E7482]/5 p-5">
                <div className="flex items-center gap-2 font-inter text-sm font-bold text-[#0E7482]">
                  <Clock3 className="h-4 w-4" />
                  {wildlife.legendPeak}
                </div>
                <p className="mt-2 font-inter text-sm leading-6 text-slate-600">
                  {wildlife.footnote}
                </p>
              </div>
              <div>
                <p className="font-poppins text-lg font-semibold text-slate-900">
                  {copy.includedTitle}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {services.slice(0, 4).map((service) => (
                    <div key={service.title} className="flex items-start gap-2 font-inter text-sm text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF7A00]/10 text-[#FF7A00]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{service.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StackingCard>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#0E7482] px-7 py-10 text-white shadow-xl sm:px-10 lg:flex-row lg:items-center lg:px-14">
              <div>
                <p className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-[#FFB366]">
                  {tr.label}
                </p>
                <h2 className="mt-3 font-poppins text-3xl font-bold sm:text-4xl">
                  {tr.title} {tr.titleHighlight}
                </h2>
                <p className="mt-3 max-w-2xl font-inter text-sm leading-6 text-white/75">
                  {tr.subtitle}
                </p>
              </div>
              <Link
                href="/build-your-safari"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF7A00] px-6 py-3.5 font-inter text-sm font-bold text-white transition hover:bg-[#e86e00] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E7482]"
              >
                {tr.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
