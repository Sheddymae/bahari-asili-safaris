import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { excursions } from '@/lib/tours-data';
import { normalizeLocale } from '@/lib/locale-content';

const TYPES = ['excursion', 'safari_blu', 'blog', 'article', 'news'] as const;
type ContentType = typeof TYPES[number];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') as ContentType | null;
    const slug = url.searchParams.get('slug');
    const locale = normalizeLocale(url.searchParams.get('locale'));
    if (type && !TYPES.includes(type)) return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });

    const admin = getSupabaseAdmin();
    let query = admin.from('cms_content').select('*').eq('locale', locale).eq('status', 'published').order('published_at', { ascending: false });
    if (type) query = query.eq('content_type', type);
    if (slug) query = query.eq('slug', slug);
    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Until an existing static excursion is explicitly overridden in CMS,
    // keep it available to the public site. This preserves current content
    // while allowing admin edits to become the source of truth over time.
    if (locale === 'en' && (!type || type === 'excursion' || type === 'safari_blu')) {
      const dbBySlug = new Map((data || []).map((x: any) => [x.slug, x]));
      const staticItems = excursions
        .filter((e) => !type || (type === 'safari_blu' ? e.id.startsWith('safari-blu-') : !e.id.startsWith('safari-blu-')))
        .map((e) => ({
          id: e.id,
          content_type: e.id.startsWith('safari-blu-') ? 'safari_blu' : 'excursion',
          slug: e.id,
          locale: 'en',
          title: e.name,
          excerpt: e.description,
          body: e.whatToExpect?.join('\n\n') || '',
          image: e.image,
          category: e.category,
          duration: e.duration,
          location: e.startingLocation,
          price: null,
          currency: 'KES',
          highlights: e.highlights || [],
          included: e.included || [],
          excluded: e.notIncluded || [],
          extra: { nameIt: e.nameIt, descriptionIt: e.descriptionIt, startingLocationIt: e.startingLocationIt, whatToExpectIt: e.whatToExpectIt, includedIt: e.includedIt, notIncludedIt: e.notIncludedIt, goodToKnow: e.goodToKnow, goodToKnowIt: e.goodToKnowIt, popular: !!e.popular },
          status: 'published',
          featured: !!e.popular,
        }));
      const merged = staticItems.map((x) => dbBySlug.get(x.slug) || x).concat((data || []).filter((x: any) => !staticItems.some((s) => s.slug === x.slug)));
      return NextResponse.json({ success: true, items: slug ? merged.filter((x) => x.slug === slug) : merged });
    }

    return NextResponse.json({ success: true, items: data || [] });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed to load content' }, { status: 500 });
  }
}
