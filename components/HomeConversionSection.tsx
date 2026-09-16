'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, Clock3, Globe2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
];

export default function HomeConversionSection({ onBook }: { onBook: () => void }) {
  const { t, locale, setLocale } = useLanguage();
  const copy = (t as any).homeEnhancements;
  const [openFaq, setOpenFaq] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    try { const saved = localStorage.getItem('bahari-currency'); if (saved && currencies.some(c => c.code === saved)) setCurrency(saved); } catch {}
  }, []);

  const changeCurrency = (code: string) => { setCurrency(code); try { localStorage.setItem('bahari-currency', code); } catch {} };

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (newsletterState === 'loading' || newsletterState === 'done') return;
    setNewsletterState('loading');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, locale }) });
      if (!res.ok) throw new Error('newsletter');
      setEmail(''); setNewsletterState('done');
    } catch { setNewsletterState('error'); }
  }

  return (
    <section className="bg-white py-16 sm:py-20" aria-label={copy.trust.title}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.trust.items.map((item: string) => (
            <div key={item} className="rounded-2xl border border-sand-200 bg-sand-50 p-5">
              <CheckCircle2 className="mb-3 h-5 w-5 text-safari-500" />
              <p className="font-poppins text-sm font-bold text-foreground">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div className="rounded-3xl bg-ocean-700 p-7 text-white sm:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/75">
              <ShieldCheck className="h-4 w-4" /> {copy.trust.eyebrow}
            </div>
            <h2 className="font-poppins text-3xl font-extrabold leading-tight sm:text-4xl">{copy.trust.title}</h2>
            <p className="mt-4 max-w-2xl font-inter text-sm leading-6 text-white/80 sm:text-base">{copy.trust.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={onBook} className="rounded-full bg-safari-500 px-6 py-3 font-poppins text-sm font-bold text-white transition hover:bg-safari-600">{copy.availability.cta}</button>
              <span className="inline-flex items-center gap-2 text-xs text-white/75"><Clock3 className="h-4 w-4" /> {copy.availability.text.split('.')[0]}.</span>
            </div>
          </div>

          <div className="rounded-3xl border border-sand-200 bg-sand-50 p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-ocean-700" />
              <h3 className="font-poppins text-lg font-bold text-foreground">{copy.currency.label}</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {currencies.map((item) => (
                <button key={item.code} type="button" onClick={() => changeCurrency(item.code)} aria-pressed={currency === item.code} className={`rounded-xl border px-3 py-2.5 text-left transition ${currency === item.code ? 'border-ocean-700 bg-white shadow-sm' : 'border-sand-200 bg-white/60 hover:border-ocean-300'}`}>
                  <span className="font-poppins text-sm font-bold text-foreground">{item.symbol} {item.code}</span>
                  <span className="block font-inter text-[11px] text-muted-foreground">{item.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 font-inter text-xs leading-5 text-muted-foreground">{copy.currency.quoteNote}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <span className="font-inter text-xs font-bold uppercase tracking-widest text-safari-500">{copy.faq.title}</span>
            <h2 className="mt-2 font-poppins text-3xl font-extrabold text-foreground sm:text-4xl">{copy.availability.title}</h2>
            <p className="mt-4 max-w-xl font-inter text-sm leading-7 text-foreground/75 sm:text-base">{copy.availability.text}</p>
            <div className="mt-6 space-y-2">
              {copy.faq.items.map((item: { q: string; a: string }, index: number) => (
                <div key={item.q} className="rounded-2xl border border-sand-200 bg-white">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-poppins text-sm font-bold text-foreground">
                    {item.q}<ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && <p className="px-5 pb-5 font-inter text-sm leading-6 text-foreground/75">{item.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-sand-50 p-7 sm:p-9 lg:self-start">
            <h2 className="font-poppins text-2xl font-extrabold text-foreground">{copy.newsletter.title}</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-foreground/75">{copy.newsletter.text}</p>
            <form onSubmit={subscribe} className="mt-6 flex flex-col gap-2 sm:flex-row">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.footer.newsletterPlaceholder || 'Your email'} disabled={newsletterState === 'loading' || newsletterState === 'done'} className="h-11 min-w-0 flex-1 rounded-full border border-sand-200 bg-white px-4 font-inter text-sm text-foreground outline-none focus:border-ocean-500" />
              <button type="submit" disabled={newsletterState === 'loading' || newsletterState === 'done'} className="h-11 rounded-full bg-safari-500 px-6 font-poppins text-sm font-bold text-white hover:bg-safari-600 disabled:opacity-60">{newsletterState === 'done' ? copy.newsletter.success : copy.newsletter.button}</button>
            </form>
            {newsletterState === 'error' && <p className="mt-2 font-inter text-xs text-destructive">{t.footer.newsletterError || 'Please try again.'}</p>}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-sand-200 pt-5">
              <span className="font-inter text-xs text-muted-foreground">{copy.currency.label}: <strong className="text-foreground">{currency}</strong></span>
              <label className="flex items-center gap-2 font-inter text-xs text-muted-foreground"><Globe2 className="h-4 w-4" /><select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="rounded-lg border border-sand-200 bg-white px-2 py-1 text-foreground"><option value="en">English</option><option value="it">Italiano</option><option value="fr">Français</option><option value="es">Español</option><option value="de">Deutsch</option><option value="ar">العربية</option><option value="zh">中文</option><option value="sw">Kiswahili</option></select></label>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 rounded-3xl border border-sand-200 bg-white p-7 sm:p-9 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <h2 className="font-poppins text-2xl font-extrabold text-foreground sm:text-3xl">{copy.aboutMore.title}</h2>
          <div className="space-y-4 font-inter text-sm leading-7 text-foreground/80 sm:text-base">
            {copy.aboutMore.paragraphs.map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}
            <ul className="grid gap-2 sm:grid-cols-2">
              {copy.aboutMore.points.map((point: string) => <li key={point} className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-safari-500" />{point}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
