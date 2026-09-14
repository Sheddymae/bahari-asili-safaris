import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';

const BUCKET = 'bahari-media';
const MAX_BYTES = 10 * 1024 * 1024;
const CATEGORIES = ['safaris', 'excursions', 'safari_blu', 'blog', 'gallery', 'general'] as const;
type Category = typeof CATEGORIES[number];

function safeFilename(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';
}

function validCategory(value: unknown): value is Category {
  return CATEGORIES.includes(String(value) as Category);
}

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

async function ensureBucket(admin: ReturnType<typeof getSupabaseAdmin>) {
  const { data, error } = await admin.storage.getBucket(BUCKET);
  if (data) return;
  const created = await admin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] });
  if (created.error && !/already exists/i.test(created.error.message)) throw new Error(created.error.message);
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const admin = getSupabaseAdmin();
    let query = admin.from('cms_media').select('*').order('created_at', { ascending: false }).limit(300);
    if (validCategory(category)) query = query.eq('category', category);
    if (q) query = query.ilike('filename', `%${q}%`);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, items: data || [], categories: CATEGORIES });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to load media' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get('file');
    const categoryValue = form.get('category');
    const altText = String(form.get('alt_text') || '').trim();
    const category: Category = validCategory(categoryValue) ? categoryValue : 'general';

    if (!(file instanceof File)) return NextResponse.json({ success: false, error: 'Image file is required.' }, { status: 400 });
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) return NextResponse.json({ success: false, error: 'Only JPG, PNG, WebP and GIF images are allowed.' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ success: false, error: 'Image must be 10 MB or smaller.' }, { status: 400 });

    const admin = getSupabaseAdmin();
    await ensureBucket(admin);
    const filename = safeFilename(file.name);
    const storagePath = `${category}/${Date.now()}-${filename}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const upload = await admin.storage.from(BUCKET).upload(storagePath, bytes, { contentType: file.type, upsert: false });
    if (upload.error) throw new Error(upload.error.message);
    const publicUrl = admin.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;

    const { data, error } = await admin.from('cms_media').insert({ filename, storage_path: storagePath, public_url: publicUrl, mime_type: file.type, size_bytes: file.size, category, alt_text: altText || null, uploaded_by: session.username || 'Admin' }).select().single();
    if (error) {
      await admin.storage.from(BUCKET).remove([storagePath]);
      throw new Error(error.message);
    }
    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.id || !body.storage_path) return NextResponse.json({ success: false, error: 'Media id and storage path are required.' }, { status: 400 });
    const admin = getSupabaseAdmin();
    const removed = await admin.storage.from(BUCKET).remove([String(body.storage_path)]);
    if (removed.error) throw new Error(removed.error.message);
    const { error } = await admin.from('cms_media').delete().eq('id', body.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Delete failed' }, { status: 500 });
  }
}
