import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { safaris } from '@/lib/safari-catalogue';
import { normalizeLocale } from '@/lib/locale-content';
import { rowToSafari } from '@/lib/program-utils';

const getCachedProgramRow = unstable_cache(
  async (slug: string, locale: string) => {
    try {
      const admin = getSupabaseAdmin();
      const { data } = await admin.from('safari_programs').select('*').eq('slug', slug).eq('locale', locale).maybeSingle();
      return data || null;
    } catch {
      return null;
    }
  },
  ['safari-program-by-slug'],
  { revalidate: 300, tags: ['programs'] }
);

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const locale = normalizeLocale(new URL(req.url).searchParams.get('locale'));
  const base = safaris.find((s) => s.id === slug);
  const data = await getCachedProgramRow(slug, locale);

  if (data) {
    return NextResponse.json({ success: true, program: base ? { ...base, ...rowToSafari(data) } : rowToSafari(data) });
  }

  // Static catalogue entries are localized in SafariDetailClient through the
  // dedicated static content layer. This is not an English fallback: the
  // client replaces customer-facing content for every supported locale.
  if (base) {
    return NextResponse.json({ success: true, program: base, staticLocalization: locale !== 'en' });
  }

  return NextResponse.json({ success: false, error: 'Program not found' }, { status: 404 });
}
