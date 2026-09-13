import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { safaris } from '@/lib/safari-catalogue';
import { normalizeLocale } from '@/lib/locale-content';
import { rowToSafari } from '@/lib/program-utils';

// Cached for 5 minutes per locale, tagged 'programs' so admin writes
// (app/api/admin/programs/route.ts) can bust it immediately via revalidateTag.
const getCachedProgramRows = unstable_cache(
  async (locale: string) => {
    try {
      const admin = getSupabaseAdmin();
      const { data } = await admin.from('safari_programs').select('*').eq('locale', locale);
      return data || [];
    } catch {
      return [];
    }
  },
  ['safari-programs-list'],
  { revalidate: 300, tags: ['programs'] }
);

export async function GET(req:NextRequest){try{const locale=normalizeLocale(new URL(req.url).searchParams.get('locale'));const rows=await getCachedProgramRows(locale);const map=new Map(rows.map(r=>[r.slug,r]));const base=safaris.map(s=>map.has(s.id)?{...s,...rowToSafari(map.get(s.id))}:s);const custom=rows.filter(r=>!safaris.some(s=>s.id===r.slug)).map(rowToSafari);return NextResponse.json({success:true,programs:[...base,...custom]});}catch(e){return NextResponse.json({success:false,error:'Failed to load programs'},{status:500});}}
