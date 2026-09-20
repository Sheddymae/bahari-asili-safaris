import BookingPageClient from './BookingPageClient';
import { safaris, excursions } from '@/lib/tours-data';

interface BookingPageProps {
  searchParams: Promise<{ tour?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { tour } = await searchParams;
  const tourId = String(tour || '').trim();
  const safari = safaris.find((item) => item.id === tourId);
  const excursion = excursions.find((item) => item.id === tourId);
  const selectedTour = safari?.name || excursion?.name || tourId || '';

  return <BookingPageClient selectedTour={selectedTour} />;
}
