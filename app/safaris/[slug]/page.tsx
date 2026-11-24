import type { Metadata } from 'next';
import { safaris } from '@/lib/safari-catalogue';
import { getPublicSafaris } from '@/lib/public-content';
import { buildProgramGuide, assertProgramGuide } from '@/lib/program-guide';
import { getRegionalSafariDestinationSlugs } from '@/lib/regional-safari-destinations';
import { destinations } from '@/lib/destinations-data';
import SafariDetailClient from '@/components/SafariDetailEnhanced';
import ProgramGuideSections from '@/components/ProgramGuideSections';
import ProgramStructuredData from '@/components/ProgramStructuredData';
import { cleanMetaDescription, pluralize } from '@/lib/format';

export function generateStaticParams() {
  return safaris.map((s) => {
    // Fails the build if any program is missing a required answer section.
    assertProgramGuide(buildProgramGuide(s));
    return { slug: s.id };
  });
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const managed = await getPublicSafaris('en');
  const safari = managed.find((s) => s.id === slug) || safaris.find((s) => s.id === slug);
  if (!safari) return { title: 'Safari not found' };

  const title = `${safari.name} | ${safari.days} ${pluralize(safari.days, 'day')} Safari`;
  const description = cleanMetaDescription(`${safari.tagline}. ${safari.days} ${pluralize(safari.days, 'day')} / ${safari.nights} ${pluralize(safari.nights, 'night')} visiting ${safari.parks.join(', ')}. Explore the itinerary, inclusions, best travel months and practical planning advice.`);
  const image = safari.image ? [{ url: safari.image, alt: safari.name }] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `/safaris/${encodeURIComponent(safari.id)}`, images: image },
    twitter: { card: 'summary_large_image', title, description, images: safari.image ? [safari.image] : undefined },
  };
}

export const dynamicParams = true;

export default async function SafariDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const managed = await getPublicSafaris('en');
  const safari = managed.find((s) => s.id === slug) || safaris.find((s) => s.id === slug);
  if (!safari) return <SafariDetailClient safari={null} slug={slug} />;

  const guide = buildProgramGuide(safari);
  assertProgramGuide(guide);

  const mappedSlugs = getRegionalSafariDestinationSlugs(safari.id);
  const destinationSlugs = mappedSlugs.length > 0 ? mappedSlugs : safari.tabs;
  const destinationLinks = destinations
    .filter((d) => destinationSlugs.includes(d.slug))
    .map((d) => ({ slug: d.slug, name: d.name }));

  return (
    <>
      <ProgramStructuredData guide={guide} safari={safari} />
      <SafariDetailClient
        safari={safari}
        slug={slug}
        guideSlot={<ProgramGuideSections guide={guide} destinationLinks={destinationLinks} />}
      />
    </>
  );
}
