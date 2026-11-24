#!/usr/bin/env node
/**
 * Builds docs/ota-listing-kit.md from the live program Markdown pages, so the
 * OTA copy, the website and the AI answers all come from one data source.
 *
 * Usage (with a server running): BASE_URL=http://127.0.0.1:3000 node scripts/build-ota-kit.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bahariasilisafaris.co.ke').replace(/\/$/, '');

const res = await fetch(`${BASE}/sitemap.xml`);
const sitemap = await res.text();
const paths = [...sitemap.matchAll(/<loc>([^<]*\/safaris\/[^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

function section(md, heading) {
  const start = md.indexOf(`## ${heading}`);
  if (start === -1) return '';
  const rest = md.slice(start + heading.length + 3);
  const next = rest.search(/^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function bullets(block) {
  return block.split('\n').filter((line) => line.startsWith('- ')).map((line) => line.slice(2).trim());
}

function firstParagraph(block) {
  return block.split('\n\n').find((part) => part && !part.startsWith('-') && !part.startsWith('#'))?.trim() || '';
}

function description(text, limit = 55) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let out = '';
  for (const sentence of sentences) {
    if (`${out} ${sentence}`.trim().split(/\s+/).length > limit) break;
    out += sentence;
  }
  return out.trim() || text.trim();
}

function quickFact(md, label) {
  const line = md.split('\n').find((l) => l.startsWith(`| ${label} |`));
  return line ? line.split('|')[2]?.trim() : '';
}

const blocks = [];
for (const path of paths) {
  const slug = path.split('/').pop();
  const md = await (await fetch(`${BASE}/programs/${slug}.md`)).text();
  const heading = (prefix) => md.split('\n').find((line) => line.startsWith(`## ${prefix}`))?.slice(3) ?? '';
  const title = md.split('\n')[0].replace(/^# /, '').trim();
  const blockquote = md.split('\n').find((l) => l.startsWith('> '))?.slice(2).trim() || '';
  const howMuch = heading('How much does');
  const costBlock = section(md, howMuch);
  const includedItems = bullets(costBlock.slice(costBlock.indexOf('**Included**'), costBlock.indexOf('**Not included**')));
  const excludedItems = bullets(costBlock.slice(costBlock.indexOf('**Not included**'), costBlock.indexOf('**What changes the price**')));
  const bestTime = firstParagraph(section(md, heading('When is the best time')));
  const packing = bullets(section(md, heading('What should I pack'))).slice(0, 10);
  const faqBlock = section(md, 'Frequently asked questions');
  const faqPairs = [...faqBlock.matchAll(/### (.+)\n\n([^\n]+)/g)].slice(0, 4).map((m) => ({ q: m[1].trim(), a: m[2].trim() }));
  const safeHeading = md.split('\n').find((l) => l.startsWith('## Is the ') && l.includes('safe'))?.slice(3) ?? '';
  const health = firstParagraph(section(md, safeHeading));

  blocks.push(`### ${title}

- **Canonical page:** ${SITE}/safaris/${slug}
- **Duration:** ${quickFact(md, 'Duration')}
- **Start / finish:** ${quickFact(md, 'Start / finish')}
- **Parks:** ${quickFact(md, 'Parks and reserves')}
- **Pricing basis:** ${quickFact(md, 'Price')}
- **Meeting point:** ${quickFact(md, 'Start / finish')} — pickup from your hotel or the airport, confirmed on the booking.
- **Cancellation policy:** TODO(owner) — no cancellation policy is published on the site or in this repository. Publish one before listing, because Viator, GetYourGuide and TripAdvisor all require it.

**50-word description (use as-is on every OTA)**

${description(blockquote)}

**Included**

${includedItems.map((item) => `- ${item}`).join('\n')}

**Not included**

${excludedItems.map((item) => `- ${item}`).join('\n')}

**Best time**

${bestTime}

**Packing (first ten items)**

${packing.map((item) => `- ${item}`).join('\n')}

**Health and safety**

${health}

**FAQ**
${faqPairs.map((pair) => `\n**${pair.q}**\n\n${pair.a}`).join('\n')}
`);
}

const header = `# OTA listing kit — Bahari Asili Safaris

Generated ${new Date().toISOString().slice(0, 10)} from the program Markdown pages, so the text here is identical to the website and to the AI-readable files. Regenerate with:

\`\`\`bash
npm run start   # in one terminal
BASE_URL=http://127.0.0.1:3000 node scripts/build-ota-kit.mjs
\`\`\`

## Rules before you list

1. Use the **same trading name** everywhere: “Bahari Asili Safaris”, Watamu, Kenya, +254 101 923 355, info@bahariasilisafaris.co.ke. Different names on different OTAs split the entity and weaken every AI answer.
2. Use the **50-word description and included/excluded lists exactly as written**. Do not add prices, awards, certifications, “best in Kenya” claims or review counts that the business cannot evidence.
3. Publish a **cancellation policy** first (currently TODO). Every OTA requires one, and it must match the website.
4. Do **not** promise wildlife sightings, migration dates or weather. The copy deliberately says “possible”, “usually” and “not guaranteed”.
5. Keep the **price basis** consistent: quoted per trip, with high/low season noted. When a reviewed from-price is approved, add it here and on the site in the same week.
6. Re-check every listing at least twice a year and whenever this file is regenerated.

## Platform checklist

### Viator
- [ ] Create the product under the legal/trading name Bahari Asili Safaris.
- [ ] Paste the 50-word description, inclusions and exclusions verbatim.
- [ ] Set the meeting point to “Hotel pickup in Watamu” and list the pickup zone.
- [ ] Add the cancellation policy (required).
- [ ] Upload real photos with descriptive alt text; do not use stock images that imply a different lodge.
- [ ] Add the FAQ entries as “Additional information”.
- [ ] Keep the current quoted-per-trip basis. Do not select a per-person price model until the owner approves and publishes that basis.

### GetYourGuide
- [ ] Same copy and meeting point as Viator.
- [ ] Add “Not suitable for” only where the website says the same (for example very young children on long driving days).
- [ ] Add the health and safety paragraph under “Additional information”.
- [ ] Link the listing to the canonical program page where the platform allows a supplier URL.

### TripAdvisor (Viator inventory)
- [ ] Claim the business page and match the name, address, phone and website exactly.
- [ ] Ask guests to review the specific product, not only the company.
- [ ] Reply to every review, including negative ones, with facts rather than marketing.

### Google Business Profile and Things to Do
- [ ] Claim the profile; set category to Travel agency / Tour operator.
- [ ] Use the same address (Pinguili, Watamu), phone and website.
- [ ] Add the four guide pages as “Posts” or site links so Google can associate the entity with costs, seasons, family travel and packing.
- [ ] Publish real photos and keep opening hours current.

### SafariBookings
- [ ] Create the operator profile with the same company facts.
- [ ] List each program with the same duration, parks and inclusions as the site.
- [ ] Keep the review count and rating identical to the numbers shown on the site. If the site shows no rating, do not add one to the profile.

## Review collection flow

Reviews are the strongest trust signal for AI answers, but only real, first-party reviews may be shown. Recommended flow:

1. On the last morning, the guide asks whether the guest is willing to review and sends the direct Google or TripAdvisor link by WhatsApp.
2. The booking system sends one follow-up message 48 hours after the trip ends (existing email/WhatsApp pipeline) with the same link. One reminder only.
3. Never offer a discount, upgrade or gift in exchange for a review.
4. When reviews exist, add them to the program page with a visible source and then — and only then — add \`AggregateRating\` to the structured data.

## Program listings
`;

const excursionAppendix = await readFile('docs/ota-excursion-listings.md', 'utf8').catch(() => '');
const body = header + '\n' + blocks.join('\n---\n\n') + (excursionAppendix ? `\n\n---\n\n${excursionAppendix}` : '');
await mkdir('docs', { recursive: true });
await writeFile('docs/ota-listing-kit.md', body);
console.log(`Wrote docs/ota-listing-kit.md with ${blocks.length} programs.`);
