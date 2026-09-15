/**
 * Explicit destination ownership for the regional safari catalogue.
 * Kept separate from SafariTab so the original four-tab catalogue remains
 * backwards compatible while every expanded destination has a deterministic
 * safari relationship.
 */
export const regionalSafariDestinations: Record<string, string[]> = {
  '2-day-samburu': ['samburu'],
  '4-day-samburu-ol-pejeta': ['samburu'],
  '3-day-mount-kenya': ['mount-kenya'],
  '4-day-mount-kenya-samburu': ['mount-kenya', 'samburu'],
  '3-day-serengeti': ['serengeti'],
  '5-day-serengeti-ngorongoro': ['serengeti', 'ngorongoro'],
  '3-day-ngorongoro': ['ngorongoro'],
  '3-day-tarangire': ['tarangire'],
  '5-day-tarangire-ngorongoro': ['tarangire', 'ngorongoro', 'serengeti'],
  '3-day-zanzibar': ['zanzibar'],
  '5-day-zanzibar': ['zanzibar'],
  '3-day-queen-elizabeth': ['queen-elizabeth'],
  '4-day-queen-elizabeth': ['queen-elizabeth'],
  '3-day-bwindi': ['bwindi'],
  '4-day-bwindi-lake-bunyonyi': ['bwindi'],
  '3-day-murchison-falls': ['murchison-falls'],
  '4-day-murchison-falls': ['murchison-falls'],
  '3-day-akagera': ['akagera'],
  '4-day-akagera': ['akagera'],
};

export function getRegionalSafariDestinationSlugs(safariId: string): string[] {
  return regionalSafariDestinations[safariId] ?? [];
}
