'use client';

import { CalendarDays, MessageCircle, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const copy = {
  en: { label: 'HOW IT WORKS', title: 'Booking is simple', steps: [['Pick a safari', 'Choose the experience that fits you.'], ['Tell us your dates', 'Share when you want to travel.'], ['We confirm with you', 'We reply by WhatsApp or email.']] },
  it: { label: 'COME FUNZIONA', title: 'Prenotare è semplice', steps: [['Scegli un safari', 'Scegli l’esperienza giusta per te.'], ['Dicci le date', 'Indicaci quando vuoi viaggiare.'], ['Confermiamo con te', 'Ti rispondiamo via WhatsApp o email.']] },
  fr: { label: 'COMMENT ÇA MARCHE', title: 'Réserver est simple', steps: [['Choisissez un safari', 'Choisissez l’expérience qui vous convient.'], ['Indiquez vos dates', 'Dites-nous quand vous souhaitez voyager.'], ['Nous confirmons', 'Nous répondons par WhatsApp ou email.']] },
  es: { label: 'CÓMO FUNCIONA', title: 'Reservar es sencillo', steps: [['Elige un safari', 'Elige la experiencia que prefieras.'], ['Dinos tus fechas', 'Indícanos cuándo quieres viajar.'], ['Confirmamos contigo', 'Respondemos por WhatsApp o email.']] },
  de: { label: 'SO FUNKTIONIERT ES', title: 'Buchen ist einfach', steps: [['Safari auswählen', 'Wählen Sie Ihr Erlebnis.'], ['Reisedaten nennen', 'Sagen Sie uns, wann Sie reisen möchten.'], ['Wir bestätigen', 'Wir antworten per WhatsApp oder E-Mail.']] },
  ar: { label: 'كيف يعمل الأمر', title: 'الحجز بسيط', steps: [['اختر رحلة سفاري', 'اختر التجربة المناسبة لك.'], ['أخبرنا بالتواريخ', 'شاركنا موعد السفر.'], ['نؤكد معك', 'نرد عبر واتساب أو البريد.']] },
  zh: { label: '预订流程', title: '预订很简单', steps: [['选择 Safari', '选择适合您的体验。'], ['告诉我们日期', '告诉我们计划出行的时间。'], ['我们与您确认', '通过 WhatsApp 或邮件回复。']] },
  sw: { label: 'JINSI INAVYOFANYA KAZI', title: 'Kuhifadhi ni rahisi', steps: [['Chagua safari', 'Chagua uzoefu unaokufaa.'], ['Tuambie tarehe', 'Tuambie unataka kusafiri lini.'], ['Tunathibitisha nawe', 'Tutajibu kupitia WhatsApp au barua pepe.']] },
} as const;

export default function HowToBook() {
  const { locale } = useLanguage();
  const c = copy[locale as keyof typeof copy] || copy.en;
  const icons = [Search, CalendarDays, MessageCircle];
  return (
    <section aria-labelledby="how-to-book-title" className="bg-white border-y border-border py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="font-inter text-safari-500 font-bold text-[11px] tracking-[0.2em] uppercase">{c.label}</span>
          <h2 id="how-to-book-title" className="font-poppins font-extrabold text-2xl sm:text-3xl text-foreground mt-2">{c.title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {c.steps.map(([title, text], i) => {
            const Icon = icons[i];
            return <div key={title} className="relative flex items-start gap-4 rounded-2xl bg-sand-50 border border-border p-5">
              <div className="w-11 h-11 rounded-full bg-ocean-700 text-white flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
              <div><div className="font-inter text-[11px] font-bold text-safari-500 uppercase">{i + 1}</div><h3 className="font-poppins font-bold text-base text-foreground mt-0.5">{title}</h3><p className="font-inter text-sm text-muted-foreground mt-1 leading-relaxed">{text}</p></div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
