'use client';

import Link from 'next/link';
import { RefreshCw, MessageCircle } from 'lucide-react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ocean-700">Bahari Asili Safaris</p>
      <h1 className="text-3xl font-bold sm:text-4xl">We hit a small bump in the journey</h1>
      <p className="mt-4 text-slate-600">The page could not be loaded right now. Your booking information has not been changed.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => reset()} className="inline-flex items-center gap-2 rounded-xl bg-ocean-700 px-5 py-3 font-semibold text-white hover:bg-ocean-800">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
        <Link href="/" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50">Back home</Link>
        <a href="https://wa.me/254101923355" className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-3 font-semibold text-green-800">
          <MessageCircle className="h-4 w-4" /> WhatsApp us
        </a>
      </div>
    </main>
  );
}
