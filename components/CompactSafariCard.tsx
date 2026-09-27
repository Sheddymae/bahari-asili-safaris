'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Star, MessageCircle, ArrowUpRight } from 'lucide-react';
import { getLocalizedSafari, type SafariLocale } from '@/lib/safari-content-i18n';
import type { Safari } from '@/lib/tours-data';

export default function CompactSafariCard({ safari, t, locale }: { safari: Safari; t: any; locale: SafariLocale }) {
  const s = getLocalizedSafari(safari, locale);
  const whatsappHref = `https://wa.me/254101923355?text=${encodeURIComponent(`Hello Bahari Asili, I'm interested in the ${s.name}. Please send me more details.`)}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-safari-300/70 hover:shadow-[0_18px_45px_rgba(14,95,107,0.14)]">
      <Link href={`/safaris/${safari.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-400 focus-visible:ring-inset">
        <div className="relative h-36 overflow-hidden sm:h-40">
          <Image src={safari.image} alt={s.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {safari.popular && <span className="bg-safari-500 text-white rounded-full px-3 py-1 font-inter font-bold text-[10px] tracking-wide uppercase">{t.popular}</span>}
            <span className="bg-white/95 rounded-full px-2.5 py-1 flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /><span className="font-inter font-semibold text-xs">{safari.rating}</span></span>
          </div>
          <div className="absolute bottom-3 left-4 right-4"><h3 className="font-poppins font-bold text-white text-lg leading-tight">{s.name}</h3></div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="inline-flex w-fit items-center gap-1.5 bg-sand-50 rounded-full px-3 py-1 font-inter text-xs text-ocean-700 font-semibold"><Clock className="w-3.5 h-3.5" />{safari.days} {t.days} / {safari.nights} {t.nights}</span>
        <Link href={`/safaris/${safari.id}`} className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-700 px-4 py-2.5 font-inter text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-ocean-800">{t.readMore}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center justify-center gap-1.5 text-[#168f45] text-xs font-semibold py-2"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</a>
      </div>
    </article>
  );
}
