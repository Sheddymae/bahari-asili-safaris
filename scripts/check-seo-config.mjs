import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const site = read('lib/site.ts');
const robots = read('app/robots.ts');
const sitemap = read('app/sitemap.ts');
const middleware = read('middleware.ts');
const tours = read('app/tours/page.tsx');

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
assert.match(middleware, /NextResponse\.redirect\(canonicalUrl, 308\)/);
assert.match(middleware, /X-Robots-Tag/);
assert.match(tours, /<noscript>/);
assert.match(tours, /safaris\.map/);
assert.match(tours, /excursions\.map/);
assert.equal(existsSync('public/robots.txt'), false, 'app/robots.ts must be the single robots source');

console.log('SEO configuration checks passed.');
