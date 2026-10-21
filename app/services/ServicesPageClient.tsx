'use client';

import { ArrowUpRight, Banknote, CarFront, Mail, MessageCircle, Plane, Smartphone, Compass } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { serviceHubCopy } from '@/lib/service-hub-i18n';

const WHATSAPP_NUMBER = '254101923355';

export default function ServicesPageClient() {
  const { locale, t } = useLanguage();
  const copy = serviceHubCopy[locale];
  const cardKeys = ['transfers', 'carRental', 'currency', 'sim', 'eta'] as const;
  const icons = {
    transfers: Plane,
    carRental: CarFront,
    currency: Banknote,
    sim: Smartphone,
    eta: ArrowUpRight,
  };
  const cards = cardKeys.map((key) => ({ key, ...copy.cards[key], Icon: icons[key] }));

  const contactLinks = (serviceTitle: string) => {
    const message = `Hello Bahari Asili Safaris, I would like to ask about: ${serviceTitle}. Please share the available options and any requirements.`;
    const subject = `Service enquiry: ${serviceTitle}`;
    const body = `Hello Bahari Asili Safaris,\n\nI would like to ask about: ${serviceTitle}.\nPlease share the available options and any requirements.\n\nThank you.`;
    return {
      whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      email: `mailto:${t.footer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    };
  };

  return (
    <PageShell>
      <main className="min-h-screen bg-sand-50">
        <section className="relative isolate overflow-hidden bg-[#12343B] text-white">
          <div className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96" />
          <div className="absolute -right-8 -top-12 -z-10 h-52 w-52 rounded-full border border-white/10 sm:h-72 sm:w-72" />
          <div className="absolute bottom-0 left-0 -z-10 h-40 w-full bg-gradient-to-t from-black/15 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-inter text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <Compass className="h-4 w-4 text-[#FF9A50]" />
                {copy.eyebrow}
              </span>
              <h1 className="font-poppins text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl font-inter text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{copy.intro}</p>
              <a href="#service-cards" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF7418] px-5 py-3 font-poppins text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-[#E9630D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12343B]">
                {copy.contactTitle}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="service-cards" className="scroll-mt-20 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-ocean-700">{copy.eyebrow}</p>
              <h2 className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl">{copy.title}</h2>
              <p className="mt-3 font-inter text-sm leading-6 text-muted-foreground">{copy.note}</p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map(({ key, title, description, note, official, officialLabel, Icon }) => {
                const links = contactLinks(title);
                const isEta = key === 'eta';
                return (
                  <article key={key} className="group flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(31,41,55,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,41,55,0.12)] sm:p-7">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-700 transition-colors group-hover:bg-ocean-700 group-hover:text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      {isEta && (
                        <a href="https://etakenya.go.ke/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700" aria-label={copy.etaAria}>
                          <img src="https://etakenya.go.ke/images/ke_coa.png" alt={copy.etaLogoAlt} width="40" height="40" loading="lazy" decoding="async" className="h-10 w-10 object-contain" />
                          <span className="max-w-24 font-inter text-[11px] font-semibold leading-tight text-foreground">{copy.etaBadge}</span>
                        </a>
                      )}
                    </div>
                    <h3 className="mb-3 font-poppins text-xl font-semibold text-foreground">{title}</h3>
                    <p className="mb-4 flex-1 font-inter text-sm leading-relaxed text-muted-foreground">{description}</p>
                    {note && <p className="mb-4 rounded-lg bg-sand-50 p-3 font-inter text-xs leading-relaxed text-muted-foreground">{note}</p>}

                    {official && (
                      <a href={official} target="_blank" rel="noopener noreferrer" className="mb-4 inline-flex min-h-10 items-center gap-2 self-start font-inter text-sm font-semibold text-ocean-700 underline decoration-ocean-700/40 underline-offset-4 hover:text-ocean-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700">
                        {officialLabel}
                        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </a>
                    )}

                    {key !== 'eta' && (
                      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#168B51] px-4 py-2 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#116D3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168B51] focus-visible:ring-offset-2">
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          {copy.whatsapp}
                        </a>
                        <a href={links.email} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 font-inter text-sm font-semibold text-foreground transition-colors hover:bg-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2">
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          {copy.email}
                        </a>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="mt-8 rounded-2xl border border-ocean-700/15 bg-ocean-50/70 p-5 sm:mt-10 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-3xl">
                  <h2 className="mb-2 font-poppins text-lg font-semibold text-foreground">{copy.contactTitle}</h2>
                  <p className="font-inter text-sm leading-relaxed text-muted-foreground">{copy.note}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <a href={contactLinks(copy.contactTitle).whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ocean-700 px-5 py-3 font-inter text-sm font-semibold text-white hover:bg-ocean-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {copy.whatsapp}
                  </a>
                  <a href={contactLinks('General service enquiry').email} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 font-inter text-sm font-semibold text-foreground hover:bg-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {copy.email}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
