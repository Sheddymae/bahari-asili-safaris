'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Loader2, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { safaris } from '@/lib/tours-data';
import SocialButtons from '@/components/SocialButtons';
import CallbackRequest from '@/components/CallbackRequest';

type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';

const travelGuideLabels: Record<SupportedLocale, string> = {
  en: 'Travel Guide', it: 'Guida di viaggio', fr: 'Guide de voyage', es: 'Guía de viaje', de: 'Reiseführer', ar: 'دليل السفر', zh: '旅行指南', sw: 'Mwongozo wa Safari',
};

export default function Footer() {
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const activeLocale = (Object.prototype.hasOwnProperty.call(travelGuideLabels, locale) ? locale : 'en') as SupportedLocale;
  const exploreLinks = [
    { label: t.nav.home, href: '/' }, { label: t.nav.tours, href: '/tours' }, { label: t.nav.excursions, href: '/excursions' }, { label: t.nav.destinations, href: '/destinations' }, { label: t.footer.buildYourSafari, href: '/build-your-safari' }, { label: t.nav.services, href: '/services' },
  ];
  const travelWithUsLinks = [
    { label: t.nav.transfers, href: '/transfers' }, { label: t.nav.about, href: '/about' }, { label: t.footer.partners, href: '/partners' }, { label: t.footer.blog, href: '/blog' }, { label: t.nav.contact, href: '/contact' },
  ];
  const popularSafaris = safaris.filter((s) => s.popular).slice(0, 3);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault(); if (status === 'loading') return; setStatus('loading'); setErrorMsg('');
    try { const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, locale }) }); const data = await res.json(); if (!res.ok || !data.success) { setErrorMsg(data.error || t.footer.newsletterSubtext); setStatus('error'); return; } setStatus('done'); setEmail(''); } catch { setErrorMsg(t.footer.newsletterSubtext); setStatus('error'); }
  }

  return (
    <footer className="relative overflow-hidden bg-foreground text-muted-foreground">
      <div className="h-8 rounded-b-[40px] bg-white" /><div className="pointer-events-none absolute inset-x-0 top-8 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_62%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 rounded-[28px] border border-white/15 bg-white/[0.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-poppins text-sm font-semibold text-white">{t.footer.buildYourSafari}</p><p className="mt-1 max-w-xl font-inter text-xs leading-5 text-white/60">{t.footer.bookingInformation}</p></div><div className="flex flex-wrap gap-2"><Link href="/build-your-safari" className="inline-flex items-center gap-2 rounded-xl bg-safari-500 px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-safari-600">{t.footer.buildYourSafari}<ArrowRight className="h-3.5 w-3.5" /></Link><a href={`tel:${t.footer.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-poppins text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/15"><Phone className="h-3.5 w-3.5 text-safari-400" />{t.footer.phone}</a></div></div></div><div className="flex flex-wrap items-center justify-between gap-4 mb-10"><div className="flex items-center"><Image src="/images/logo/logo-horizontal.png" alt="Bahari Asili Safaris" width={1752} height={798} className="h-9 w-auto" /></div><SocialButtons variant="dark" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div><h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.exploreCol || t.footer.explore}</h4><ul className="space-y-3">{exploreLinks.map((link) => <li key={link.href}><Link href={link.href} prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-safari-500 rounded-full flex-shrink-0" />{link.label}</Link></li>)}</ul></div>
          <div><h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.travelWithUs}</h4><ul className="space-y-3">{travelWithUsLinks.map((link) => <li key={link.href}><Link href={link.href} prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-safari-500 rounded-full flex-shrink-0" />{link.label}</Link></li>)}{popularSafaris.map((s) => <li key={s.id}><Link href={`/safaris/${s.id}`} prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-safari-500 rounded-full flex-shrink-0" />{s.name}</Link></li>)}</ul></div>
          <div><h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.support}</h4><ul className="space-y-3 mb-6">
            <li><Link href="/faq" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.faq}</Link></li>
            <li><Link href="/travel-guide" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{travelGuideLabels[activeLocale]}</Link></li>
            <li><CallbackRequest inline /></li>
            <li><Link href="/contact" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.bookingInformation}</Link></li>
            <li><Link href="/terms" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.terms}</Link></li>
            <li><Link href="/privacy" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.privacy}</Link></li>
          </ul><p className="font-inter text-xs text-muted-foreground mb-2">{t.footer.paymentMethods}</p><div className="flex flex-wrap gap-2 mb-6"><span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-muted-foreground">M-Pesa</span><span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-muted-foreground">VISA</span></div></div>
          <div><h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.contact}</h4><ul className="space-y-3 mb-6"><li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-safari-400 mt-0.5 flex-shrink-0" /><span className="font-inter text-sm text-muted-foreground">{t.footer.address}</span></li><li className="flex items-center gap-3"><Phone className="w-4 h-4 text-safari-400 flex-shrink-0" /><a href={`tel:${t.footer.phone}`} className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.phone}</a></li><li className="flex items-center gap-3"><Mail className="w-4 h-4 text-safari-400 flex-shrink-0" /><a href={`mailto:${t.footer.email}`} className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.email}</a></li></ul><p className="font-inter text-xs text-muted-foreground mb-2">{t.footer.newsletterTitle}</p><form onSubmit={handleNewsletterSubmit} className="flex"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.footer.newsletterPlaceholder} disabled={status === 'loading' || status === 'done'} className="h-9 w-full rounded-l-full bg-white/10 px-4 text-xs text-white placeholder:text-white/40 outline-none border border-white/10 disabled:opacity-60" /><button type="submit" disabled={status === 'loading' || status === 'done'} className="h-9 px-4 shrink-0 rounded-r-full bg-book text-white text-xs font-medium hover:bg-book-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-1">{status === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : status === 'done' ? <Check className="w-3.5 h-3.5" /> : t.footer.newsletterBtn}</button></form><p className="mt-2 text-[10px] text-muted-foreground">{status === 'error' ? errorMsg : status === 'done' ? t.footer.newsletterSuccess : t.footer.newsletterSubtext}</p></div>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"><p className="font-inter text-xs text-muted-foreground text-center">© {new Date().getFullYear()} Bahari Asili Safaris, Watamu.</p><div className="flex items-center gap-3 text-xs text-muted-foreground"><Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link><span aria-hidden="true">•</span><Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link></div></div></div>
    </footer>
  );
}
