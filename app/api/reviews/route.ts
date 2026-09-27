import { NextResponse } from 'next/server';

type Review = {
  author: string;
  rating: number;
  text: string;
  source: 'google' | 'tripadvisor';
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
    google: googlePlaceId ? {
      rating: 0,
      totalReviews: 0,
      url: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || '',
    } : null,
    tripadvisor: tripAdvisorLocationId ? {
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

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' },
  });
}
