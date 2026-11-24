import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hubGuides, getHubGuide } from '@/lib/guides';
import { safaris } from '@/lib/safari-catalogue';
import { destinations } from '@/lib/destinations-data';
import { SITE_URL } from '@/lib/site';


type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return hubGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getHubGuide(slug);
  if (!guide) return { title: 'Guide not found' };
  const url = `/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    openGraph: { title: guide.title, description: guide.description, type: 'article', url },
    twitter: { card: 'summary', title: guide.title, description: guide.description },
  };
}

function GuideJsonLd({ guide }: { guide: (typeof hubGuides)[number] }) {
  const site = SITE_URL;
  const url = `${site}/guides/${guide.slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.h1,
        description: guide.description,
        dateModified: guide.lastReviewedAt,
        inLanguage: 'en',
        url,
        author: { '@type': 'Organization', name: 'Bahari Asili Safaris', url: site },
        publisher: { '@id': `${site}/#business` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site },
          { '@type': 'ListItem', position: 2, name: 'Travel guides', item: `${site}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getHubGuide(slug);
  if (!guide) notFound();

  const destinationNames = destinations.filter((d) => guide.destinationSlugs.includes(d.slug));
  const relatedPrograms = safaris
    .filter((s) => s.tabs?.some((tab) => guide.destinationSlugs.includes(tab)))
    .slice(0, 6);

  return (
    <>
      <GuideJsonLd guide={guide} />
      <Navbar />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 font-inter text-sm text-muted-foreground">
          <Link href="/" className="hover:text-ocean-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-ocean-700">Travel guides</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">{guide.title}</span>
        </nav>

        <article>
          <h1 className="font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">{guide.h1}</h1>
          <p className="mt-5 border-l-4 border-ocean-600 pl-4 font-inter text-lg leading-relaxed text-foreground">{guide.answerCapsule}</p>
          <div className="mt-6 space-y-4">
            {guide.intro.map((paragraph) => (
              <p key={paragraph} className="font-inter text-base leading-relaxed text-foreground">{paragraph}</p>
            ))}
          </div>

          {guide.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-poppins text-2xl font-bold text-foreground">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 font-inter text-base leading-relaxed text-foreground">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  {section.bullets.map((item) => (
                    <li key={item} className="font-inter text-base leading-relaxed text-foreground">{item}</li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left font-inter text-sm">
                    <caption className="sr-only">{section.table.caption}</caption>
                    <thead>
                      <tr className="border-b border-border">
                        {section.table.head.map((cell) => (
                          <th key={cell} scope="col" className="py-2 pr-4 font-semibold text-foreground">{cell}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join('|')} className="border-b border-border last:border-0">
                          {row.map((cell, index) => (
                            index === 0
                              ? <th key={cell} scope="row" className="py-2 pr-4 align-top font-semibold text-foreground">{cell}</th>
                              : <td key={cell} className="py-2 pr-4 align-top text-muted-foreground">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          {relatedPrograms.length > 0 && (
            <section className="mt-12 rounded-2xl border border-border bg-white p-6 shadow-card">
              <h2 className="font-poppins text-xl font-bold text-foreground">Safaris that fit this guide</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {relatedPrograms.map((program) => (
                  <li key={program.id}>
                    <Link href={`/safaris/${safariRouteSlug(program)}`} className="font-inter text-sm font-semibold text-ocean-700 underline hover:text-ocean-800">
                      {program.name} — {program.days} days
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-4">
                {destinationNames.map((destination) => (
                  <Link key={destination.slug} href={`/destinations/${destination.slug}`} className="font-inter text-sm font-semibold text-ocean-700 underline hover:text-ocean-800">
                    {destination.name} guide
                  </Link>
                ))}
                <Link href="/guides" className="font-inter text-sm font-semibold text-ocean-700 underline hover:text-ocean-800">
                  All travel guides
                </Link>
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
