import Link from 'next/link';
import type { ProgramGuide, SeasonRating } from '@/lib/program-guide';

const RATING_STYLE: Record<SeasonRating, string> = {
  Excellent: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  Good: 'bg-ocean-50 text-ocean-800 border-ocean-100',
  Fair: 'bg-amber-50 text-amber-900 border-amber-200',
  'Not ideal': 'bg-rose-50 text-rose-900 border-rose-200',
};

const GUIDE_LINKS = [
  { href: '/guides/kenya-safari-costs', label: 'What a Kenya safari costs' },
  { href: '/guides/best-time-for-a-kenya-safari', label: 'Best time for a Kenya safari or coast holiday' },
  { href: '/guides/kenya-safari-with-kids-and-seniors', label: 'Safari with children or older travellers' },
  { href: '/guides/kenya-safari-packing-list', label: 'Kenya safari packing list' },
];

function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
      <h2 id={`${id}-heading`} className="mb-3 font-poppins text-xl font-bold text-foreground">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function Capsule({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 border-l-4 border-ocean-600 pl-3 font-inter text-base leading-relaxed text-foreground">{children}</p>;
}

export default function ProgramGuideSections({
  guide,
  destinationLinks,
  showOverview = true,
}: {
  guide: ProgramGuide;
  destinationLinks: { slug: string; name: string }[];
  showOverview?: boolean;
}) {
  const { cost, bestTime, children: kids, mobility, packing, health } = guide;

  return (
    <div className="program-guide">
      {showOverview && <section id="overview" aria-labelledby="overview-heading" className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-card sm:p-6">
        <h2 id="overview-heading" className="mb-3 font-poppins text-xl font-bold text-foreground">
          {guide.name} at a glance
        </h2>
        <Capsule>{guide.answerCapsule}</Capsule>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-inter text-sm">
            <caption className="sr-only">Quick facts for the {guide.name}</caption>
            <tbody>
              {guide.quickFacts.map((fact) => (
                <tr key={fact.label} className="border-b border-border last:border-0">
                  <th scope="row" className="w-40 py-2 pr-4 align-top font-semibold text-foreground">{fact.label}</th>
                  <td className="py-2 text-muted-foreground">{fact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
</section>}

      <Section id="cost" heading={`How much does the ${guide.name} cost?`}>
        <Capsule>{cost.capsule}</Capsule>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-primary">What is included</h3>
            <ul className="space-y-2">
              {cost.includes.map((item) => <li key={item} className="font-inter text-sm leading-relaxed text-foreground">✓ {item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-destructive">What is not included</h3>
            <ul className="space-y-2">
              {cost.excludes.map((item) => <li key={item} className="font-inter text-sm leading-relaxed text-foreground">✕ {item}</li>)}
            </ul>
          </div>
        </div>
        <h3 className="mb-2 mt-5 font-inter text-sm font-semibold text-foreground">What changes the price</h3>
        <ul className="list-disc space-y-1.5 pl-5">
          {cost.drivers.map((item) => <li key={item} className="font-inter text-sm leading-relaxed text-foreground">{item}</li>)}
        </ul>
        <p className="mt-4 font-inter text-sm leading-relaxed text-muted-foreground">{cost.highSeasonNote}</p>
</Section>

      <Section id="best-time" heading={`When is the best time to do the ${guide.name}?`}>
        <Capsule>{bestTime.capsule}</Capsule>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-inter text-sm">
            <caption className="sr-only">Month-by-month season guide for the {guide.name}</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">Month</th>
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">Rating</th>
                <th scope="col" className="py-2 font-semibold text-foreground">What to expect</th>
              </tr>
            </thead>
            <tbody>
              {bestTime.months.map((month) => (
                <tr key={month.month} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-4 align-top font-semibold text-foreground">{month.month}</th>
                  <td className="py-2 pr-4 align-top">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RATING_STYLE[month.rating]}`}>{month.rating}</span>
                  </td>
                  <td className="py-2 text-muted-foreground">{month.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-inter text-xs text-muted-foreground">{bestTime.sourceNote}</p>
      </Section>

      <div id="who-its-for" className="grid gap-6 md:grid-cols-2 scroll-mt-28">
      <Section id="with-children" heading={`Is the ${guide.name} suitable for children?`}>
        <Capsule>{kids.capsule}</Capsule>
        <ul className="list-disc space-y-2 pl-5">
          {kids.points.map((point) => <li key={point} className="font-inter text-sm leading-relaxed text-foreground">{point}</li>)}
        </ul>
      </Section>

      <Section id="mobility" heading="Is it suitable for older travellers or guests with limited mobility?">
        <Capsule>{mobility.capsule}</Capsule>
        <ul className="list-disc space-y-2 pl-5">
          {mobility.points.map((point) => <li key={point} className="font-inter text-sm leading-relaxed text-foreground">{point}</li>)}
        </ul>
      </Section>
      </div>

      <details id="prepare" className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-card scroll-mt-28">
        <summary className="cursor-pointer font-poppins text-xl font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">Prepare: packing, health and travel insurance</summary>
        <div className="mt-4">
      <Section id="packing" heading={`What should I pack for the ${guide.name}?`}>
        <Capsule>{packing.capsule}</Capsule>
        <div className="grid gap-5 sm:grid-cols-2">
          {packing.groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 font-inter text-xs font-semibold uppercase tracking-wide text-primary">{group.title}</h3>
              <ul className="list-disc space-y-1.5 pl-5">
                {group.items.map((item) => <li key={item} className="font-inter text-sm leading-relaxed text-foreground">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <h3 className="mb-2 mt-5 font-inter text-sm font-semibold text-foreground">What is supplied, and what to check</h3>
        <ul className="list-disc space-y-1.5 pl-5">
          {packing.supplied.map((item) => <li key={item} className="font-inter text-sm leading-relaxed text-foreground">{item}</li>)}
        </ul>
      </Section>

      <Section id="health-safety" heading={`Is the ${guide.name} safe? Health, vaccinations and insurance`}>
        <Capsule>{health.capsule}</Capsule>
        <ul className="list-disc space-y-2 pl-5">
          {health.points.map((point) => <li key={point} className="font-inter text-sm leading-relaxed text-foreground">{point}</li>)}
        </ul>
        <h3 className="mb-2 mt-4 font-inter text-sm font-semibold text-foreground">Sources</h3>
        <ul className="space-y-1">
          {health.sources.map((source) => (
            <li key={source.url} className="font-inter text-sm">
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-ocean-700 underline hover:text-ocean-800">{source.label}</a>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-inter text-xs text-muted-foreground">
          General guidance only, not medical advice. Confirm vaccinations, malaria tablets and entry requirements with a travel health professional and the official Kenya eTA portal.
        </p>
      </Section>
        </div>
      </details>

      <Section id="faq" heading={`${guide.name} — frequently asked questions`}>
        <div className="divide-y divide-border">
          {guide.faqs.map((faq) => (
            <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
              <h3 className="mb-1.5 font-poppins text-base font-semibold text-foreground">{faq.q}</h3>
              <p className="font-inter text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <section aria-labelledby="guide-links-heading" className="mb-6 rounded-2xl border border-border bg-sand-50 p-5 sm:p-6">
        <h2 id="guide-links-heading" className="mb-3 font-poppins text-lg font-bold text-foreground">Plan the rest of your trip</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GUIDE_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-inter text-sm font-semibold text-ocean-700 underline hover:text-ocean-800">{link.label}</Link>
            </li>
          ))}
          {destinationLinks.map((destination) => (
            <li key={destination.slug}>
              <Link href={`/destinations/${destination.slug}`} className="font-inter text-sm font-semibold text-ocean-700 underline hover:text-ocean-800">
                {destination.name} destination guide
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
