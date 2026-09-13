'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ShieldCheck, Loader2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { safaris } from '@/lib/tours-data';
import SocialButtons from '@/components/SocialButtons';

export default function Footer() {
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Col 1 — Explore (real pages, no full-reload — next/link handles that)
  const exploreLinks = [
  { label: t.nav.home, href: '/' },
  { label: t.nav.tours, href: '/tours' },
  { label: t.nav.excursions, href: '/excursions' },
  { label: t.nav.destinations, href: '/destinations' },
  { label: t.footer.buildYourSafari, href: '/build-your-safari' },
  { label: t.nav.services, href: '/services' },
];

const travelWithUsLinks = [
  { label: t.nav.transfers, href: '/transfers' },
  { label: t.nav.about, href: '/about' },
  { label: t.footer.partners, href: '/partners' },
  { label: t.footer.blog, href: '/blog' },
  { label: t.nav.contact, href: '/contact' },
];
  // Col 2b — Popular safari packages (used to fill out the Travel With Us column)
  const popularSafaris = safaris.filter((s) => s.popular).slice(0, 3);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }
      setStatus('done');
      setEmail('');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <footer className="bg-foreground text-muted-foreground relative">
      <div className="bg-white h-8 rounded-b-[40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Brand strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center">
            <Image
              src="/images/logo/logo-white.png"
              alt="Bahari Asili Safaris"
              width={1752}
              height={798}
              className="h-9 w-auto"
            />
          </div>
          <SocialButtons variant="dark" />
        </div>

        {/* 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Explore */}
          <div>
            <h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.exploreCol || t.footer.explore}</h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-safari-500 rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Travel With Us */}
          <div>
            <h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.travelWithUs}</h4>
            <ul className="space-y-3">
              {travelWithUsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-safari-500 rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
              {popularSafaris.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/safaris/${s.id}`}
                    prefetch
                    className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-safari-500 rounded-full flex-shrink-0" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Support + Payment methods */}
          <div>
            <h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.support}</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/faq" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.faq}</Link>
              </li>
              <li>
                <Link href="/contact" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.bookingInformation}</Link>
              </li>
              <li>
                <Link href="/terms" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.terms}</Link>
              </li>
              <li>
                <Link href="/privacy" prefetch className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">{t.footer.privacy}</Link>
              </li>
            </ul>

            <p className="font-inter text-xs text-muted-foreground mb-2">{t.footer.paymentMethods || "Payment Methods"}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-safari-400" /> {t.footer.kwsLicensed}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-muted-foreground">M-Pesa</span>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-muted-foreground">VISA</span>
            </div>
          </div>

          {/* Col 4 — Contact + Newsletter */}
          <div>
            <h4 className="font-poppins font-semibold text-white text-base mb-5">{t.footer.contact}</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-safari-400 mt-0.5 flex-shrink-0" />
                <span className="font-inter text-sm text-muted-foreground">{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-safari-400 flex-shrink-0" />
                <a href={`tel:${t.footer.phone}`} className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">
                  {t.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-safari-400 flex-shrink-0" />
                <a href={`mailto:${t.footer.email}`} className="font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors">
                  {t.footer.email}
                </a>
              </li>
            </ul>

            <p className="font-inter text-xs text-muted-foreground mb-2">{t.footer.newsletterTitle || "Newsletter"}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletterPlaceholder || "Your email"}
                disabled={status === 'loading' || status === 'done'}
                className="h-9 w-full rounded-l-full bg-white/10 px-4 text-xs text-white placeholder:text-white/40 outline-none border border-white/10 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'done'}
                className="h-9 px-4 shrink-0 rounded-r-full bg-book text-white text-xs font-medium hover:bg-book-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-1"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : status === 'done' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  t.footer.newsletterBtn || 'Join'
                )}
              </button>
            </form>
            <p className="mt-2 text-[10px] text-muted-foreground">
              {status === 'error' ? errorMsg : status === 'done' ? t.footer.newsletterSuccess || 'Karibu! You are on the list.' : t.footer.newsletterSubtext || 'One email a month, max. No spam.'}
            </p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="font-inter text-xs text-muted-foreground text-center">
            © 2026 Bahari Asili Safaris, Watamu. Founded by Shadrack Safari.
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-safari-400" /> {t.footer.kwsLicensed}
          </span>
        </div>
      </div>
    </footer>
  );
}