'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, MessageSquareQuote, Star } from 'lucide-react';

type Booking = { id: number; booking_ref: string; safari_name: string; arrival_date: string; status: string; itinerary_snapshot: any };
type Review = { booking_id: number; booking_ref: string; safari_name: string; rating: number; review_text: string; created_at: string };
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://share.google/Y27Y4iXc0YimSaHjT';
const TRIPADVISOR_REVIEW_URL = process.env.NEXT_PUBLIC_TRIPADVISOR_REVIEW_URL || '';

export default function ReviewCenter({ bookings }: { bookings: Booking[] }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookingId, setBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/account/reviews', { cache: 'no-store' }).then(async response => {
      const data = await response.json();
      if (active && response.ok && data.success) setReviews(data.reviews || []);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const reviewed = useMemo(() => new Set(reviews.map(review => review.booking_id)), [reviews]);
  const eligibleBookings = bookings.filter(booking => {
    const date = new Date(booking.arrival_date + 'T00:00:00');
    return Number.isFinite(date.getTime()) && date.getTime() < Date.now() && !booking.status.toLowerCase().includes('cancel') && !reviewed.has(booking.id);
  });

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(''); setError('');
    try {
      const response = await fetch('/api/account/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: Number(bookingId), rating, text, authorName }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not submit review.');
      setReviews(previous => [data.review, ...previous]);
      setText(''); setBookingId(''); setRating(5);
      setMessage('Thank you. Your review is now displayed in the homepage testimonials.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not submit review.'); }
    finally { setBusy(false); }
  }

  return <section aria-labelledby="review-center-title" className="rounded-[4px] border bg-white p-5 sm:p-7">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-sand-100 text-ocean-700"><MessageSquareQuote className="h-5 w-5" /></div>
      <div className="min-w-0"><h2 id="review-center-title" className="text-xl font-bold">Guest review center</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Tell us about a completed trip. Your website testimonial will appear on the homepage after submission. You can also share a separate review on Google or TripAdvisor.</p></div>
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-ocean-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ocean-800">Review us on Google <ExternalLink className="h-4 w-4" /></a>
      {TRIPADVISOR_REVIEW_URL && <a href={TRIPADVISOR_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-border px-4 py-2.5 text-sm font-semibold text-ocean-700 hover:bg-sand-50">Review us on TripAdvisor <ExternalLink className="h-4 w-4" /></a>}
    </div>

    <form onSubmit={submitReview} className="mt-6 grid gap-4 border-t border-border pt-6">
      <h3 className="font-semibold">Share your trip experience</h3>
      {eligibleBookings.length ? <>
        <label className="grid gap-1.5 text-sm font-medium">Completed trip
          <select required value={bookingId} onChange={event => setBookingId(event.target.value)} className="min-h-11 w-full rounded-[4px] border border-border bg-white px-3 py-2">
            <option value="">Choose a booking</option>
            {eligibleBookings.map(booking => <option key={booking.id} value={booking.id}>{booking.itinerary_snapshot?.title || booking.safari_name} · {booking.booking_ref}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">Your name (optional)
          <input value={authorName} onChange={event => setAuthorName(event.target.value)} maxLength={100} className="min-h-11 w-full rounded-[4px] border border-border px-3 py-2" placeholder="Name shown with your review" />
        </label>
        <fieldset className="grid gap-2"><legend className="text-sm font-medium">Your rating</legend><div className="flex gap-1" role="radiogroup" aria-label="Your rating">{[1,2,3,4,5].map(value=><button key={value} type="button" role="radio" aria-checked={rating===value} aria-label={value + ' out of 5 stars'} onClick={()=>setRating(value)} className="rounded p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ocean-700"><Star className={value<=rating?'h-7 w-7 fill-amber-400 text-amber-500':'h-7 w-7 text-slate-300'} /></button>)}</div></fieldset>
        <label className="grid gap-1.5 text-sm font-medium">Your experience
          <textarea required minLength={10} maxLength={2000} rows={4} value={text} onChange={event => setText(event.target.value)} className="w-full rounded-[4px] border border-border px-3 py-2" placeholder="What did you enjoy? What could we improve?" />
          <span className="text-xs font-normal text-muted-foreground">{text.length}/2000 characters</span>
        </label>
        <button disabled={busy || !bookingId || text.trim().length < 10} className="min-h-11 justify-self-start rounded-[4px] bg-safari-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-safari-600 disabled:cursor-not-allowed disabled:opacity-60">{busy ? 'Submitting…' : 'Submit website review'}</button>
      </> : <p className="rounded-[4px] bg-sand-50 p-4 text-sm leading-6 text-foreground">{bookings.length ? 'Reviews open after the booked trip date. You have no eligible trips awaiting a review.' : 'Your bookings will appear here once you have a reservation on this account.'}</p>}
      {message && <p role="status" className="text-sm font-medium text-emerald-700">{message}</p>}
      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
    </form>

    {reviews.length > 0 && <div className="mt-6 border-t border-border pt-5"><h3 className="font-semibold">Your submitted reviews</h3><div className="mt-3 divide-y">{reviews.map(review=><article key={review.booking_id} className="py-3"><p className="font-medium">{review.safari_name} · {review.booking_ref}</p><div className="mt-1 flex gap-1" aria-label={review.rating + ' out of 5 stars'}>{[1,2,3,4,5].map(value=><Star key={value} className={value<=review.rating?'h-4 w-4 fill-amber-400 text-amber-500':'h-4 w-4 text-slate-300'} />)}</div><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/80">{review.review_text}</p><p className="mt-1 text-xs text-muted-foreground">Submitted {new Date(review.created_at).toLocaleDateString()}</p></article>)}</div></div>}
  </section>;
}
