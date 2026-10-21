import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

type Review = {
  author: string;
  rating: number;
  text: string;
  source: 'google' | 'tripadvisor' | 'website';
  date?: string;
  avatar?: string;
};

type PlatformInfo = { rating: number; totalReviews: number; url: string };

export async function GET() {
  const googleKey = process.env.GOOGLE_BUSINESS_API_KEY;
  const googlePlaceId = process.env.GOOGLE_PLACE_ID;
  const tripAdvisorKey = process.env.TRIPADVISOR_API_KEY;
  const tripAdvisorLocationId = process.env.TRIPADVISOR_LOCATION_ID;

  const result: { reviews: Review[]; google: PlatformInfo | null; tripadvisor: PlatformInfo | null } = {
    reviews: [],
    google: (googlePlaceId || process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL) ? {
      rating: 0,
      totalReviews: 0,
      url: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || '',
    } : null,
    tripadvisor: (tripAdvisorLocationId || process.env.NEXT_PUBLIC_TRIPADVISOR_REVIEW_URL) ? {
      rating: 0,
      totalReviews: 0,
      url: process.env.NEXT_PUBLIC_TRIPADVISOR_REVIEW_URL || '',
    } : null,
  };

  if (googleKey && googlePlaceId) {
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      url.searchParams.set('place_id', googlePlaceId);
      url.searchParams.set('fields', 'reviews,rating,user_ratings_total,url');
      url.searchParams.set('key', googleKey);
      const response = await fetch(url, { next: { revalidate: 900 } });
      const data = await response.json();
      if (data.result) {
        result.google = {
          rating: Number(data.result.rating || 0),
          totalReviews: Number(data.result.user_ratings_total || 0),
          url: data.result.url || result.google?.url || '',
        };
        result.reviews.push(...(data.result.reviews || []).slice(0, 5).map((review: any) => ({
          author: String(review.author_name || 'Google traveller'),
          rating: Number(review.rating || 0),
          text: String(review.text || ''),
          source: 'google' as const,
          date: review.time ? new Date(review.time * 1000).toISOString() : undefined,
          avatar: review.profile_photo_url || undefined,
        })).filter((review: Review) => review.text));
      }
    } catch (error) {
      console.error('Google review provider failed:', error);
    }
  }

  if (tripAdvisorKey && tripAdvisorLocationId) {
    try {
      const url = `https://api.tripadvisor.com/api/partner/2.0/location/${encodeURIComponent(tripAdvisorLocationId)}/reviews?key=${encodeURIComponent(tripAdvisorKey)}`;
      const response = await fetch(url, { next: { revalidate: 900 } });
      const data = await response.json();
      result.tripadvisor = {
        rating: Number(data.rating || 0),
        totalReviews: Number(data.num_reviews || 0),
        url: data.web_url || result.tripadvisor?.url || '',
      };
      result.reviews.push(...(data.reviews || []).slice(0, 5).map((review: any) => ({
        author: String(review.author || 'TripAdvisor traveller'),
        rating: Number(review.rating || 0),
        text: String(review.text || ''),
        source: 'tripadvisor' as const,
        date: review.published_date ? String(review.published_date) : undefined,
      })).filter((review: Review) => review.text));
    } catch (error) {
      console.error('TripAdvisor review provider failed:', error);
    }
  }

  // Website testimonials submitted by verified customer accounts.
  // The public RLS policy exposes published reviews only; provider reviews remain independently sourced.
  try {
    const supabase = await createSupabaseServerClient();
    const { data: websiteReviews, error } = await supabase.from('customer_reviews')
      .select('author_name,rating,review_text,created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6);
    if (error) {
      // Migration may not have been applied in a given environment; preserve external reviews.
      console.warn('Website testimonials are unavailable:', error.message);
    } else {
      result.reviews.push(...(websiteReviews || []).map((review: any) => ({
        author: String(review.author_name || 'Guest'),
        rating: Number(review.rating || 0),
        text: String(review.review_text || ''),
        source: 'website' as const,
        date: review.created_at ? String(review.created_at) : undefined,
      })).filter((review: Review) => review.text && review.rating >= 1 && review.rating <= 5));
    }
  } catch (error) {
    console.warn('Could not load website testimonials:', error);
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' },
  });
}
