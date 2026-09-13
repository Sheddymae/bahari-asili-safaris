'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Headphones, Car, BadgeCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ServicesSection() {
  const { t } = useLanguage();

  const services: { icon: React.ReactNode; title: string; desc: string; href?: string }[] = [
    {
      icon: <Headphones className="w-5 h-5 text-safari-500" />,
      title: t.services.item1Title,
      desc: t.services.item1Desc,
    },
    {
      icon: <Car className="w-5 h-5 text-safari-500" />,
      title: t.services.item2Title,
      desc: t.services.item2Desc,
      href: '/transfers',
    },
    {
      icon: <BadgeCheck className="w-5 h-5 text-safari-500" />,
      title: t.services.item3Title,
      desc: t.services.item3Desc,
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-10">
          <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
            {t.services.label}
          </span>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
            {t.services.title}{' '}
            <span className="text-safari-500">{t.services.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden h-72 sm:h-96 relative shadow-card-hover">
              <Image
                src="/images/home/services-safari-jeep.jpg"
                alt="Safari jeep in Masai Mara"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <Link
              href="/tours"
              prefetch
              className="absolute bottom-6 right-6 bg-safari-500 hover:bg-safari-600 text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:shadow-lg"
            >
              {t.services.seeAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Services list */}
          <div>
            {services.map((svc, i) => {
              const content = (
                <>
                  <div className="w-10 h-10 bg-safari-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    {svc.icon}
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-foreground text-base mb-1.5">{svc.title}</h3>
                    <p className="font-inter text-muted-foreground text-sm leading-relaxed">{svc.desc}</p>
                  </div>
                </>
              );
              const rowClass = `flex gap-4 p-6 rounded-2xl transition-all hover:bg-white hover:shadow-card ${
                i < services.length - 1 ? 'border-b border-border' : ''
              }`;

              // Transfers is a full standalone page — link the card through.
              if (svc.href) {
                return (
                  <Link key={i} href={svc.href} prefetch className={rowClass}>
                    {content}
                  </Link>
                );
              }
              return (
                <div key={i} className={`${rowClass} cursor-default`}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
