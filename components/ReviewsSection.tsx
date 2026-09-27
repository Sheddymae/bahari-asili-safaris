'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ExternalLink, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Review {
  author: string;
  rating: number;
  text: string;
  source: 'google' | 'tripadvisor';
  date?: string;
  avatar?: string;
}

export interface PlatformInfo {
  rating: number;
  totalReviews: number;
  url: string;
}

export const FALLBACK_TESTIMONIALS: Review[] = [];

async function fetchReviews(): Promise<{
  reviews: Review[];
  google: PlatformInfo | null;
  tripadvisor: PlatformInfo | null;
}> {
  try {
    const response = await fetch('/api/reviews', { cache: 'no-store' });
    if (!response.ok) return { reviews: [], google: null, tripadvisor: null };
    return await response.json();
  } catch {
    return { reviews: [], google: null, tripadvisor: null };
  }
}

export function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const starSize = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${starSize} ${n <= Math.round(rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const sourceLabel = review.source === 'google' ? 'Google' : 'TripAdvisor';

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {review.avatar ? (
            <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-ocean-100 flex items-center justify-center">
              <span className="font-poppins font-bold text-ocean-700 text-sm">
                {review.author.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-poppins font-semibold text-foreground text-sm">{review.author}</p>
            {review.date && <p className="font-inter text-xs text-muted-foreground">{review.date}</p>}
          </div>
        </div>
        <span className="font-inter text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0e7490]/10 text-primary">
          {sourceLabel}
        </span>
      </div>
      <Stars rating={review.rating} />
      <p className="font-inter text-sm text-foreground leading-relaxed mt-3 flex-1 line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

export function TestimonialCard({
  testimonial,
  review,
}: {
  testimonial?: Review;
  review?: Review;
}) {
  const item = review ?? testimonial;
  return item ? <ReviewCard review={item} /> : null;
}

function PlatformCard({
  platform,
  info,
  icon,
}: {
  platform: 'google' | 'tripadvisor';
  info: PlatformInfo | null;
  icon: React.ReactNode;
}) {
  if (!info) return null;
  const label = platform === 'google' ? 'Google' : 'TripAdvisor';

  return (
    <a
      href={info.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 bg-white rounded-2xl border border-border px-5 py-4 shadow-card transition-all hover:shadow-card-hover hover:border-[#0e7490]/30"
    >
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-poppins font-semibold text-foreground text-sm">{label}</span>
          <ExternalLink className="w-3 h-3 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Stars rating={info.rating} />
          <span className="font-inter text-sm font-bold text-foreground">{info.rating.toFixed(1)}</span>
          <span className="font-inter text-xs text-muted-foreground">({info.totalReviews} reviews)</span>
        </div>
      </div>
    </a>
  );
}

export default function ReviewsSection() {
  const { t } = useLanguage();
  const [reviewData, setReviewData] = useState<{
    reviews: Review[];
    google: PlatformInfo | null;
    tripadvisor: PlatformInfo | null;
  }>({ reviews: [], google: null, tripadvisor: null });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchReviews();
      if (!cancelled) {
        setReviewData(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allReviews = reviewData.reviews.slice(0, 6);
  const hasAny = allReviews.length > 0 || Boolean(reviewData.google) || Boolean(reviewData.tripadvisor);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const googleInfo = reviewData.google;
  const tripadvisorInfo = reviewData.tripadvisor;

  return (
    <section className="py-20 lg:py-28 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-safari-50 border border-safari-200 rounded-full px-4 py-1.5 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-safari-600" />
            <span className="font-inter text-xs font-semibold text-safari-700 uppercase tracking-wider">
              {t.reviews?.label || 'Reviews'}
            </span>
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
            {t.reviews?.title || 'What our travelers say'}
          </h2>
          <p className="font-inter text-muted-foreground text-base max-w-2xl mx-auto">
            {t.reviews?.subtitle || 'Real reviews from real travelers on Google and TripAdvisor'}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-24 mb-2" />
                    <div className="h-2 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="h-2 bg-muted rounded w-full mb-2" />
                <div className="h-2 bg-muted rounded w-3/4 mb-2" />
                <div className="h-2 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : !hasAny ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-white p-8 text-center shadow-card sm:p-10">
            <MessageSquare className="mx-auto mb-4 h-8 w-8 text-ocean-700" aria-hidden="true" />
            <h3 className="font-poppins text-xl font-bold text-foreground">
              {t.reviews?.comingSoon || 'Reviews from our guests'}
            </h3>
            <p className="mx-auto mt-2 max-w-xl font-inter text-sm leading-6 text-muted-foreground">
              {t.reviews?.comingSoonDesc || 'Guest reviews will appear here once connected to a verified review source.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {googleInfo?.url && (
                <a href={googleInfo.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-5 py-2.5 font-inter text-sm font-semibold text-foreground hover:border-ocean-500 hover:text-ocean-700">
                  Google
                </a>
              )}
              {tripadvisorInfo?.url && (
                <a href={tripadvisorInfo.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-5 py-2.5 font-inter text-sm font-semibold text-foreground hover:border-ocean-500 hover:text-ocean-700">
                  TripAdvisor
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
            {(googleInfo || tripadvisorInfo) && (
              <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                <PlatformCard platform="google" info={googleInfo} icon={<span aria-hidden="true">G</span>} />
                <PlatformCard platform="tripadvisor" info={tripadvisorInfo} icon={<span aria-hidden="true">T</span>} />
              </div>
            )}

            {allReviews.length > 0 && (
              <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-5">
                    {allReviews.map((review, i) => (
                      <div key={i} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-14px)] min-w-0">
                        <ReviewCard review={review} />
                      </div>
                    ))}
                  </div>
                </div>
                {(canScrollPrev || canScrollNext) && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev} aria-label="Previous reviews" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-ocean-600 hover:text-ocean-700 disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext} aria-label="Next reviews" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-ocean-600 hover:text-ocean-700 disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
