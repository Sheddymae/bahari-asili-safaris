'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Bahari Asili page error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-sand-50 px-6 py-20 flex items-center justify-center">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-safari-600">Bahari Asili Safaris</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground leading-7">We could not load this page right now. Please try again, or return to the homepage if the problem continues.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => reset()} className="rounded-xl bg-ocean-700 px-6 py-3 font-semibold text-white hover:bg-ocean-800">Try again</button>
          <Link href="/" className="rounded-xl border border-border bg-white px-6 py-3 font-semibold text-foreground hover:bg-sand-100">Back to homepage</Link>
        </div>
      </section>
    </main>
  );
}
