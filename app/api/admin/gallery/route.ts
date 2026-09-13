import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// GET /api/admin/gallery — list all gallery images (including inactive) for the admin caption editor.
export async function GET() {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    console.error('Admin gallery: Supabase admin client unavailable:', err);
    return NextResponse.json(
      { success: false, error: 'Server is missing Supabase configuration (SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL).' },
      { status: 500 }
    );
  }

  const { data, error } = await admin
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Admin gallery fetch error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, images: data });
}

// PATCH /api/admin/gallery — update one image's caption / category / active flag.
// Body: { id: number, caption?: string, category?: string, active?: boolean }
export async function PATCH(req: NextRequest) {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    console.error('Admin gallery: Supabase admin client unavailable:', err);
    return NextResponse.json(
      { success: false, error: 'Server is missing Supabase configuration (SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL).' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { id, caption, category, active } = body || {};

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof caption === 'string') updates.caption = caption;
    if (typeof category === 'string') updates.category = category;
    if (typeof active === 'boolean') updates.active = active;

    const { data, error } = await admin
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Admin gallery update error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, image: data });
  } catch (err) {
    console.error('Admin gallery PATCH exception:', err);
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
