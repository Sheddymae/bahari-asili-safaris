import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { excursions, type Excursion } from '@/lib/tours-data';
import { safaris } from '@/lib/safari-catalogue';
import { normalizeLocale } from '@/lib/locale-content';
import { mergeProgram, rowToSafari } from '@/lib/program-utils';

type CmsRow = any;

function toExcursion(row: CmsRow, fallback?: Excursion): Excursion {
  const extra = row.extra || {};
  return {
    ...(fallback || {}),
    id: row.slug,
    name: row.title,
    nameIt: extra.nameIt || fallback?.nameIt,
    duration: row.duration || fallback?.duration || '',
    image: row.image || fallback?.image || '',
    description: row.excerpt || fallback?.description || '',
    descriptionIt: extra.descriptionIt || fallback?.descriptionIt,
    popular: row.featured ?? fallback?.popular,
    highlights: Array.isArray(row.highlights) ? row.highlights : (fallback?.highlights || []),
    category: row.category || fallback?.category || 'nature',
    startingLocation: row.location || fallback?.startingLocation || 'Pick-up from your hotel in Watamu',
    startingLocationIt: extra.startingLocationIt || fallback?.startingLocationIt,
    whatToExpect: row.body ? row.body.split(/\n\s*\n/).map((x: string) => x.trim()).filter(Boolean) : (fallback?.whatToExpect || []),
    whatToExpectIt: extra.whatToExpectIt || fallback?.whatToExpectIt,
    included: Array.isArray(row.included) ? row.included : (fallback?.included || []),
    includedIt: extra.includedIt || fallback?.includedIt,
    notIncluded: Array.isArray(row.excluded) ? row.excluded : (fallback?.notIncluded || []),
    notIncludedIt: extra.notIncludedIt || fallback?.notIncludedIt,
    goodToKnow: extra.goodToKnow || fallback?.goodToKnow,
    goodToKnowIt: extra.goodToKnowIt || fallback?.goodToKnowIt,
  } as Excursion;
}

export async function getPublicExcursions(): Promise<Excursion[]> {
  const staticItems = excursions.filter(e => !e.id.startsWith('safari-blu-'));
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from('cms_content').select('*').eq('content_type', 'excursion').eq('locale', 'en').eq('status', 'published');
    if (error) return staticItems;
    const bySlug = new Map((data || []).map((row: CmsRow) => [row.slug, row]));
    const merged = staticItems.map(item => bySlug.has(item.id) ? toExcursion(bySlug.get(item.id), item) : item);
    const existing = new Set(staticItems.map(x => x.id));
    return merged.concat((data || []).filter((row: CmsRow) => !existing.has(row.slug)).map((row: CmsRow) => toExcursion(row)));
  } catch {
    return staticItems;
  }
}

export async function getPublicSafariBlu(): Promise<Excursion[]> {
  const staticItems = excursions.filter(e => e.id.startsWith('safari-blu-'));
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from('cms_content').select('*').eq('content_type', 'safari_blu').eq('locale', 'en').eq('status', 'published');
    if (error) return staticItems;
    const bySlug = new Map((data || []).map((row: CmsRow) => [row.slug, row]));
    const merged = staticItems.map(item => bySlug.has(item.id) ? toExcursion(bySlug.get(item.id), item) : item);
    const existing = new Set(staticItems.map(x => x.id));
    return merged.concat((data || []).filter((row: CmsRow) => !existing.has(row.slug)).map((row: CmsRow) => toExcursion(row)));
  } catch {
    return staticItems;
  }
}


export async function getPublicSafaris(locale: string = 'en') {
  const normalized = normalizeLocale(locale);
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from('safari_programs').select('*').eq('locale', normalized);
    if (error) throw error;
    const rows = data || [];
    const map = new Map(rows.map((r: any) => [r.slug, r]));
    if (normalized === 'en') return safaris.map((s) => map.has(s.id) ? mergeProgram(s, map.get(s.id)) : s);
    return rows.map(rowToSafari);

  } catch {
    return [];
  }
}
