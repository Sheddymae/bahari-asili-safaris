'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CarFront, Check, Facebook, Globe2, Instagram, Plane } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Locale } from '@/lib/i18n';

type CardData = {
  code: string;
  title: string;
  subtitle: string;
  badge: string;
  detailLabel: string;
  detailValue: string;
  includesLabel: string;
  includes: string;
  secondary: string;
  image: string;
};

type SliderCopy = {
  unique: string;
  previous: string;
  next: string;
  request: string;
};

const COPY: Record<Locale, SliderCopy> = {
  en: { unique: 'UNIQUE DESTINATIONS', previous: 'Previous transfer', next: 'Next transfer', request: 'Request your transfer' },
  it: { unique: 'DESTINAZIONI UNICHE', previous: 'Trasferimento precedente', next: 'Trasferimento successivo', request: 'Richiedi il trasferimento' },
  fr: { unique: 'DESTINATIONS UNIQUES', previous: 'Transfert précédent', next: 'Transfert suivant', request: 'Demander le transfert' },
  es: { unique: 'DESTINOS ÚNICOS', previous: 'Traslado anterior', next: 'Siguiente traslado', request: 'Solicitar traslado' },
  de: { unique: 'EINZIGARTIGE ZIELE', previous: 'Vorheriger Transfer', next: 'Nächster Transfer', request: 'Transfer anfragen' },
  ar: { unique: 'وجهات فريدة', previous: 'النقل السابق', next: 'النقل التالي', request: 'اطلب خدمة النقل' },
  zh: { unique: '独特目的地', previous: '上一个接送', next: '下一个接送', request: '申请接送' },
  sw: { unique: 'MAENEO YA KIPEKEE', previous: 'Usafiri uliopita', next: 'Usafiri unaofuata', request: 'Omba usafiri wako' },
};

