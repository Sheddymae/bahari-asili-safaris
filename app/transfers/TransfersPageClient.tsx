'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import TransfersStackingCards from '@/components/TransfersStackingCards';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

export default function TransfersPageClient() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState('');

  const openBooking = useCallback((transferType: string) => {
    setSelectedTransfer(transferType);
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => setIsBookingOpen(false), []);

  return (
    <PageShell>
      <TransfersStackingCards onBook={openBooking} />
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={closeBooking}
          selectedTour={selectedTransfer}
        />
      )}
    </PageShell>
  );
}
