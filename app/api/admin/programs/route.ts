import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { safaris } from '@/lib/safari-catalogue';
import { normalizeLocale } from '@/lib/locale-content';
import { safariToRow, rowToSafari, normalizeProgramBody } from '@/lib/program-utils';

export async function GET(req:NextRequest){
 try{const admin=getSupabaseAdmin();const locale=normalizeLocale(new URL(req.url).searchParams.get('locale'));const {data}=await admin.from('safari_programs').select('*').eq('locale',locale);const bySlug=new Map((data||[]).map((r:any)=>[r.slug,r]));return NextResponse.json({success:true,programs:safaris.map(s=>bySlug.has(s.id)?rowToSafari(bySlug.get(s.id)):s),custom:(data||[]).filter((r:any)=>!safaris.some(s=>s.id===r.slug)).map(rowToSafari)});}catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:'Failed to load programs'},{status:500});}}

export async function POST(req:NextRequest){
 try{const body=normalizeProgramBody(await req.json());if(!body.name)return NextResponse.json({success:false,error:'Program name is required.'},{status:400});const admin=getSupabaseAdmin();const row=safariToRow(body as any,body.locale);const {data,error}=await admin.from('safari_programs').upsert(row,{onConflict:'slug,locale'}).select().single();if(error)throw new Error(error.message);revalidateTag('programs');return NextResponse.json({success:true,program:rowToSafari(data)});}catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:'Failed to save program'},{status:500});}}

export async function DELETE(req:NextRequest){try{const body=await req.json();const admin=getSupabaseAdmin();const {error}=await admin.from('safari_programs').delete().eq('slug',String(body.slug)).eq('locale',normalizeLocale(body.locale));if(error)throw new Error(error.message);revalidateTag('programs');return NextResponse.json({success:true});}catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:'Failed to delete program'},{status:500});}}
