'use client';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackConversion } from '@/components/Analytics';
import { getHomeLanding } from '@/lib/home-landing-i18n';
import { whatsappHref } from '@/lib/contact-info';
export default function FinalCtaSection({ onBook }: { onBook: () => void }) {
 const {locale}=useLanguage(); const e=getHomeLanding(locale);
 return <section className="bg-ocean-800 py-16 lg:py-20"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"><h2 className="font-poppins text-3xl font-bold text-white sm:text-4xl">{e.final.title}</h2><p className="mt-4 font-inter text-base text-white/85">{e.final.based}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={onBook} className="inline-flex items-center justify-center gap-2 rounded-card bg-ember-700 px-7 py-3.5 font-poppins text-sm font-semibold text-white hover:bg-ember-600"><ArrowRight className="h-4 w-4"/>{e.final.plan}</button><a href={whatsappHref(e.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={()=>trackConversion('whatsapp_clicked',{location:'final_cta'})} className="inline-flex items-center justify-center gap-2 rounded-card border border-white/35 px-7 py-3.5 font-poppins text-sm font-semibold text-white hover:bg-white/10"><MessageCircle className="h-4 w-4"/>{e.final.whatsapp}</a></div></div></section>;
}