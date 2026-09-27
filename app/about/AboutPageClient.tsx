'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Heart,
  Sparkles,
  Home as HomeIcon,
  Languages,
  Handshake,
  ShieldCheck,
  HeartHandshake,
  ListChecks,
  MapPin,
  Clock3,
  Instagram,
  Quote,
  ArrowRight,
  Phone,
} from 'lucide-react';

import PageShell from '@/components/PageShell';
import AboutHoverCard from '@/components/AboutHoverCard';
import AboutTimeline from '@/components/AboutTimeline';
import { useLanguage } from '@/contexts/LanguageContext';

const values = [
  { icon: Compass, key: 'mission' },
  { icon: Sparkles, key: 'vision' },
  { icon: Heart, key: 'values' },
] as const;

const setsApart = [
  { icon: HomeIcon, key: 'kenyanOwned' },
  { icon: Compass, key: 'bornInWatamu' },
  { icon: Languages, key: 'multilingual' },
  { icon: Handshake, key: 'noMiddlemen' },
] as const;

const guideQualities = [
  { icon: ShieldCheck, key: 'kwsLicensed' },
  { icon: HomeIcon, key: 'localRegion' },
  { icon: Languages, key: 'guideMultilingual' },
] as const;

const whyTravel = [
  { icon: Compass, titleKey: 'whyLocalTitle', bodyKey: 'whyLocalBody' },
  { icon: Sparkles, titleKey: 'whyTailorTitle', bodyKey: 'whyTailorBody' },
  { icon: ShieldCheck, titleKey: 'whyTrustedTitle', bodyKey: 'whyTrustedBody' },
  { icon: HeartHandshake, titleKey: 'whyAuthenticTitle', bodyKey: 'whyAuthenticBody' },
  { icon: ListChecks, titleKey: 'whyDetailTitle', bodyKey: 'whyDetailBody' },
] as const;

const profiles = [
  {
    name: 'Shadrack',
    role: 'Founder',
    image: '/images/gallery/safari-gamedrive.png',
    bio: 'Founder of Bahari Asili, rooted in Watamu and personally involved in the guest journey from the first enquiry to the final drive.',
  },
  {
    name: 'Lead Guide 1',
    role: 'Lead Safari Guide',
    image: '/images/home/services-safari-jeep.jpg',
    bio: 'A field-first guide who connects wildlife knowledge, roadcraft and local stories to create calm, unhurried safari days.',
  },
  {
    name: 'Lead Guide 2',
    role: 'Coastal & Safari Guide',
    image: '/images/gallery/coast-beach.png',
    bio: 'A local specialist who bridges Watamu, the coast and Kenya’s parks with practical advice and warm guest care.',
  },
];

const guestQuotes = [
  {
    quote: 'The team made the whole journey feel personal from the moment we arrived in Kenya.',
    name: 'Recent Bahari Asili Guest',
    trip: 'Kenya Safari',
  },
  {
    quote: 'Local knowledge changed the pace of our safari. We never felt rushed from one highlight to the next.',
    name: 'Safari Traveller',
    trip: 'Tsavo & Amboseli',
  },
  {
    quote: 'From Watamu to the parks, every transfer and detail felt connected and looked after.',
    name: 'Coastal Traveller',
    trip: 'Watamu & Safari',
  },
];

function SectionBackdrop({ image }: { image: string }) {
  return (
    <Image
      src={image}
      alt=""
      fill
      aria-hidden="true"
      sizes="240px"
      className="pointer-events-none object-cover opacity-[0.05] blur-sm"
    />
  );
}

