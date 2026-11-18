import type { Metadata } from 'next';
import { safaris } from '@/lib/safari-catalogue';
import { getPublicSafaris } from '@/lib/public-content';
import { buildProgramGuide, assertProgramGuide } from '@/lib/program-guide';
import { getRegionalSafariDestinationSlugs } from '@/lib/regional-safari-destinations';
import { destinations } from '@/lib/destinations-data';
import SafariDetailClient from '@/components/SafariDetailEnhanced';
import ProgramGuideSections from '@/components/ProgramGuideSections';
import ProgramStructuredData from '@/components/ProgramStructuredData';

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
  if (!safari) return { title: 'Safari not found | Bahari Asili Safaris' };

  const title = `${safari.name} | ${safari.days} Day Safari | Bahari Asili Safaris`;
  const description = `${safari.tagline}. ${safari.days} days / ${safari.nights} nights visiting ${safari.parks.join(', ')}. Costs, best months, suitability for children and older travellers, packing list and health advice.`;

  return {
    title,
    description,` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/safaris/${encodeURIComponent(safari.id)}`,
      images: safari.image ? [safari.image] : undefined,
    },
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