const CARD_DATA: Record<Locale, CardData[]> = {
  en: [
    { code: 'MBA', title: 'Mombasa Moi Airport', subtitle: 'Major coastal hub, 2h transfer to Watamu', badge: 'PRIVATE TRANSFER', detailLabel: 'Vehicle', detailValue: 'Private Land Cruiser', includesLabel: 'Includes', includes: 'AC, water, WiFi', secondary: 'Comfortable door-to-door coastal arrival', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'Nairobi Jomo Kenyatta', subtitle: 'International gateway, 1h flight to Masai Mara', badge: 'PRIVATE TRANSFER', detailLabel: 'Connection', detailValue: 'Meet & greet', includesLabel: 'Includes', includes: 'Domestic connection', secondary: 'Smooth handover for your safari start', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'Malindi Airport', subtitle: 'Closest to Watamu, 15min transfer', badge: 'PRIVATE TRANSFER', detailLabel: 'Arrival', detailValue: 'Shortest transfer', includesLabel: 'Includes', includes: 'VIP fast track', secondary: 'A quick, seamless arrival on the coast', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'Ukunda Airstrip · Diani', subtitle: 'Direct gateway to Diani and the south coast', badge: 'PRIVATE TRANSFER', detailLabel: 'Arrival', detailValue: 'Private meet & greet', includesLabel: 'Includes', includes: 'AC, water, WiFi', secondary: 'Easy connection between safari and beach', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  it: [
    { code: 'MBA', title: 'Aeroporto Moi di Mombasa', subtitle: 'Hub principale della costa, 2h fino a Watamu', badge: 'TRASFERIMENTO PRIVATO', detailLabel: 'Veicolo', detailValue: 'Land Cruiser privato', includesLabel: 'Include', includes: 'Aria condizionata, acqua, WiFi', secondary: 'Arrivo sulla costa comodo porta a porta', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'Jomo Kenyatta di Nairobi', subtitle: 'Gateway internazionale, 1h di volo per Maasai Mara', badge: 'TRASFERIMENTO PRIVATO', detailLabel: 'Collegamento', detailValue: 'Accoglienza e assistenza', includesLabel: 'Include', includes: 'Collegamento nazionale', secondary: 'Passaggio fluido verso l'inizio del safari', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'Aeroporto di Malindi', subtitle: 'Il più vicino a Watamu, trasferimento di 15 min', badge: 'TRASFERIMENTO PRIVATO', detailLabel: 'Arrivo', detailValue: 'Trasferimento più breve', includesLabel: 'Include', includes: 'Fast track VIP', secondary: 'Un arrivo rapido e senza pensieri sulla costa', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'Airstrip di Ukunda · Diani', subtitle: 'Gateway diretto per Diani e la costa sud', badge: 'TRASFERIMENTO PRIVATO', detailLabel: 'Arrivo', detailValue: 'Accoglienza privata', includesLabel: 'Include', includes: 'Aria condizionata, acqua, WiFi', secondary: 'Collegamento facile tra safari e spiaggia', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  fr: [
    { code: 'MBA', title: 'Aéroport Moi de Mombasa', subtitle: 'Grand hub côtier, 2h de transfert vers Watamu', badge: 'TRANSFERT PRIVÉ', detailLabel: 'Véhicule', detailValue: 'Land Cruiser privé', includesLabel: 'Comprend', includes: 'Climatisation, eau, WiFi', secondary: 'Arrivée côtière confortable porte à porte', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'Jomo Kenyatta de Nairobi', subtitle: 'Porte internationale, 1h de vol vers le Maasai Mara', badge: 'TRANSFERT PRIVÉ', detailLabel: 'Correspondance', detailValue: 'Accueil et assistance', includesLabel: 'Comprend', includes: 'Connexion nationale', secondary: 'Une transition fluide vers votre safari', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'Aéroport de Malindi', subtitle: 'Le plus proche de Watamu, 15 min de transfert', badge: 'TRANSFERT PRIVÉ', detailLabel: 'Arrivée', detailValue: 'Transfert le plus court', includesLabel: 'Comprend', includes: 'Fast track VIP', secondary: 'Une arrivée rapide et sereine sur la côte', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'Piste de Ukunda · Diani', subtitle: 'Accès direct à Diani et à la côte sud', badge: 'TRANSFERT PRIVÉ', detailLabel: 'Arrivée', detailValue: 'Accueil privé', includesLabel: 'Comprend', includes: 'Climatisation, eau, WiFi', secondary: 'Connexion facile entre safari et plage', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  es: [
    { code: 'MBA', title: 'Aeropuerto Moi de Mombasa', subtitle: 'Gran hub costero, 2h de traslado a Watamu', badge: 'TRASLADO PRIVADO', detailLabel: 'Vehículo', detailValue: 'Land Cruiser privado', includesLabel: 'Incluye', includes: 'Aire acondicionado, agua, WiFi', secondary: 'Llegada cómoda puerta a puerta a la costa', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'Jomo Kenyatta de Nairobi', subtitle: 'Puerta internacional, 1h de vuelo al Maasai Mara', badge: 'TRASLADO PRIVADO', detailLabel: 'Conexión', detailValue: 'Recepción y asistencia', includesLabel: 'Incluye', includes: 'Conexión nacional', secondary: 'Transición fluida para comenzar el safari', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'Aeropuerto de Malindi', subtitle: 'El más cercano a Watamu, 15 min de traslado', badge: 'TRASLADO PRIVADO', detailLabel: 'Llegada', detailValue: 'Traslado más corto', includesLabel: 'Incluye', includes: 'Fast track VIP', secondary: 'Llegada rápida y sencilla a la costa', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'Pista de Ukunda · Diani', subtitle: 'Acceso directo a Diani y la costa sur', badge: 'TRASLADO PRIVADO', detailLabel: 'Llegada', detailValue: 'Recepción privada', includesLabel: 'Incluye', includes: 'Aire acondicionado, agua, WiFi', secondary: 'Conexión fácil entre safari y playa', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  de: [
    { code: 'MBA', title: 'Mombasa Moi Airport', subtitle: 'Wichtiges Küstendrehkreuz, 2h Transfer nach Watamu', badge: 'PRIVATER TRANSFER', detailLabel: 'Fahrzeug', detailValue: 'Privater Land Cruiser', includesLabel: 'Inklusive', includes: 'Klimaanlage, Wasser, WiFi', secondary: 'Komfortable Ankunft an der Küste von Tür zu Tür', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'Nairobi Jomo Kenyatta', subtitle: 'Internationales Gateway, 1h Flug zum Maasai Mara', badge: 'PRIVATER TRANSFER', detailLabel: 'Verbindung', detailValue: 'Meet & Greet', includesLabel: 'Inklusive', includes: 'Inlandsverbindung', secondary: 'Nahtloser Übergang zum Start Ihrer Safari', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'Malindi Airport', subtitle: 'Am nächsten zu Watamu, 15 Min. Transfer', badge: 'PRIVATER TRANSFER', detailLabel: 'Ankunft', detailValue: 'Kürzester Transfer', includesLabel: 'Inklusive', includes: 'VIP Fast Track', secondary: 'Schnelle und reibungslose Ankunft an der Küste', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'Ukunda Airstrip · Diani', subtitle: 'Direkter Zugang zu Diani und der Südküste', badge: 'PRIVATER TRANSFER', detailLabel: 'Ankunft', detailValue: 'Privates Meet & Greet', includesLabel: 'Inklusive', includes: 'Klimaanlage, Wasser, WiFi', secondary: 'Einfache Verbindung zwischen Safari und Strand', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  ar: [
    { code: 'MBA', title: 'مطار موي مومباسا', subtitle: 'بوابة الساحل الرئيسية، ساعتان إلى واتامو', badge: 'نقل خاص', detailLabel: 'المركبة', detailValue: 'لاند كروزر خاصة', includesLabel: 'يشمل', includes: 'تكييف، ماء، WiFi', secondary: 'وصول ساحلي مريح من الباب إلى الباب', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'مطار جومو كينياتا نيروبي', subtitle: 'بوابة دولية، رحلة ساعة إلى ماساي مارا', badge: 'نقل خاص', detailLabel: 'الاتصال', detailValue: 'استقبال ومساعدة', includesLabel: 'يشمل', includes: 'رحلة داخلية', secondary: 'انتقال سلس لبدء رحلة السفاري', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'مطار ماليندي', subtitle: 'الأقرب إلى واتامو، نقل لمدة 15 دقيقة', badge: 'نقل خاص', detailLabel: 'الوصول', detailValue: 'أقصر نقل', includesLabel: 'يشمل', includes: 'مسار VIP سريع', secondary: 'وصول سريع وسلس إلى الساحل', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'مهبط أوكوندا · دياني', subtitle: 'بوابة مباشرة إلى دياني والساحل الجنوبي', badge: 'نقل خاص', detailLabel: 'الوصول', detailValue: 'استقبال خاص', includesLabel: 'يشمل', includes: 'تكييف، ماء، WiFi', secondary: 'اتصال سهل بين السفاري والشاطئ', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  zh: [
    { code: 'MBA', title: '蒙巴萨莫伊机场', subtitle: '主要海岸枢纽，前往瓦塔穆约2小时', badge: '私人接送', detailLabel: '车辆', detailValue: '私人陆地巡洋舰', includesLabel: '包含', includes: '空调、饮用水、WiFi', secondary: '舒适的海岸门到门接送', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: '内罗毕乔莫·肯雅塔', subtitle: '国际门户，飞往马赛马拉约1小时', badge: '私人接送', detailLabel: '衔接', detailValue: '接机与协助', includesLabel: '包含', includes: '国内航班衔接', secondary: '顺畅衔接您的野生动物之旅', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: '马林迪机场', subtitle: '距离瓦塔穆最近，约15分钟接送', badge: '私人接送', detailLabel: '抵达', detailValue: '最短接送', includesLabel: '包含', includes: 'VIP快速通道', secondary: '快速轻松抵达海岸', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: '乌昆达机场跑道 · 迪亚尼', subtitle: '直达迪亚尼和南部海岸', badge: '私人接送', detailLabel: '抵达', detailValue: '私人接机', includesLabel: '包含', includes: '空调、饮用水、WiFi', secondary: '轻松连接野生动物之旅与海滩假期', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
  sw: [
    { code: 'MBA', title: 'Uwanja wa Ndege Moi Mombasa', subtitle: 'Kitovu kikuu cha pwani, saa 2 hadi Watamu', badge: 'USAFIRI BINAFSI', detailLabel: 'Gari', detailValue: 'Land Cruiser binafsi', includesLabel: 'Inajumuisha', includes: 'AC, maji, WiFi', secondary: 'Kufika pwani kwa urahisi kutoka mlango hadi mlango', image: '/images/home/services-safari-jeep.jpg' },
    { code: 'NBO', title: 'Jomo Kenyatta Nairobi', subtitle: 'Lango la kimataifa, saa 1 ya ndege hadi Maasai Mara', badge: 'USAFIRI BINAFSI', detailLabel: 'Muunganisho', detailValue: 'Mapokezi na msaada', includesLabel: 'Inajumuisha', includes: 'Muunganisho wa ndani', secondary: 'Muunganisho laini wa kuanza safari yako', image: '/images/gallery/safari-gamedrive.png' },
    { code: 'MYD', title: 'Uwanja wa Ndege Malindi', subtitle: 'Karibu zaidi na Watamu, dakika 15 za usafiri', badge: 'USAFIRI BINAFSI', detailLabel: 'Kufika', detailValue: 'Usafiri mfupi zaidi', includesLabel: 'Inajumuisha', includes: 'VIP fast track', secondary: 'Kufika haraka na kwa urahisi pwani', image: '/images/gallery/coast-beach.png' },
    { code: 'UKA', title: 'Ukunda Airstrip · Diani', subtitle: 'Lango la moja kwa moja Diani na pwani ya kusini', badge: 'USAFIRI BINAFSI', detailLabel: 'Kufika', detailValue: 'Mapokezi binafsi', includesLabel: 'Inajumuisha', includes: 'AC, maji, WiFi', secondary: 'Muunganisho rahisi kati ya safari na ufukwe', image: '/images/home/bahari_safari_jeep.jpg.webp' },
  ],
};

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/bahariasilisafaris', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/bahariasilisafaris', Icon: Facebook },
];

function getWindow(cards: CardData[], page: number) {
  return [0, 1, 2].map((offset) => cards[(page + offset) % cards.length]);
}

function TransferCard({ card, copy }: { card: CardData; copy: SliderCopy }) {
  return (
    <article className="group relative h-[430px] w-[82vw] max-w-[360px] shrink-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)] sm:w-[360px] lg:h-[440px] lg:w-auto lg:flex-1 lg:max-w-none">
      <Image src={card.image} alt="" fill sizes="(max-width: 1023px) 82vw, 24vw" className="object-cover transition duration-700 ease-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
      <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A18] px-3 py-1.5 text-[11px] font-black tracking-[0.08em] text-white shadow-lg">
          <Plane className="h-3.5 w-3.5" />
          {card.code}
        </span>
        <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-white backdrop-blur-md">
          {card.badge}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-poppins text-2xl font-black leading-[1.05] tracking-tight text-white">{card.title}</h3>
            <p className="mt-2 max-w-[300px] font-inter text-xs leading-5 text-white/80">{card.subtitle}</p>
          </div>
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFFBEB] text-[#0E5F6B] shadow-lg sm:flex" aria-hidden="true">
            <CarFront className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/20 pt-4">
          <div className="min-w-0">
            <p className="font-inter text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">{card.detailLabel || copy.vehicle}</p>
            <p className="mt-1 truncate font-inter text-[11px] font-semibold text-white">{card.detailValue}</p>
          </div>
          <div className="min-w-0">
            <p className="font-inter text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">{card.includesLabel || copy.includes}</p>
            <p className="mt-1 truncate font-inter text-[11px] font-semibold text-white">{card.includes}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 font-inter text-[10px] text-white/65">
            <Check className="h-3.5 w-3.5 shrink-0 text-[#FF7A18]" />
            <span className="truncate">{card.secondary}</span>
          </span>
          <Link
            href="/transfers"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF7A18] px-3.5 py-2 text-[10px] font-bold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#ff8b36] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {copy.request}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomeTransfersCardSlider() {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotion();
  const copy = COPY[locale] ?? COPY.en;
  const cards = CARD_DATA[locale] ?? CARD_DATA.en;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const visibleCards = useMemo(() => getWindow(cards, page), [cards, page]);
  const totalPages = 3;

  const move = (nextDirection: number) => {
    setDirection(nextDirection);
    setPage((current) => (current + nextDirection + totalPages) % totalPages);
  };

  return (
    <section className="w-full overflow-hidden rounded-[2rem] border border-[#0E5F6B]/10 bg-[#FFFBEB] p-6 shadow-sm sm:p-8 lg:p-12" aria-label={t.transfers?.label || 'Transfers & Services'}>
      <div className="grid items-stretch gap-8 lg:grid-cols-[30%_minmax(0,70%)] lg:gap-10">
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-inter text-xs font-black tracking-[0.2em] text-[#FF7A18]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A18]" />
              {t.transfers?.label || 'TRANSFERS & SERVICES'}
            </div>
            <h2 className="mt-5 max-w-sm font-poppins text-4xl font-black leading-[0.94] tracking-[-0.04em] text-[#0E5F6B] sm:text-5xl lg:text-[3.4rem]">
              {t.transfers?.title || 'We take care of'}{' '}
              <span className="text-[#0E5F6B]">{t.transfers?.titleHighlight || 'everything'}</span>
            </h2>
            <p className="mt-5 max-w-md font-inter text-sm leading-6 text-slate-600">
              {t.transfers?.subtitle || 'From the moment you land to the moment you leave, we are with you.'}
            </p>
            <Link
              href="/transfers"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0E5F6B] px-8 py-3 font-inter text-sm font-bold text-white shadow-[0_10px_24px_rgba(14,95,107,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0c5360] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFBEB]"
            >
              {t.transfers?.cta || 'Explore Transfers'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 border-t border-[#0E5F6B]/10 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0E5F6B]/15 bg-white text-[#0E5F6B] transition hover:-translate-y-0.5 hover:border-[#FF7A18]/50 hover:text-[#FF7A18] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
                <a
                  href="/transfers"
                  aria-label={copy.unique}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0E5F6B]/15 bg-white text-[#0E5F6B] transition hover:-translate-y-0.5 hover:border-[#FF7A18]/50 hover:text-[#FF7A18] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
                >
                  <Globe2 className="h-4 w-4" />
                </a>
              </div>
              <span className="font-inter text-[9px] font-black tracking-[0.16em] text-[#0E5F6B]">{copy.unique}</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2" aria-label={copy.previous + ' / ' + copy.next}>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label={copy.previous}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0E5F6B]/20 bg-white text-[#0E5F6B] transition hover:-translate-y-0.5 hover:border-[#0E5F6B] hover:bg-[#0E5F6B] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label={copy.next}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0E5F6B]/20 bg-white text-[#0E5F6B] transition hover:-translate-y-0.5 hover:border-[#0E5F6B] hover:bg-[#0E5F6B] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A18]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-baseline gap-2 font-inter">
                <span className="text-2xl font-black tracking-tight text-[#0E5F6B]">{String(page + 1).padStart(2, '0')}</span>
                <span className="text-xs font-semibold text-slate-400">/ 03</span>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <div className="relative min-h-[430px] lg:min-h-[440px]">
            <motion.div
              key={page}
              drag={reducedMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -500) move(1);
                else if (info.offset.x > 70 || info.velocity.x > 500) move(-1);
              }}
              initial={reducedMotion ? false : { opacity: 0, x: direction > 0 ? 45 : -45 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full min-w-0 gap-5"
              style={{ touchAction: 'pan-y' }}
            >
              {visibleCards.map((card) => (
                <TransferCard key={card.code} card={card} copy={copy} />
              ))}
            </motion.div>
          </div>
          <div className="mt-4 flex items-center gap-2 lg:hidden">
            {[0, 1, 2].map((item) => (
              <button
                key={item}
                type="button"
                aria-label={'Go to transfer slide ' + String(item + 1)}
                onClick={() => { setDirection(item > page ? 1 : -1); setPage(item); }}
                className={'h-1.5 rounded-full transition-all ' + (item === page ? 'w-8 bg-[#FF7A18]' : 'w-2 bg-[#0E5F6B]/20')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
