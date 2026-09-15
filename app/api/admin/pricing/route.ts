import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { defaultPricingConfig } from '@/lib/managed-safari-pricing';

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const admin = getSupabaseAdmin();
    const [{ data: destinations, error: destinationError }, { data: currencies, error: currencyError }] = await Promise.all([
      admin.from('safari_pricing_settings').select('*').order('destination_slug'),
      admin.from('safari_currency_settings').select('*').order('currency'),
    ]);
    if (destinationError) throw destinationError;
    if (currencyError) throw currencyError;
    return NextResponse.json({ success: true, destinations: destinations || [], currencies: currencies || [], defaults: defaultPricingConfig() });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Could not load pricing settings.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const admin = getSupabaseAdmin();
    const destinationRows = Array.isArray(body.destinations) ? body.destinations : [];
    const currencyRows = Array.isArray(body.currencies) ? body.currencies : [];

    const cleanDestinations = destinationRows.map((row: Record<string, unknown>) => ({
      destination_slug: String(row.destination_slug),
      accommodation_per_night: Math.max(0, Number(row.accommodation_per_night) || 0),
      park_fee_adult_per_day: Math.max(0, Number(row.park_fee_adult_per_day) || 0),
      park_fee_child_per_day: Math.max(0, Number(row.park_fee_child_per_day) || 0),
      guide_vehicle_per_day: Math.max(0, Number(row.guide_vehicle_per_day) || 0),
      meals_adult_per_day: Math.max(0, Number(row.meals_adult_per_day) || 0),
      meals_child_per_day: Math.max(0, Number(row.meals_child_per_day) || 0),
      pricing_mode: row.pricing_mode === 'benchmark' ? 'benchmark' : 'manual',
      competitor_reference: Math.max(0, Number(row.competitor_reference) || 0),
      target_markup_percent: Math.max(-100, Math.min(500, Number(row.target_markup_percent) || 0)),
      active: row.active !== false,
      updated_at: new Date().toISOString(),
    }));

    const cleanCurrencies = currencyRows
      .filter((row: Record<string, unknown>) => ['KES', 'USD', 'EUR'].includes(String(row.currency)))
      .map((row: Record<string, unknown>) => ({
        currency: String(row.currency),
        kes_per_unit: String(row.currency) === 'KES' ? 1 : Math.max(0.0001, Number(row.kes_per_unit) || 1),
        active: row.active !== false,
        updated_at: new Date().toISOString(),
      }));

    if (cleanDestinations.length) {
      const { error } = await admin.from('safari_pricing_settings').upsert(cleanDestinations, { onConflict: 'destination_slug' });
      if (error) throw error;
    }
    if (cleanCurrencies.length) {
      const { error } = await admin.from('safari_currency_settings').upsert(cleanCurrencies, { onConflict: 'currency' });
      if (error) throw error;
    }
    return NextResponse.json({ success: true, updatedBy: session.username });
  } catch (error) {
    console.error('Admin pricing update failed:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Could not save pricing settings.' }, { status: 500 });
  }
}
