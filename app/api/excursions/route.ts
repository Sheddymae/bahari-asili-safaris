import { NextRequest, NextResponse } from 'next/server';
import { getPublicExcursions } from '@/lib/public-content';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    return NextResponse.json({ success: true, excursions: await getPublicExcursions() });
  } catch (error) {
    console.error('Public excursions API error:', error);
    return NextResponse.json({ success: false, excursions: [], error: 'Failed to load excursions' }, { status: 500 });
  }
}
