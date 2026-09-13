import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { safaris } from '@/lib/tours-data';
import { normalizeLocale } from '@/lib/locale-content';
import { rowToSafari } from '@/lib/program-utils';
export async function GET(req:NextRequest,{params}:{params:{slug:string}}){const locale=normalizeLocale(new URL(req.url).searchParams.get('locale'));const base=safaris.find(s=>s.id===params.slug);try{const admin=getSupabaseAdmin();const {data}=await admin.from('safari_programs').select('*').eq('slug',params.slug).eq('locale',locale).maybeSingle();if(data)return NextResponse.json({success:true,program:base?{...base,...rowToSafari(data)}:rowToSafari(data)}); }catch{}if(base)return NextResponse.json({success:true,program:base});return NextResponse.json({success:false,error:'Program not found'},{status:404});}
