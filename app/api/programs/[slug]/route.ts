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

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const locale = normalizeLocale(new URL(req.url).searchParams.get('locale'));
  const base = safaris.find((s) => s.id === params.slug);
  const data = await getCachedProgramRow(params.slug, locale);

  if (data) {
    return NextResponse.json({ success: true, program: base ? { ...base, ...rowToSafari(data) } : rowToSafari(data) });
  }

  // English is the only locale allowed to use the static canonical catalogue.
  // Other locales must have their own CMS translation row.
  if (locale === 'en' && base) {
    return NextResponse.json({ success: true, program: base });
  }

  return NextResponse.json(
    { success: false, error: locale === 'en' ? 'Program not found' : 'This safari is not yet available in the selected language' },
    { status: 404 }
  );
}
