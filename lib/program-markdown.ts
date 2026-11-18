import type { Safari } from '@/lib/tours-data';
import type { ProgramGuide } from '@/lib/program-guide';

function esc(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
}

function row(cells: string[]): string {
  return `| ${cells.map(esc).join(' | ')} |`;
}

/**
 * Markdown version of a program page, generated from the same data object that
 * renders the HTML page. Served at /programs/{slug} for assistants and for the
 * OTA listing kit, so those outputs cannot drift from the website.
 */
export function programMarkdown(safari: Safari, guide: ProgramGuide, siteUrl: string): string {
  const site = siteUrl.replace(/\/$/, '');
  const url = `${site}/safaris/${encodeURIComponent(guide.slug)}`;
  const lines: string[] = [];

  lines.push(`# ${guide.name}`, '');
  lines.push(`> ${guide.answerCapsule}`, '');
  lines.push(`Canonical page: ${url}`, '');
  lines.push(`Last reviewed: ${guide.reviewed}`, '');

  lines.push('## Quick facts', '');
  lines.push(row(['Field', 'Value']));
  lines.push(row(['---', '---']));
  guide.quickFacts.forEach((fact) => lines.push(row([fact.label, fact.value])));
  lines.push('');

  lines.push(`## How much does the ${guide.name} cost?`, '');
  lines.push(guide.cost.capsule, '');
  lines.push('**Included**', '');
  guide.cost.includes.forEach((item) => lines.push(`- ${item}`));
  lines.push('', '**Not included**', '');
  guide.cost.excludes.forEach((item) => lines.push(`- ${item}`));
  lines.push('', '**What changes the price**', '');
  guide.cost.drivers.forEach((item) => lines.push(`- ${item}`));
  lines.push('', guide.cost.highSeasonNote, '');

  lines.push(`## When is the best time to do the ${guide.name}?`, '');
  lines.push(guide.bestTime.capsule, '');
  lines.push(row(['Month', 'Rating', 'What to expect']));
  lines.push(row(['---', '---', '---']));
  guide.bestTime.months.forEach((month) => lines.push(row([month.month, month.rating, month.note])));
  lines.push('', guide.bestTime.sourceNote, '');

  lines.push(`## Is the ${guide.name} suitable for children?`, '');
  lines.push(guide.children.capsule, '');
  guide.children.points.forEach((point) => lines.push(`- ${point}`));
  lines.push('');

  lines.push('## Is it suitable for older travellers or guests with limited mobility?', '');
  lines.push(guide.mobility.capsule, '');
  guide.mobility.points.forEach((point) => lines.push(`- ${point}`));
  lines.push('');

  lines.push(`## What should I pack for the ${guide.name}?`, '');
  lines.push(guide.packing.capsule, '');
  guide.packing.groups.forEach((group) => {
    lines.push(`### ${group.title}`, '');
    group.items.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  });
  lines.push('**What is supplied, and what to check**', '');
  guide.packing.supplied.forEach((item) => lines.push(`- ${item}`));
  lines.push('');

  lines.push(`## Is the ${guide.name} safe? Health, vaccinations and insurance`, '');
  lines.push(guide.health.capsule, '');
  guide.health.points.forEach((point) => lines.push(`- ${point}`));
  lines.push('', '**Sources**', '');
  guide.health.sources.forEach((source) => lines.push(`- [${source.label}](${source.url})`));
  lines.push('');

  lines.push('## Day-by-day itinerary', '');
  safari.itinerary.forEach((day) => {
    lines.push(`### ${day.day}: ${day.title}`, '');
    if (day.morning) lines.push(`- Morning: ${day.morning}`);
    if (day.afternoon) lines.push(`- Afternoon: ${day.afternoon}`);
    if (day.overnight) lines.push(`- Overnight: ${day.overnight}`);
    lines.push('');
  });

  lines.push('## Frequently asked questions', '');
  guide.faqs.forEach((faq) => {
    lines.push(`### ${faq.q}`, '', faq.a, '');
  });

  lines.push('## Contact', '');
  lines.push('Bahari Asili Safaris — Watamu, Kenya');
  lines.push('Telephone and WhatsApp: +254 101 923 355');
  lines.push('Email: bahariasilisafaris@gmail.com');
  lines.push(`Website: ${site}`);
  lines.push('');

  return lines.join('\n');
}
