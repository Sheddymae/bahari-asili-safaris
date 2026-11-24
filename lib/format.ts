export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

export function cleanMetaDescription(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').trim();
}
