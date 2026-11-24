import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const site = read('lib/site.ts');
const robots = read('app/robots.ts');
const sitemap = read('app/sitemap.ts');
const middleware = read('middleware.ts');
const tours = read('app/tours/page.tsx');
const rootLayout = read('app/layout.tsx');
const safariPage = read('app/safaris/[slug]/page.tsx');
const safariSlugs = read('lib/safari-slugs.ts');
const programMarkdownRoute = read('app/programs/[slug]/route.ts');
const excursionsApi = read('app/api/excursions/route.ts');
const programSchema = read('components/ProgramStructuredData.tsx');
const otaGenerator = read('scripts/build-ota-kit.mjs');

assert.match(site, /https:\/\/www\.bahariasilisafaris\.co\.ke/);
assert.match(site, /NEXT_PUBLIC_SITE_URL/);
assert.match(robots, /IS_PRODUCTION_DEPLOYMENT/);
assert.match(robots, /disallow: '\/'/);
assert.match(robots, /PRIVATE_PATHS/);
assert.doesNotMatch(robots, /\bhost\s*:/i);
assert.match(sitemap, /SITE_URL/);
for (const route of ['/about', '/contact', '/faq', '/blog', '/destinations', '/tours', '/excursions', '/transfers', '/services', '/travel-guide', '/guides', '/terms', '/privacy']) {
  assert.ok(sitemap.includes(route), `Missing public route in sitemap: ${route}`);
}
assert.match(sitemap, /publicSafaris\.map/);
assert.match(sitemap, /publicExcursions\.map/);
assert.match(sitemap, /publishedBlogPosts\.map/);
assert.match(sitemap, /publicSafariBlu\.map/);
assert.match(sitemap, /safariRouteSlug/);
assert.match(sitemap, /lastReviewedAt/);
assert.doesNotMatch(sitemap, /priority:|changeFrequency:/);
assert.match(middleware, /NextResponse\.redirect\(canonicalUrl, 308\)/);
assert.match(middleware, /X-Robots-Tag/);
assert.match(middleware, /descriptiveSafariPath/);
assert.match(middleware, /NextResponse\.redirect\(redirectUrl, 301\)/);
assert.match(rootLayout, /template: '%s \| Bahari Asili Safaris'/);
assert.match(rootLayout, /localizedPath\(pathname, locale\)/);
assert.doesNotMatch(rootLayout, /keywords:/);
assert.match(safariPage, /twitter:/);
assert.match(safariPage, /type: 'website'/);
assert.match(safariSlugs, /2-day-tsavo-east-safari/);
assert.match(safariSlugs, /8-day-complete-kenya-safari/);
assert.match(programMarkdownRoute, /findSafariByRouteSlug/);
assert.match(programMarkdownRoute, /Response\.redirect/);
assert.match(excursionsApi, /getPublicSafariBlu/);
assert.doesNotMatch(programSchema, /AggregateRating|Offer/);
assert.match(otaGenerator, /ota-excursion-listings\.md/);
assert.match(tours, /<noscript>/);
assert.match(tours, /safaris\.map/);
assert.match(tours, /excursions\.map/);
assert.equal(existsSync('public/robots.txt'), false, 'app/robots.ts must be the single robots source');

console.log('SEO configuration checks passed.');
