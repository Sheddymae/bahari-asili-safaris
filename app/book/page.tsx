import { redirect } from 'next/navigation';

export default async function LegacyBookPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; tour?: string }>;
}) {
  const params = await searchParams;
  const selectedTour = params.program || params.tour;

  redirect(selectedTour ? `/booking?tour=${encodeURIComponent(selectedTour)}` : '/booking');
}
