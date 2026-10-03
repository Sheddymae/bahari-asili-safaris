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
  return <div className="flex items-center gap-0.5" aria-label={rating + ' out of 5 stars'}>{[1,2,3,4,5].map(n=><Star key={n} className={n<=Math.round(rating) ? 'h-4 w-4 fill-accent text-accent' : 'h-4 w-4 text-muted-foreground'} aria-hidden="true"/>)}</div>;
}

export default function ReviewsSection() {
  const { locale } = useLanguage();
  const c = getHomeLanding(locale);
  const [data,setData]=useState<{reviews:Review[];google:PlatformInfo|null;tripadvisor:PlatformInfo|null}>({reviews:[],google:null,tripadvisor:null});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{const next=await fetchReviews();if(active){setData(next);setLoading(false);}})();return()=>{active=false;};},[]);

  return (
    <section aria-labelledby="reviews-title" className="bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="editorial-label text-orange-600">{c.reviews.kicker}</p>
            <h2 id="reviews-title" className="mt-4 font-editorial text-5xl leading-none tracking-tight text-ink sm:text-6xl">{c.reviews.title}</h2>
          </div>
          <div>
            {loading ? <div className="h-40 border-y border-line animate-pulse" aria-hidden="true" /> :
              data.reviews.length ? (
                <div className="divide-y divide-line border-y border-line">
                  {data.reviews.slice(0, 4).map((review, i) => (
                    <article key={review.source + '-' + i} className="grid gap-5 py-7 sm:grid-cols-[8rem_1fr_auto] sm:items-start">
                      <div>
                        <p className="font-grotesk text-sm font-semibold text-ink">{review.author}</p>
                        {review.date && <p className="mt-1 font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-muted">{review.date}</p>}
                      </div>
                      <div>
                        <p className="font-editorial text-2xl leading-snug text-ink">“{review.text}”</p>
                        <div className="mt-3 flex items-center gap-3"><Stars rating={review.rating}/><span className="font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-muted">{review.source === 'google' ? 'Google' : 'TripAdvisor'}</span></div>
                      </div>
                      <span className="font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-ocean-600">0{i + 1}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border-y border-line py-8">
                  <p className="max-w-xl font-editorial text-2xl leading-snug text-ink">{data.google?.url || data.tripadvisor?.url ? c.reviews.empty : c.reviews.emptyNoLinks}</p>
                  <div className="mt-5 flex flex-wrap gap-5">
                    {data.google?.url && <a href={data.google.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-ocean-700 hover:text-orange-600">{c.reviews.google}<ExternalLink className="h-4 w-4" aria-hidden="true"/></a>}
                    {data.tripadvisor?.url && <a href={data.tripadvisor.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-ocean-700 hover:text-orange-600">{c.reviews.tripadvisor}<ExternalLink className="h-4 w-4" aria-hidden="true"/></a>}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
