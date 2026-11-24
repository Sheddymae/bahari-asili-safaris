export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

export function cleanMetaDescription(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').trim();
}

type DurationLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';
const DURATION_WORDS: Record<DurationLocale, { day: [string, string]; night: [string, string] }> = {
  en: { day: ['day', 'days'], night: ['night', 'nights'] },
  it: { day: ['giorno', 'giorni'], night: ['notte', 'notti'] },
  fr: { day: ['jour', 'jours'], night: ['nuit', 'nuits'] },
  es: { day: ['día', 'días'], night: ['noche', 'noches'] },
  de: { day: ['Tag', 'Tage'], night: ['Nacht', 'Nächte'] },
  ar: { day: ['يوم', 'أيام'], night: ['ليلة', 'ليالٍ'] },
  zh: { day: ['天', '天'], night: ['晚', '晚'] },
  sw: { day: ['siku', 'siku'], night: ['usiku', 'usiku'] },
};

export function durationLabel(count: number, unit: 'day' | 'night', locale: string = 'en'): string {
  const words = DURATION_WORDS[(locale in DURATION_WORDS ? locale : 'en') as DurationLocale][unit];
  return pluralize(count, words[0], words[1]);
}
