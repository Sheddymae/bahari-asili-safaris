'use client';

import { MapPin, MessageCircle, Phone, Mail } from 'lucide-react';
import { BUSINESS_EMAIL, PHONE_DISPLAY, PHONE_TEL, whatsappHref } from '@/lib/contact-info';
import { trackConversion } from '@/components/Analytics';
import { useHomeCopy } from './useHomeCopy';

export default function HomeTeam() {
  const { c, t } = useHomeCopy();
  const address = (t as { footer?: { address?: string } }).footer?.address ?? 'Pinguili, Watamu';
  const rows = [
    { icon: MapPin, label: c.team.addressLabel, value: address, href: undefined as string | undefined, event: undefined as string | undefined },
    { icon: MessageCircle, label: c.final.whatsapp, value: PHONE_DISPLAY, href: whatsappHref(c.whatsappMessage), event: 'whatsapp_clicked' },
    { icon: Phone, label: c.final.call, value: PHONE_DISPLAY, href: 'tel:' + PHONE_TEL, event: 'phone_clicked' },
    { icon: Mail, label: 'Email', value: BUSINESS_EMAIL, href: 'mailto:' + BUSINESS_EMAIL, event: 'email_clicked' },
  ];
  return (
    <section aria-labelledby="home-team-title" className="border-t border-line bg-sand-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="editorial-label text-ocean-600">{c.team.kicker}</p>
            <h2 id="home-team-title" className="mt-4 font-editorial text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl">{c.team.title}</h2>
            <p className="mt-7 max-w-md font-grotesk text-base leading-7 text-ink-soft">{c.team.body}</p>
          </div>
          <div className="border-t border-line">
            {rows.map(({ icon: Icon, label, value, href, event }, index) => {
              const inner = (
                <>
                  <span className="font-mono-editorial text-[10px] text-orange-600">0{index + 1}</span>
                  <Icon className="h-4 w-4 shrink-0 text-ocean-700" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-muted">{label}</span>
                    <span className="mt-1 block break-words font-grotesk text-sm font-medium text-ink">{value}</span>
                  </span>
                </>
              );
              return (
                <div key={label} className="border-b border-line">
                  {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} onClick={() => event && trackConversion(event, { location: 'home_team' })} className="flex items-center gap-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-offset-2">{inner}</a> : <div className="flex items-center gap-4 py-5">{inner}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
