'use client';

import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';

type Section = { title: string; body: string[] };

const sections: Section[] = [
  {
    title: '1. Booking Terms',
    body: [
      'An enquiry or quotation is not a confirmed booking. A booking is confirmed once Bahari Asili Safaris has received the required deposit and issued written confirmation.',
      'The person making the booking must be at least 18 years old and confirms they have the authority to book on behalf of any other travellers included in the reservation.',
    ],
  },
  {
    title: '2. Payments',
    body: [
      'A 30% deposit is required to hold your dates. The remaining balance is due 2 weeks before arrival, unless otherwise agreed in writing for a specific booking.',
      'Accepted payment methods are M-Pesa and VISA. Bank charges or transaction fees, where applicable, are the responsibility of the client.',
    ],
  },
  {
    title: '3. Cancellations',
    body: [
      'Cancellations made 30 or more days before arrival: full refund of amounts paid.',
      'Cancellations made 15\u201329 days before arrival: 50% refund.',
      'Cancellations made less than 15 days before arrival: no refund.',
      'Cancellation requests must be made in writing (email or WhatsApp message) to be effective from the date received.',
    ],
  },
  {
    title: '4. Changes to Bookings',
    body: [
      'We will do our best to accommodate date or itinerary changes where lodge and vehicle availability allow, but changes are not guaranteed and may involve a price adjustment.',
    ],
  },
  {
    title: '5. Accommodation & Transportation',
    body: [
      'Accommodation is as specified in your written itinerary. Where a specific lodge becomes unavailable for reasons outside our control, we will offer an alternative of equivalent or higher standard.',
      'Safaris are conducted in 4x4 vehicles with pop-up roofs. Kenyan roads, particularly within parks, can be uneven, and travel times given are estimates.',
    ],
  },
  {
    title: '6. Park Access & Activities',
    body: [
      'Entry to national parks and reserves is subject to the rules of the relevant park authority (e.g. Kenya Wildlife Service) and can change without notice. We include current park fees in quoted safari prices unless stated otherwise.',
      'Wildlife sightings, including on marine excursions, are never guaranteed \u2014 animals move freely and sightings depend on natural conditions.',
    ],
  },
  {
    title: '7. Travel Documents',
    body: [
      'Clients are responsible for ensuring they hold a valid passport, visa, and any required travel documentation for entry into Kenya. We recommend confirming current requirements with an official government or embassy source before travel, as requirements can change.',
    ],
  },
  {
    title: '8. Client Responsibilities',
    body: [
      'Clients are responsible for their own conduct, valuables, and compliance with park rules and guide instructions during activities. We recommend comprehensive travel and medical insurance for every trip.',
    ],
  },
  {
    title: '9. Force Majeure',
    body: [
      'Bahari Asili Safaris is not liable for delays, changes, or cancellations caused by events beyond our reasonable control, including but not limited to extreme weather, natural disasters, civil unrest, government action, or public health emergencies. Where such events affect a booking, we will work with clients in good faith on rescheduling or alternative arrangements.',
    ],
  },
  {
    title: '10. Liability',
    body: [
      'This section is being finalised with our legal advisor and will be updated here once complete. In the meantime, please contact us directly with any questions about liability or insurance before booking.',
    ],
  },
  {
    title: '11. Privacy',
    body: ['See our full Privacy Policy for details on how we handle personal data.'],
  },
  {
    title: '12. Contact',
    body: ['Questions about these Terms can be sent to us using the details on our Contact page.'],
  },
];

export default function TermsPageClient() {
  const { t, locale } = useLanguage();
  const isEn = locale === 'en';

  // Prefer the fully translated sections coming from the merged i18n data
  // (lib/i18n-extra.ts); fall back to the English array above only if that
  // data is somehow missing for the active locale.
  const activeSections = sections;

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {t.legal.label}
            </span>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground mb-4">
              {t.legal.termsTitle}
            </h1>
            <p className="font-inter text-muted-foreground text-sm">
              {isEn
                ? `These terms govern bookings made with Bahari Asili Safaris, Watamu, Kenya. ${t.legal.lastUpdated}`
                : t.legal.lastUpdated}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card divide-y divide-border">
            {activeSections.map((s) => (
              <div key={s.title} className="p-6 sm:p-8">
                <h2 className="font-poppins font-bold text-lg text-foreground mb-3">{s.title}</h2>
                <div className="space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="font-inter text-sm text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="font-inter text-xs text-muted-foreground mt-8 text-center">
            {t.legal.contactLabel} {t.footer.address} &middot; {t.footer.phone} &middot; {t.footer.email}
          </p>
        </div>
      </section>
    </PageShell>
  );
}
