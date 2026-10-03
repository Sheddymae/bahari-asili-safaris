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
    { icon: Phone, label: c.final.call, value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, event: 'phone_clicked' },
    { icon: Mail, label: 'Email', value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}`, event: 'email_clicked' },
  ];
  return (
    <section aria-labelledby="home-team-title" className="bg-paper py-24 lg:py-36">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div><span className="font-grotesk text-xs font-bold uppercase tracking-[0.18em] text-safari-600">{c.team.kicker}</span><h2 id="home-team-title" className="mt-2 font-editorial text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">{c.team.title}</h2><p className="mt-4 max-w-lg font-grotesk text-base leading-7 text-muted-foreground">{c.team.body}</p></div>
        <ul className="divide-y divide-border overflow-hidden rounded-sm border border-border bg-salt">{rows.map(({ icon: Icon, label, value, href, event }) => { const inner = <><Icon className="h-5 w-5 shrink-0 text-ocean-700" /><span className="min-w-0"><span className="block font-grotesk text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span><span className="block break-words font-grotesk text-sm font-medium text-foreground">{value}</span></span></>; return <li key={label}>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} onClick={() => event && trackConversion(event, { location: 'home_team' })} className="flex items-center gap-4 px-5 py-4 hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-inset">{inner}</a> : <div className="flex items-center gap-4 px-5 py-4">{inner}</div>}</li>; })}</ul>
      </div>
    </section>
  );
}
