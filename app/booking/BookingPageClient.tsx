'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';

export default function BookingPageClient({ selectedTour }: { selectedTour: string }) {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-sand-50 px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-card">
          <p className="font-inter text-sm font-semibold uppercase tracking-widest text-safari-500">Bahari Asili Safaris</p>
          <h1 className="mt-3 font-poppins text-3xl font-bold text-foreground">Request your safari quote</h1>
          <p className="mx-auto mt-3 max-w-xl font-inter text-muted-foreground">
            Complete the booking form and we will create your booking reference and invoice for the requested trip.
          </p>
        </div>
      </main>
      <Footer />
      <BookingModal isOpen onClose={() => router.push('/')} selectedTour={selectedTour} />
    </>
  );
}
