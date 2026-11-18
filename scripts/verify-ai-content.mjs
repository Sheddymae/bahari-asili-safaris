#!/usr/bin/env node
/**
 * Phase 8 verification: proves that every program page contains its
 * answer-first sections and JSON-LD in the raw HTML, with no JavaScript.
 *
 * Usage (with a production server running):
 *   BASE_URL=http://127.0.0.1:3000 node scripts/verify-ai-content.mjs
 */
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const UA = 'Mozilla/5.0 (compatible; BahariContentCheck/1.0; +https://www.bahariasilisafaris.co.ke)';

const REQUIRED_SECTIONS = [
  ['overview', 'Answer capsule and quick facts'],
  ['cost', 'Cost answer'],
  ['best-time', 'Best-time answer and month table'],
  ['with-children', 'Children answer'],
  ['mobility', 'Older travellers and mobility answer'],
  ['packing', 'Packing answer'],
  ['health-safety', 'Health and safety answer'],
  ['faq', 'Visible FAQ'],
];

const failures = [];
let checked = 0;

function fail(page, message) {
  failures.push(`${page}: ${message}`);
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'user-agent': UA } });
  return { status: res.status, text: await res.text(), type: res.headers.get('content-type') || '' };
}

function count(html, needle) {
  return html.split(needle).length - 1;
}

async function main() {
  const sitemap = await get('/sitemap.xml');
  if (sitemap.status !== 200) fail('/sitemap.xml', `status ${sitemap.status}`);
  const programPaths = [...sitemap.text.matchAll(/<loc>([^<]*\/safaris\/[^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (programPaths.length === 0) fail('/sitemap.xml', 'no program URLs found');

  for (const path of programPaths) {
    const page = await get(path);
    checked += 1;
    if (page.status !== 200) {
      fail(path, `status ${page.status}`);
      continue;
    }
    for (const [id] of REQUIRED_SECTIONS) {
      if (!page.text.includes(`id="${id}"`)) fail(path, `missing section #${id}`);
    }
    if (!page.text.includes('id="faq"')) fail(path, 'missing visible FAQ');
    if ((page.text.match(/<h1[\s>]/g) || []).length !== 1) {
      fail(path, `expected exactly one <h1>, found ${(page.text.match(/<h1[\s>]/g) || []).length}`);
    }
    if (count(page.text, '"@type":"FAQPage"') < 1) fail(path, 'missing FAQPage JSON-LD');
    if (count(page.text, '"@type":"TouristTrip"') < 1) fail(path, 'missing TouristTrip JSON-LD');
    if (count(page.text, '"@type":"BreadcrumbList"') < 1) fail(path, 'missing BreadcrumbList JSON-LD');
    if (!page.text.includes('"@type":"Question"')) fail(path, 'FAQPage has no Question entries');
    if (page.text.includes('"@type":"Offer"') || page.text.includes('priceSpecification')) {
      fail(path, 'emits a price Offer without a reviewed published price');
    }
    if (!page.text.includes('Quoted per trip')) fail(path, 'missing quote-basis price statement');
    if ((page.text.match(/✓/g) || []).length < 5) fail(path, 'cost section has no included item list');
    if ((page.text.match(/✕/g) || []).length < 3) fail(path, 'cost section has no excluded item list');
    if (!page.text.includes('Malaria')) fail(path, 'missing malaria guidance');
  }

  for (const path of ['/llms.txt', '/robots.txt', '/guides', ...(await guidePaths()), ...programPaths.slice(0, 3).map((p) => `/programs${p.replace('/safaris', '')}.md`)]) {
    const page = await get(path);
    checked += 1;
    if (page.status !== 200) fail(path, `status ${page.status}`);
  }

  const robots = await get('/robots.txt');
  for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'Applebot']) {
    if (!robots.text.includes(bot)) fail('/robots.txt', `missing rule for ${bot}`);
  }
  if (robots.text.includes('Disallow: /$') || robots.text.includes('Disallow: /\n')) fail('/robots.txt', 'blocks the whole site');

  const llms = await get('/llms.txt');
  if (!/\/safaris\//.test(llms.text) || !/\/guides\//.test(llms.text)) fail('/llms.txt', 'missing program or guide links');

  const markdown = await get(`/programs${programPaths[0].replace('/safaris', '')}`);
  if (!markdown.type.includes('text/markdown')) fail('/programs/*', `expected text/markdown, got ${markdown.type}`);
  for (const heading of ['## How much does', '## When is the best time', '## Is the ', '## What should I pack', '## Frequently asked questions']) {
    if (!markdown.text.includes(heading)) fail('/programs/*', `markdown missing "${heading}"`);
  }

  console.log(`Checked ${checked} URLs (${programPaths.length} program pages).`);
  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    failures.forEach((line) => console.error(` - ${line}`));
    process.exit(1);
  }
  console.log('All program pages contain the required sections and JSON-LD in raw HTML.');
}

async function guidePaths() {
  const index = await get('/guides');
  return [...index.text.matchAll(/href="(\/guides\/[^"]+)"/g)].map((m) => m[1]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
