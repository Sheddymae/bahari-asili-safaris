'use client';

import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type FaqItem = { q: string; a: string };
type FaqCategory = { title: string; items: FaqItem[] };

const categories: FaqCategory[] = [
  {
    title: 'Booking',
    items: [
      {
        q: 'How do I book a safari or excursion?',
        a: 'Send us an enquiry through the booking form, WhatsApp, or email with your dates, group size, and the safari or excursion you\u2019re interested in. We confirm availability within 24\u201348 hours and send a written quotation \u2014 nothing is a confirmed booking until a deposit is paid.',
      },
      {
        q: 'How much deposit do I need to pay?',
        a: 'A 30% deposit secures your dates. The remaining balance is due 2 weeks before your arrival.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made 30 or more days before arrival receive a full refund. Cancellations 15\u201329 days before arrival receive a 50% refund. Cancellations made less than 15 days before arrival are non-refundable. Get in touch as early as possible if your plans change \u2014 we\u2019ll always try to find a workable solution first.',
      },
      {
        q: 'How do I pay?',
        a: 'We accept M-Pesa and VISA. Payment details are included on your written quotation and invoice.',
      },
    ],
  },
  {
    title: 'Safari',
    items: [
      {
        q: 'Are safaris private or shared?',
        a: 'Most of our safaris run as private trips with your own vehicle and guide, so your pace and stops are yours to set. Group options exist for some packages \u2014 check the individual safari page or ask us.',
      },
      {
        q: 'What\u2019s included in a safari price?',
        a: 'As standard: KWS park entry fees, a 4x4 safari vehicle with pop-up roof, an English & Italian-speaking driver-guide, full board, drinking water during game drives, accommodation as per the itinerary, and airport/hotel pickup and drop-off. Specific packages may vary \u2014 always check the \u201cIncluded / Not included\u201d section on the safari page.',
      },
      {
        q: 'Will we definitely see the animals shown in your photos?',
        a: 'No responsible operator can guarantee wildlife sightings \u2014 animals move freely in open parks and reserves. Our guides know the best areas and times, which gives you strong odds, but nature doesn\u2019t work on a schedule.',
      },
      {
        q: 'How far in advance should we book?',
        a: 'For popular travel periods (July\u2013October, and around Christmas/New Year), we recommend booking 2\u20133 months ahead where possible, since lodge availability is limited. Shorter notice is often still workable \u2014 just ask.',
      },
    ],
  },
  {
    title: 'Families',
    items: [
      {
        q: 'What\u2019s your policy for children?',
        a: 'Children under 5 travel free and do not require a separate vehicle seat. Children aged 5\u201312 are charged at 70% of the adult rate. Ask us about family-friendly lodges and pacing when you enquire.',
      },
      {
        q: 'Are safaris safe for young children?',
        a: 'Yes, with sensible precautions \u2014 our guides brief every group on vehicle safety and park rules. Let us know children\u2019s ages when booking so we can tailor game drive length and stops accordingly.',
      },
    ],
  },
  {
    title: 'Transport',
    items: [
      {
        q: 'Do you offer airport transfers?',
        a: 'Yes \u2014 private transfers from Malindi (MYD), Mombasa (MBA), and Nairobi (NBO/JKIA), in air-conditioned vehicles with a Meet & Greet service. See the Transfers page for details.',
      },
      {
        q: 'How long is the drive to the main parks from Watamu?',
        a: 'Tsavo East is the closest major park, roughly 3\u20134 hours by road, which is why most of our shorter safaris depart from and return to Watamu or Mombasa. The Masai Mara is far enough that a flight via Nairobi is usually more practical than driving.',
      },
    ],
  },
  {
    title: 'Accommodation',
    items: [
      {
        q: 'What type of lodges do you use?',
        a: 'Accommodation varies by package \u2014 each safari page lists the lodges included in that specific itinerary. Tell us your comfort and budget preferences and we can adjust.',
      },
    ],
  },
  {
    title: 'Coastal Excursions',
    items: [
      {
        q: 'Can we see dolphins or turtles on the marine excursions?',
        a: 'Sightings are possible on trips like the Blue Safaris and Robinson Island, but they depend on sea conditions and wildlife movement on the day \u2014 we never guarantee marine wildlife encounters.',
      },
      {
        q: 'Can excursions be combined with a safari?',
        a: 'Yes \u2014 many guests pair a Tsavo or Amboseli safari with a Watamu-based excursion like Mida Creek snorkelling or the Gede Ruins. Ask us to build a combined itinerary.',
      },
    ],
  },
  {
    title: 'Safety',
    items: [
      {
        q: 'Are your guides licensed?',
        a: 'Our guides are KWS-licensed and local to the region.',
      },
      {
        q: 'What should I know before travelling?',
        a: 'We recommend comprehensive travel insurance, checking current visa and vaccination requirements with official sources ahead of travel, and packing light, neutral-coloured clothing plus sun protection for game drives.',
      },
    ],
  },
  {
    title: 'Travel Planning',
    items: [
      {
        q: 'When is the best time to visit?',
        a: 'June\u2013October (dry season) generally offers the strongest game viewing as wildlife concentrates near water. November\u2013May is greener and quieter, with fewer vehicles on the tracks.',
      },
      {
        q: 'Can you build a custom itinerary?',
        a: 'Yes \u2014 use the Build Your Safari tool or contact us directly with your interests, dates and group size, and we\u2019ll put together a route around them.',
      },
    ],
  },
];

export default function FaqPageClient() {
  const { t, locale } = useLanguage();
  const isEn = locale === 'en';

  const categoryTitles: Record<string, string> = {
    Booking: t.legal.catBooking,
    Safari: t.legal.catSafari,
    Families: t.legal.catFamilies,
    Transport: t.legal.catTransport,
    Accommodation: t.legal.catAccommodation,
    'Coastal Excursions': t.legal.catExcursions,
    Safety: t.legal.catSafety,
    'Travel Planning': t.legal.catPlanning,
  };

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {t.footer.faq}
            </span>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              {t.legal.faqTitle}
            </h1>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
              Can&apos;t find your answer here? Reach us on{' '}
              <a href={`tel:${t.footer.phone}`} className="text-safari-600 font-semibold hover:underline">
                {t.footer.phone}
              </a>{' '}
              or{' '}
              <a href={`mailto:${t.footer.email}`} className="text-safari-600 font-semibold hover:underline">
                {t.footer.email}
              </a>
              , or visit our{' '}
              <Link href="/contact" prefetch className="text-safari-600 font-semibold hover:underline">
                {t.nav.contact}
              </Link>
              .
            </p>
            {!isEn && t.legal.englishOnlyNote && (
              <p className="font-inter text-xs text-muted-foreground/80 max-w-xl mx-auto mt-4 italic">
                {t.legal.englishOnlyNote}
              </p>
            )}
          </div>

          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat.title}>
                <h2 className="font-poppins font-bold text-xl text-foreground mb-3">
                  {categoryTitles[cat.title] ?? cat.title}
                </h2>
                <Accordion type="single" collapsible className="bg-white rounded-2xl shadow-card px-2">
                  {cat.items.map((item, i) => (
                    <AccordionItem key={i} value={`${cat.title}-${i}`}>
                      <AccordionTrigger className="font-inter font-semibold text-sm sm:text-base text-foreground px-4 text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="font-inter text-sm text-muted-foreground px-4 leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
