import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';
import { excursions } from '@/lib/tours-data';
import { normalizeLocale } from '@/lib/locale-content';

type ContentType = 'excursion' | 'safari_blu' | 'blog' | 'article' | 'news';

function allowedType(value: unknown): value is ContentType {
  return ['excursion', 'safari_blu', 'blog', 'article', 'news'].includes(String(value));
}

function staticRecord(item: any, type: ContentType) {
  return {
    id: item.id,
    content_type: type,
    slug: item.id,
    locale: 'en',
    title: item.name,
    excerpt: item.description,
    body: item.whatToExpect?.join('\n\n') || '',
    image: item.image,
    category: item.category,
    duration: item.duration,
    location: item.startingLocation,
    price: null,
    currency: 'KES',
    highlights: item.highlights || [],
    included: item.included || [],
    excluded: item.notIncluded || [],
    extra: {
      nameIt: item.nameIt,
      descriptionIt: item.descriptionIt,
      startingLocationIt: item.startingLocationIt,
      whatToExpectIt: item.whatToExpectIt,
      includedIt: item.includedIt,
      notIncludedIt: item.notIncludedIt,
      goodToKnow: item.goodToKnow,
      goodToKnowIt: item.goodToKnowIt,
      popular: !!item.popular,
    },
    status: 'published',
    featured: !!item.popular,
    author: null,
    tags: [],
    seo_title: null,
    seo_description: null,
    published_at: null,
  };
}

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') as ContentType | null;
    const locale = normalizeLocale(url.searchParams.get('locale'));
    if (type && !allowedType(type)) return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });

    const admin = getSupabaseAdmin();
    let query = admin.from('cms_content').select('*').eq('locale', locale).order('updated_at', { ascending: false });
    if (type) query = query.eq('content_type', type);
    const { data, error } = await query;
    if (error) throw new Error(error.message);

    let items: any[] = data || [];
    if (locale === 'en' && (!type || type === 'excursion' || type === 'safari_blu')) {
      const staticItems = excursions
        .filter((e) => !type || (type === 'safari_blu' ? e.id.startsWith('safari-blu-') : !e.id.startsWith('safari-blu-')))
        .map((e) => staticRecord(e, e.id.startsWith('safari-blu-') ? 'safari_blu' : 'excursion'));
      const overrides = new Map(items.map((x) => [x.slug, x]));
      items = staticItems.map((x) => overrides.get(x.slug) || x).concat(items.filter((x) => !staticItems.some((s) => s.slug === x.slug)));
    }

    return NextResponse.json({ success: true, items });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    if (!allowedType(body.content_type)) return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
    const title = String(body.title || '').trim();
    const slug = String(body.slug || '').trim().toLowerCase();
    if (!title || !slug) return NextResponse.json({ success: false, error: 'Title and slug are required.' }, { status: 400 });

    const locale = normalizeLocale(body.locale);
    const status = ['draft', 'published', 'archived'].includes(body.status) ? body.status : 'draft';
    const admin = getSupabaseAdmin();
    const row = {
      content_type: body.content_type,
      slug,
      locale,
      title,
      excerpt: body.excerpt || null,
      body: body.body || null,
      image: body.image || null,
      category: body.category || null,
      duration: body.duration || null,
      location: body.location || null,
      price: body.price === '' || body.price == null ? null : Number(body.price),
      currency: body.currency || 'KES',
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      included: Array.isArray(body.included) ? body.included : [],
      excluded: Array.isArray(body.excluded) ? body.excluded : [],
      extra: body.extra && typeof body.extra === 'object' ? body.extra : {},
      status,
      featured: !!body.featured,
      author: body.author || session.username || 'Admin',
      tags: Array.isArray(body.tags) ? body.tags : [],
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      published_at: status === 'published' ? (body.published_at || new Date().toISOString()) : null,
    };

    const { data, error } = await admin.from('cms_content').upsert(row, { onConflict: 'content_type,slug,locale' }).select().single();
    if (error) throw new Error(error.message);
    revalidateTag('cms-content');
    revalidateTag('programs');
    return NextResponse.json({ success: true, item: data });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed to save content' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!allowedType(body.content_type) || !body.slug) return NextResponse.json({ success: false, error: 'Content type and slug are required.' }, { status: 400 });
    const admin = getSupabaseAdmin();
    const { error } = await admin.from('cms_content').update({ status: 'archived' }).eq('content_type', body.content_type).eq('slug', body.slug).eq('locale', normalizeLocale(body.locale));
    if (error) throw new Error(error.message);
    revalidateTag('cms-content');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed to archive content' }, { status: 500 });
  }
}
