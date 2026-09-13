import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { safaris } from '@/lib/tours-data';
import { normalizeLocale } from '@/lib/locale-content';
import { rowToSafari } from '@/lib/program-utils';

export async function GET(req:NextRequest){try{const locale=normalizeLocale(new URL(req.url).searchParams.get('locale'));let rows:any[]=[];try{const admin=getSupabaseAdmin();const {data}=await admin.from('safari_programs').select('*').eq('locale',locale);rows=data||[];}catch{}const map=new Map(rows.map(r=>[r.slug,r]));const base=safaris.map(s=>map.has(s.id)?{...s,...rowToSafari(map.get(s.id))}:s);const custom=rows.filter(r=>!safaris.some(s=>s.id===r.slug)).map(rowToSafari);return NextResponse.json({success:true,programs:[...base,...custom]});}catch(e){return NextResponse.json({success:false,error:'Failed to load programs'},{status:500});}}
