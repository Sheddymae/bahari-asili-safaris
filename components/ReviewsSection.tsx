'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getHomeLanding } from '@/lib/home-landing-i18n';

export interface Review {
  author: string;
  rating: number;
  text: string;
  source: 'google' | 'tripadvisor';
  date?: string;
  avatar?: string;
}
export interface PlatformInfo { rating: number; totalReviews: number; url: string; }
export const FALLBACK_TESTIMONIALS: Review[] = [];

async function fetchReviews(): Promise<{reviews:Review[];google:PlatformInfo|null;tripadvisor:PlatformInfo|null}> {
  try {
    const response = await fetch('/api/reviews', { cache: 'no-store' });
    if (!response.ok) return {reviews:[],google:null,tripadvisor:null};
    return await response.json();
  } catch { return {reviews:[],google:null,tripadvisor:null}; }
}

export function Stars({rating}:{rating:number}) {
  return <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>{[1,2,3,4,5].map(n=><Star key={n} className={`h-4 w-4 ${n<=Math.round(rating)?'fill-accent text-accent':'text-muted-foreground'}`} aria-hidden="true"/>)}</div>;
}

function ReviewCard({review}:{review:Review}) {
  return <article className="rounded-[4px] border border-border bg-white p-5">
    <div className="flex items-center justify-between gap-3">
      <div><p className="font-poppins text-sm font-semibold text-foreground">{review.author}</p>{review.date&&<p className="font-inter text-xs text-muted-foreground">{review.date}</p>}</div>
      <span className="border-l-2 border-safari-500 bg-sand-50 px-2.5 py-1 font-inter text-xs font-semibold text-ocean-700">{review.source==='google'?'Google':'TripAdvisor'}</span>
    </div>
    <Stars rating={review.rating}/>
    <p className="mt-3 font-inter text-sm leading-6 text-foreground">“{review.text}”</p>
  </article>;
}

function PlatformLink({info,label}:{info:PlatformInfo;label:string}) {
  if (!info.url) return null;
  return <a href={info.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[4px] border border-border bg-white px-4 py-2.5 font-inter text-sm font-semibold text-ocean-700 hover:border-ocean-300">
    {label}<ExternalLink className="h-4 w-4" aria-hidden="true"/>
  </a>;
}

export default function ReviewsSection() {
  const { locale } = useLanguage();
  const c = getHomeLanding(locale);
  const [data,setData]=useState<{reviews:Review[];google:PlatformInfo|null;tripadvisor:PlatformInfo|null}>({reviews:[],google:null,tripadvisor:null});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{const next=await fetchReviews();if(active){setData(next);setLoading(false);}})();return()=>{active=false;};},[]);
  if (loading) return null;\n  if (!data.reviews.length && !data.google?.url && !data.tripadvisor?.url) return null;\n  return <section aria-labelledby="reviews-title" className="bg-white py-16 lg:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-[0.18em] text-ocean-700"><span aria-hidden="true" className="h-0.5 w-6 bg-safari-500" />{c.reviews.kicker}</span>
        <h2 id="reviews-title" className="mt-2 font-poppins text-2xl font-bold text-foreground sm:text-3xl">{c.reviews.title}</h2>
      </div>
      {loading ? <div className="h-28 rounded-xl border border-border bg-sand-50 animate-pulse" aria-hidden="true"/> :
        data.reviews.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.reviews.slice(0,6).map((review,i)=><ReviewCard key={`${review.source}-${i}`} review={review}/>)}</div> :
        <div className="rounded-xl border border-border bg-sand-50 p-6">
          <p className="font-inter text-base leading-7 text-foreground">{data.google?.url||data.tripadvisor?.url ? c.reviews.empty : c.reviews.emptyNoLinks}</p>
          <div className="mt-4 flex flex-wrap gap-3"><>{data.google&&<PlatformLink info={data.google} label={c.reviews.google}/>}</>{data.tripadvisor&&<PlatformLink info={data.tripadvisor} label={c.reviews.tripadvisor}/>}</div>
        </div>}
    </div>
  </section>;
}
