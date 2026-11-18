import { safaris } from '@/lib/safari-catalogue';
import { hubGuides } from '@/lib/guides';
import { destinations } from '@/lib/destinations-data';
import { excursions } from '@/lib/tours-data';

export const dynamic = 'force-static';

/**
 * llms.txt is an optional, low-risk machine-readable index. It is generated
 * from the same catalogue as the site so it cannot drift. Google has stated it
 * is not required for AI Overviews; it is offered because some assistants use
 * it and because it costs nothing to keep accurate.
 */
export function GET() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app').replace(/\/$/, '');
  const lines: string[] = [];

  lines.push('# Bahari Asili Safaris');
  lines.push('');
  lines.push(
    '> Kenya safari and coast travel company based in Watamu, Kenya. Private safaris from the coast to Tsavo, Amboseli, Taita Hills, the Masai Mara and the Rift Valley, plus day excursions and airport transfers. Prices are quoted per trip.',
  );
  lines.push('');
  lines.push('Contact: +254 101 923 355 (call or WhatsApp) · bahariasilisafaris@gmail.com · Watamu, Kenya');
  lines.push('');
  lines.push('Every program page below has an answer-first HTML page and a Markdown version at /programs/{slug}.');
  lines.push('');

  lines.push('## Programs');
  lines.push('');
  safaris.forEach((safari) => {
    const description = `${safari.days} days / ${safari.nights} nights from ${safari.itinerary[0]?.title.split('→')[0].trim() || 'Watamu'} to ${safari.parks.join(', ')}. Quoted per trip.`;
    lines.push(`- [${safari.name}](${site}/safaris/${safari.id}): ${description} Markdown: ${site}/programs/${safari.id}.md`);
  });
  lines.push('');

  lines.push('## Travel guides');
  lines.push('');
  hubGuides.forEach((guide) => {
    lines.push(`- [${guide.h1}](${site}/guides/${guide.slug}): ${guide.description}`);
  });
  lines.push('');

  lines.push('## Destinations');
  lines.push('');
  destinations.forEach((destination) => {
    lines.push(`- [${destination.name}](${site}/destinations/${destination.slug}): ${destination.tagline}`);
  });
  lines.push('');

  lines.push('## Day excursions');
  lines.push('');
  excursions
    .filter((excursion) => !excursion.id.startsWith('safari-blu-'))
    .forEach((excursion) => {
      lines.push(`- [${excursion.name}](${site}/excursions/${excursion.id}): ${excursion.description}`);
    });
  lines.push('');

  lines.push('## Company');
  lines.push('');
  lines.push(`- [About Bahari Asili Safaris](${site}/about): Kenyan-owned safari company based in Watamu.`);
  lines.push(`- [Contact](${site}/contact): WhatsApp, telephone, email and inquiry form.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
