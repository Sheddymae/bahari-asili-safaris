#!/usr/bin/env node
import assert from 'node:assert/strict';

const base = new URL(process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bahariasilisafaris.co.ke');
const origin = base.origin;
const canonicalHostname = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bahariasilisafaris.co.ke').hostname;
const canonicalHosts = new Set([canonicalHostname, 'bahariasilisafaris.co.ke']);
const fetchText = async (url) => {
  const response = await fetch(url, { redirect: 'manual' });
  return { response, text: await response.text() };
};
const decodeXml = (value) => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'");

function localUrl(value) {
  const source = new URL(value);
  return new URL(source.pathname + source.search, origin);
}
function normalPath(value) {
  const path = new URL(value, origin).pathname;
  return path.length > 1 ? path.replace(/\/$/, '') : '/';
}
function isPublicPagePath(path) {
  if (/^\/(api|auth|admin|dashboard|account|login|signup)(\/|$)/.test(path)) return false;
  if (/\.[a-z0-9]{2,6}$/i.test(path)) return false;
  return true;
}
function wildcardDisallows(robotsText) {
  const disallows = [];
  let inWildcardGroup = false;
  for (const raw of robotsText.split(/\r?\n/)) {
    const line = raw.split('#')[0].trim();
    if (!line) continue;
    const agent = line.match(/^user-agent:\s*(.+)$/i);
    if (agent) {
      inWildcardGroup = agent[1].trim() === '*';
      continue;
    }
    if (!inWildcardGroup) continue;
    const rule = line.match(/^disallow:\s*(.*)$/i);
    if (rule?.[1]) disallows.push(rule[1].trim());
  }
  return disallows;
}

const { response: robotsResponse, text: robotsText } = await fetchText(new URL('/robots.txt', origin));
assert.equal(robotsResponse.status, 200, 'robots.txt must return 200');
assert.doesNotMatch(robotsText, /^host:/im, 'robots.txt must not contain a Host directive');
const sitemapDirective = robotsText.match(/^sitemap:\\s*(\\S+)/im)?.[1];
assert.ok(sitemapDirective, 'robots.txt must declare a sitemap');
const sitemapDirectiveUrl = new URL(sitemapDirective);
assert.equal(sitemapDirectiveUrl.pathname, '/sitemap.xml', 'robots sitemap path must be /sitemap.xml');
assert.equal(sitemapDirectiveUrl.hostname, canonicalHostname, 'robots sitemap host must be the canonical hostname');
const blockedPrefixes = wildcardDisallows(robotsText);
assert.ok(!blockedPrefixes.includes('/'), 'Wildcard robots rules must not block the entire site');

const { response: sitemapResponse, text: sitemapXml } = await fetchText(new URL('/sitemap.xml', origin));
assert.equal(sitemapResponse.status, 200, 'sitemap.xml must return 200');
const sitemapRaw = [
  ...[...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeXml(match[1])),
  ...[...sitemapXml.matchAll(/<xhtml:link[^>]+href="([^"]+)"/g)].map((match) => decodeXml(match[1])),
];
const sitemapUrls = [...new Map(sitemapRaw.map((url) => [localUrl(url).href, localUrl(url)])).values()];
assert.ok(sitemapUrls.length > 0, 'Sitemap must contain canonical and localized URLs');
const sitemapPaths = new Set(sitemapUrls.map((url) => normalPath(url.href)));

const failures = [];
const discoveredLinks = new Set();
let cursor = 0;
const workers = Array.from({ length: 6 }, async () => {
  while (cursor < sitemapUrls.length) {
    const url = sitemapUrls[cursor++];
    const path = normalPath(url.href);
    if (blockedPrefixes.some((prefix) => prefix && path.startsWith(prefix))) {
      failures.push(`robots.txt blocks sitemap URL: ${path}`);
      continue;
    }
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status !== 200) {
        failures.push(`Sitemap URL returned ${response.status}: ${path}`);
        continue;
      }
      const html = await response.text();
      for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
        const href = match[1].replaceAll('&amp;', '&');
        if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) continue;
        let target;
        try { target = new URL(href, url); } catch { continue; }
        if (target.origin !== origin && !canonicalHosts.has(target.hostname)) continue;
        const targetPath = normalPath(new URL(target.pathname + target.search, origin).href);
        if (isPublicPagePath(targetPath)) discoveredLinks.add(targetPath);
      }
    } catch (error) {
      failures.push(`Could not fetch ${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
});
await Promise.all(workers);

const missingFromSitemap = [...discoveredLinks].filter((path) => !sitemapPaths.has(path));
for (const path of missingFromSitemap) failures.push(`Internal public link missing from sitemap: ${path}`);

if (failures.length) {
  console.error('Sitemap crawl verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Sitemap crawl passed: ${sitemapUrls.length} canonical/localized URLs returned 200; ${discoveredLinks.size} internal public links were present in the sitemap and not blocked by robots.txt.`);
