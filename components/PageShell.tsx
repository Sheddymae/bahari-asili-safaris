'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const Footer = dynamic(() => import('@/components/Footer'));
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });

/**
 * Shared shell for every standalone Phase 2 page (About / Services /
 * Transfers / Partners / Contact / Tours / Blog). Keeps the same
 * Navbar + Footer + WhatsApp button the home page uses so navigating
 * between pages never feels like a different site.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
