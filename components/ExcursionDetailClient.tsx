'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, MapPin, Check, X, Info, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Excursion, excursions } from '@/lib/tours-data';
import { getLocalizedExcursion, type SupportedLocale } from '@/lib/excursion-content-i18n';

const ctaCopy: Record<Exclude<SupportedLocale, 'en'>, { title: string; description: string }> = {
  it: { title: 'Richiedi informazioni su questa escursione', description: 'Indicaci le date e il numero di partecipanti: confermeremo la disponibilità e potremo suggerire un safari da abbinare.' },
  fr: { title: 'Demandez des informations sur cette excursion', description: 'Indiquez-nous vos dates et le nombre de voyageurs : nous confirmerons la disponibilité et pourrons proposer un safari complémentaire.' },
  es: { title: 'Solicita información sobre esta excursión', description: 'Díganos sus fechas y el número de viajeros: confirmaremos la disponibilidad y podremos sugerir un safari para combinar.' },
  de: { title: 'Informationen zu diesem Ausflug anfragen', description: 'Nennen Sie uns Ihre Reisedaten und Gruppengröße. Wir bestätigen die Verfügbarkeit und schlagen auf Wunsch eine passende Safari vor.' },
  ar: { title: 'اطلب معلومات عن هذه الرحلة', description: 'أخبرنا بتواريخ السفر وعدد المسافرين وسنؤكد التوفر ونقترح رحلة سفاري مناسبة عند الحاجة.' },
  zh: { title: '咨询这项体验', description: '告诉我们您的日期和人数，我们会确认可用性，并可为您推荐适合搭配的野生动物之旅。' },
  sw: { title: 'Uliza kuhusu safari hii', description: 'Tuambie tarehe zako na idadi ya wasafiri; tutathibitisha nafasi na tunaweza kupendekeza safari ya wanyamapori ya kuunganisha.' }
};

export default function ExcursionDetailClient({ excursion }: { excursion: Excursion }) {
  const { t, locale } = useLanguage();
  const content = getLocalizedExcursion(excursion, locale as SupportedLocale);
  const ee = t.excursions;
  const cta = locale === 'en' ? { title: ee.askAboutExcursion.replace('this excursion', content.name), description: 'Tell us your dates and group size — we’ll confirm availability and, if useful, suggest a safari to pair it with.' } : ctaCopy[locale as Exclude<SupportedLocale, 'en'>];
  const related = excursions.filter((e) => e.category === excursion.category && e.id !== excursion.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <div className="relative h-[50vh] min-h-[360px]">
          <Image src={excursion.image} alt={content.name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
              <Link href="/excursions" prefetch className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-inter mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> {ee.backToAll}</Link>
              <div className="flex items-center gap-3 mb-2"><span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-inter font-semibold"><Clock className="w-3.5 h-3.5" /> {content.duration}</span></div>
              <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">{content.name}</h1>
              <p className="font-inter text-white/85 text-base mt-2 max-w-2xl">{content.description}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {content.startingLocation && <div className="flex items-center gap-2 mb-8 text-muted-foreground font-inter text-sm"><MapPin className="w-4 h-4 text-safari-500" />{content.startingLocation}</div>}
          <div className="flex flex-wrap gap-2 mb-10">{content.highlights.map((h, i) => <span key={i} className="bg-sand-50 text-foreground font-inter text-sm px-3 py-1.5 rounded-full border border-sand-200">{h}</span>)}</div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-safari-500" /><h2 className="font-poppins font-bold text-xl text-foreground">{ee.whatToExpect}</h2></div>
            <ul className="space-y-3">{content.whatToExpect.map((line, i) => <li key={i} className="font-inter text-foreground text-base leading-relaxed flex gap-3"><span className="w-1.5 h-1.5 mt-2.5 bg-safari-500 rounded-full flex-shrink-0" />{line}</li>)}</ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            <div className="bg-sand-50 rounded-2xl p-6"><h3 className="font-poppins font-bold text-base text-foreground mb-4">{ee.includedTitle}</h3><ul className="space-y-2.5">{content.included.map((item, i) => <li key={i} className="flex items-start gap-2.5 font-inter text-sm text-foreground"><Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />{item}</li>)}</ul></div>
            <div className="bg-sand-50 rounded-2xl p-6"><h3 className="font-poppins font-bold text-base text-foreground mb-4">{ee.notIncludedTitle}</h3><ul className="space-y-2.5">{content.notIncluded.map((item, i) => <li key={i} className="flex items-start gap-2.5 font-inter text-sm text-muted-foreground"><X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />{item}</li>)}</ul></div>
          </div>

          <div className="mb-12 border border-safari-200 bg-safari-50/40 rounded-2xl p-6"><div className="flex items-center gap-2 mb-3"><Info className="w-5 h-5 text-safari-600" /><h3 className="font-poppins font-bold text-base text-foreground">{ee.goodToKnow}</h3></div><ul className="space-y-2">{content.goodToKnow.map((line, i) => <li key={i} className="font-inter text-sm text-foreground leading-relaxed" key={i}>{line}</li>)}</ul></div>

          <div className="bg-foreground rounded-2xl p-8 sm:p-10 text-center"><h3 className="font-poppins font-bold text-2xl text-white mb-3">{cta.title}</h3><p className="font-inter text-white/70 text-sm mb-6 max-w-lg mx-auto">{cta.description}</p><Link href={`/?book=${excursion.id}`} className="inline-flex items-center justify-center gap-2 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm px-8 py-3.5 rounded-xl transition-all hover:shadow-md">{ee.requestThisExcursion}</Link></div>

          {related.length > 0 && <div className="mt-16"><h3 className="font-poppins font-bold text-xl text-foreground mb-6">{ee.moreLikeThis}</h3><div className="grid sm:grid-cols-3 gap-6">{related.map((r) => { const rc = getLocalizedExcursion(r, locale as SupportedLocale); return <Link key={r.id} href={`/excursions/${r.id}`} prefetch className="group rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow bg-white"><div className="relative h-32 w-full overflow-hidden"><Image src={r.image} alt={rc.name} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" /></div><div className="p-4"><p className="font-poppins font-semibold text-sm text-foreground">{rc.name}</p><p className="font-inter text-xs text-muted-foreground mt-1">{rc.duration}</p></div></Link>; })}</div></div>}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
