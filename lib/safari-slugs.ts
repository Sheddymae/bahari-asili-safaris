const DESCRIPTIVE_SLUGS: Record<string, string> = {
  experience: '2-day-tsavo-east-safari',
  inside: '3-day-tsavo-east-amboseli-safari',
  nala: '3-day-tsavo-east-taita-hills-safari',
  'simba-timon': '4-day-tsavo-amboseli-safari',
  zazu: '3-day-masai-mara-safari',
  twiga: '4-day-tsavo-taita-hills-amboseli-safari',
  rafiki: '5-day-tsavo-taita-hills-amboseli-safari',
  tumbili: '4-day-masai-mara-lake-nakuru-safari',
  tembo: '6-day-grand-kenya-safari',
  sarabi: '7-day-ultimate-kenya-safari',
  mufasa: '8-day-complete-kenya-safari',
};

export function safariRouteSlug(value: string | { id: string }): string {
  const id = typeof value === 'string' ? value : value.id;
  return DESCRIPTIVE_SLUGS[id] || id;
}

export function findSafariByRouteSlug<T extends { id: string }>(items: readonly T[], slug: string): T | undefined {
  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch { /* keep the original route segment */ }
  return items.find((item) => item.id === decoded || safariRouteSlug(item.id) === decoded);
}

export function descriptiveSafariPath(pathname: string): string | null {
  const match = pathname.match(/^\/safaris\/([^/]+)\/?$/);
  if (!match) return null;
  let legacyId = match[1];
  try { legacyId = decodeURIComponent(legacyId); } catch { /* keep the original segment */ }
  const target = DESCRIPTIVE_SLUGS[legacyId];
  return target ? `/safaris/${target}` : null;
}

export const safariSlugRedirects = Object.entries(DESCRIPTIVE_SLUGS).map(([source, destination]) => ({
  source: `/safaris/${source}`,
  destination: `/safaris/${destination}`,
}));
