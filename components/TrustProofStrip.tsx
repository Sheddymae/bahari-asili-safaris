'use client';

import { MessageCircle, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useHomeCopy } from '@/components/home/useHomeCopy';

export default function TrustProofStrip() {
  const { c } = useHomeCopy();
  const items = [
    { icon: MapPin, text: c.team.addressLabel },
    { icon: MessageCircle, text: 'Reachable on WhatsApp' },
    { icon: Phone, text: 'Direct phone support' },
    { icon: ShieldCheck, text: 'Licensed local operator' },
  ];
  return (
    <section aria-label="Booking proof" className="border-y border-sand-100 bg-[var(--brand-bg)] py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="trust-proof-strip divide-x divide-sand-300 rtl:divide-x-reverse">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-2 first:ps-0 last:pe-0">
              <Icon className="h-5 w-5 shrink-0 text-ocean-700" aria-hidden="true" />
              <span className="font-inter text-[13px] font-medium leading-5 text-ink-900">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
