'use client';

import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';

type Section = { title: string; body: string[] };

const sections: Section[] = [
  {
    title: 'What we collect',
    body: [
      'Booking and enquiry forms: name, email address, WhatsApp/phone number, travel dates, group size (including children\u2019s ages where relevant), and any message or special request you enter.',
      'Newsletter sign-up: your email address and preferred language.',
      'Account creation: if you create an account, we store the details you provide (name, email) via our authentication provider, Supabase.',
      'We do not use third-party advertising or analytics trackers on this site. The only browser storage we use is a local preference for your selected language, kept on your own device.',
    ],
  },
  {
    title: 'How we use it',
    body: [
      'To respond to your enquiry, prepare a quotation, and manage your booking, including sending confirmation, voucher, and review-request emails.',
      'To send you our newsletter, if you subscribed \u2014 you can unsubscribe at any time.',
      'To manage your account, if you created one.',
    ],
  },
  {
    title: 'Where it\u2019s stored',
    body: [
      'Booking, enquiry, and newsletter data is stored in our database, hosted by Supabase. Booking emails (confirmations, vouchers) are sent via our email provider, Resend.',
      'We do not sell or rent your personal data to third parties.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'You can ask us to access, correct, or delete the personal data we hold about you, and to unsubscribe from marketing emails at any time, by contacting us using the details below.',
    ],
  },
  {
    title: 'Retention',
    body: [
      'We keep booking records for as long as reasonably needed for accounting, legal, and customer service purposes, and delete or anonymise data we no longer need to retain.',
    ],
  },
  {
    title: 'Contact',
    body: ['For any privacy question or request, please contact us using the details on our Contact page.'],
  },
];

export default function PrivacyPageClient() {
  const { t, locale } = useLanguage();
  const isEn = locale === 'en';

  const activeSections = sections;

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {t.legal.label}
            </span>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground mb-4">{t.legal.privacyTitle}</h1>
            <p className="font-inter text-muted-foreground text-sm">
              {isEn
                ? `This describes how Bahari Asili Safaris handles personal data collected through this website. ${t.legal.lastUpdated}`
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
