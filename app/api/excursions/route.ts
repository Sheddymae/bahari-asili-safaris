import { NextRequest, NextResponse } from 'next/server';
import { getPublicExcursions, getPublicSafariBlu } from '@/lib/public-content';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const [excursions, safariBlu] = await Promise.all([getPublicExcursions(), getPublicSafariBlu()]);
    return NextResponse.json({ success: true, excursions: [...excursions, ...safariBlu] });
  } catch (error) {
    console.error('Public excursions API error:', error);
    return NextResponse.json({ success: false, excursions: [], error: 'Failed to load excursions' }, { status: 500 });
  }
}
