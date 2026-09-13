'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import TransfersSection from '@/components/TransfersSection';

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
      <TransfersSection onBook={openBooking} />
      {isBookingOpen && (
        <BookingModal isOpen={isBookingOpen} onClose={closeBooking} selectedTour={selectedTransfer} />
      )}
    </PageShell>
  );
}