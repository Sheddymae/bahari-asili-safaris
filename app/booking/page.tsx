import BookingPageClient from './BookingPageClient';
import { safaris, excursions } from '@/lib/tours-data';

interface BookingPageProps {
  searchParams: { tour?: string };
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  const tourId = String(searchParams?.tour || '').trim();
  const safari = safaris.find((item) => item.id === tourId);
  const excursion = excursions.find((item) => item.id === tourId);
  const selectedTour = safari?.name || excursion?.name || tourId || '';

  return <BookingPageClient selectedTour={selectedTour} />;
}