export default function AboutPageClient() {
  const { t } = useLanguage();
  const aboutPage = t.aboutPage;
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % guestQuotes.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  const activeQuote = guestQuotes[quoteIndex];

  return (
    <PageShell>
      <section className="relative flex min-h-[420px] h-[60vh] items-end overflow-hidden">
        <Image src="/images/gallery/safari-gamedrive.png" alt={aboutPage.heroImageAlt} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E5F6B]/80 via-[#0E5F6B]/20 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
          <span className="mb-3 block font-inter text-sm font-semibold uppercase tracking-widest text-[#FF7A18]">{aboutPage.label}</span>
          <h1 className="font-poppins text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{aboutPage.heroTitle}</h1>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute -right-24 top-8 h-64 w-64 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-elephants.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Story</span>
              <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">{aboutPage.whoWeAreTitle}</h2>
              <p className="mt-5 font-inter text-base leading-7 text-slate-600">{aboutPage.whoWeAreBody}</p>
              <div className="mt-7 rounded-3xl border border-orange-100 bg-[#FFF7ED] p-6">
                <p className="font-poppins text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                  “We believe safari should feel real, not rushed. Not a postcard.”
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-[#FFFBEB] p-6 sm:p-8">
              <p className="font-inter text-sm font-bold uppercase tracking-[0.16em] text-[#FF7A18]">What we believe</p>
              <div className="mt-6 grid gap-5">
                {values.map(({ icon: Icon, key }) => (
                  <AboutHoverCard
                    key={key}
                    icon={Icon}
                    title={aboutPage.values[key].title}
                    description={aboutPage.values[key].body}
                    details={aboutPage.values[key].body}
                    bullets={['Personal service from enquiry to departure', 'Local knowledge before polished promises']}
                    href="#resolution"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section id="characters" className="relative overflow-hidden bg-[#FFFBEB] py-16">
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-giraffe.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Characters</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">Meet the People Behind Bahari Asili</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-slate-600 sm:text-base">The people, local knowledge and personal service behind every itinerary.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {profiles.map((profile) => (
              <article key={profile.name} className="rounded-3xl border border-orange-100 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.15)]">
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-[#FFF7ED]">
                  <Image src={profile.image} alt={profile.name} fill sizes="112px" className="object-cover" />
                </div>
                <h3 className="mt-5 font-poppins text-xl font-bold text-slate-900">{profile.name}</h3>
                <p className="mt-1 font-inter text-xs font-bold uppercase tracking-[0.15em] text-[#FF7A18]">{profile.role}</p>
                <p className="mt-4 font-inter text-sm leading-6 text-slate-600">{profile.bio}</p>
                <Link href="#characters" className="mt-5 inline-flex items-center gap-2 font-inter text-sm font-bold text-[#0E5F6B]">
                  Read bio <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-caveat text-4xl text-[#0E5F6B]">— Shadrack</p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-wildebeest.png" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Conflict</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">From 2 Vehicles to Watamu&apos;s Trusted Operator</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-slate-600 sm:text-base">The company grew by solving a simple problem: travellers wanted local care without losing the freedom of a real Kenyan experience.</p>
          </div>
          <AboutTimeline />
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section id="resolution" className="relative overflow-hidden bg-[#FDF6EC]/50 py-16">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-zebra.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Resolution</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">{aboutPage.setsApartTitle}</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-slate-600">A small set of choices keeps the experience direct, local and accountable.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {setsApart.map(({ icon: Icon, key }) => (
              <AboutHoverCard
                key={key}
                icon={Icon}
                title={aboutPage.setsApart[key].title}
                description={aboutPage.setsApart[key].body}
                details={aboutPage.setsApart[key].body}
                bullets={['KWS Licensed', '5+ years', '2000+ trips']}
                href="/contact"
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['KWS Licensed', '5+ years', '2000+ trips'].map((proof) => (
              <span key={proof} className="rounded-full bg-white px-4 py-2 font-inter text-xs font-bold text-[#0E5F6B] shadow-sm ring-1 ring-orange-100">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#FF7A18]" />
                {proof}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-lions.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <span className="mb-2 inline-flex items-center rounded-full bg-[#FFF7ED] px-4 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.18em] text-[#FF7A18]">{t.about.label}</span>
            <h2 className="font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">{t.about.whyTitle}</h2>
            <p className="mt-2 font-inter text-sm leading-6 text-slate-600 sm:text-base">{t.about.whySubtitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {whyTravel.map(({ icon: Icon, titleKey, bodyKey }) => (
              <AboutHoverCard
                key={titleKey}
                icon={Icon}
                title={t.about[titleKey as keyof typeof t.about] as string}
                description={t.about[bodyKey as keyof typeof t.about] as string}
                details={t.about[bodyKey as keyof typeof t.about] as string}
                bullets={['Local expertise', 'Tailor-made planning', 'Direct guest support']}
                href="/build-your-safari"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute -left-20 top-8 h-64 w-64 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-buffalo.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">Our Guides</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">{aboutPage.guidesTitle}</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-slate-600">{aboutPage.guidesIntro}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {guideQualities.map(({ icon: Icon, key }) => (
              <AboutHoverCard
                key={key}
                icon={Icon}
                title={aboutPage.guides[key].title}
                description={aboutPage.guides[key].body}
                details={aboutPage.guides[key].body}
                bullets={['KWS-licensed field practice', 'Local to the region', 'Multilingual guest support']}
                href="#characters"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-[#FFFBEB] py-16">
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-sunset.png" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Sequel</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">Where We Are Going</h2>
            <p className="mt-5 font-inter text-base leading-7 text-slate-600">
              We want to stay small enough to know every journey. That means staying Kenyan-owned, keeping our standards close to the ground, and resisting the pressure to overbook lodges or rush guests through a checklist. Growth should improve the experience, not dilute it.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/safari-birds.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Dialogue</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">Hear it from our guests</h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
            <div className="grid grid-cols-2 gap-3">
              {['/images/gallery/coast-beach.png', '/images/gallery/safari-elephants.png', '/images/gallery/safari-giraffe.png', '/images/gallery/safari-sunset.png'].map((image, index) => (
                <div key={image} className="relative min-h-[180px] overflow-hidden rounded-2xl border border-orange-100 bg-[#FFF7ED]">
                  <Image src={image} alt={index === 0 ? 'Bahari Asili guest experience on the Kenyan coast' : 'Kenyan safari experience'} fill sizes="(max-width: 1023px) 50vw, 25vw" className="object-cover transition duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-[#0E5F6B]/10" />
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-center rounded-3xl border border-orange-100 bg-[#FFFBEB] p-7 sm:p-9">
              <Quote className="h-9 w-9 text-[#FF7A18]" />
              <p className="mt-5 font-poppins text-xl font-bold leading-8 text-slate-900 sm:text-2xl">“{activeQuote.quote}”</p>
              <div className="mt-6">
                <p className="font-inter text-sm font-bold text-[#0E5F6B]">{activeQuote.name}</p>
                <p className="font-inter text-xs text-slate-500">{activeQuote.trip}</p>
              </div>
              <div className="mt-6 flex items-center gap-2" aria-label="Guest quote carousel controls">
                {guestQuotes.map((quote, index) => (
                  <button
                    key={quote.name + quote.trip}
                    type="button"
                    aria-label={'Show guest quote ' + (index + 1)}
                    onClick={() => setQuoteIndex(index)}
                    className={index === quoteIndex ? 'h-2.5 w-7 rounded-full bg-[#FF7A18]' : 'h-2.5 w-2.5 rounded-full bg-slate-300'}
                  />
                ))}
              </div>
              <div className="mt-7 flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <Instagram className="h-4 w-4 text-[#FF7A18]" /> Follow the journey
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="relative overflow-hidden bg-[#FDF6EC]/50 py-16">
        <div className="absolute -right-20 top-8 h-72 w-72 rounded-full opacity-5 blur-sm">
          <SectionBackdrop image="/images/gallery/coast-beach.png" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-inter text-xs font-black uppercase tracking-[0.18em] text-[#FF7A18]">The Setting</span>
            <h2 className="mt-2 font-poppins text-3xl font-black text-[#0E5F6B] sm:text-4xl">Find Us in Watamu</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-slate-600">Come and meet the people behind the vehicles, itineraries and calls.</p>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm lg:grid-cols-2">
            <div className="grid sm:grid-cols-2">
              <div className="relative min-h-[320px]">
                <Image src="/images/home/services-safari-jeep.jpg" alt="Bahari Asili safari vehicle in Kenya" fill sizes="(max-width: 1023px) 100vw, 25vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-8">
                <MapPin className="h-8 w-8 text-[#FF7A18]" />
                <h3 className="mt-4 font-poppins text-xl font-bold text-slate-900">Our Watamu base</h3>
                <p className="mt-3 font-inter text-sm leading-6 text-slate-600">Pinguili, Watamu, behind Paparemo Restaurant, blue gate.</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <a href={'tel:' + t.footer.phone} className="flex items-center gap-3 font-inter hover:text-[#0E5F6B]"><Phone className="h-4 w-4 text-[#FF7A18]" />{t.footer.phone}</a>
                  <a href={'mailto:' + t.footer.email} className="flex items-center gap-3 break-all font-inter hover:text-[#0E5F6B]">{t.footer.email}</a>
                </div>
                <div className="mt-6 flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-[#FF7A18]" />
                  <p className="font-inter text-xs leading-5 text-slate-600">Open daily · 08:00–20:00<br />24h guest support for active safaris.</p>
                </div>
              </div>
            </div>
            <div className="min-h-[360px] border-t border-orange-100 lg:border-l lg:border-t-0">
              <iframe
                title="Bahari Asili Safaris Watamu location"
                src="https://www.google.com/maps?q=Pinguili%2C%20Watamu%2C%20Kenya&output=embed"
                className="h-full min-h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-2" />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#0E5F6B] p-8 text-center sm:p-10 lg:p-14">
          <span className="font-inter text-xs font-black uppercase tracking-[0.2em] text-[#FF7A18]">The Credits</span>
          <h2 className="mt-3 font-poppins text-3xl font-black text-white sm:text-4xl">Ready to build your real Kenya story?</h2>
          <p className="mx-auto mt-4 max-w-2xl font-inter text-sm leading-6 text-white/80 sm:text-base">Tell us what you want to experience and we will shape the route, pace and details around you.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/build-your-safari" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-inter text-sm font-bold text-[#0E5F6B]">
              Build Your Safari <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={'mailto:' + t.footer.email} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 font-inter text-sm font-bold text-white">
              Talk to Shadrack
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-6">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-inter text-sm text-slate-500">{aboutPage.signatureIntro}</p>
          <p className="font-caveat text-5xl text-[#0E5F6B]">— Shadrack</p>
        </div>
      </section>
    </PageShell>
  );
}
