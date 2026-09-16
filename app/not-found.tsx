import Link from 'next/link';
import { ArrowLeft, Compass, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-ocean-50 p-5 text-ocean-700"><Compass className="h-10 w-10" /></div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-700">Bahari Asili Safaris</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">This trail leads somewhere else</h1>
      <p className="mt-4 max-w-xl text-slate-600">The page you are looking for may have moved, or the experience is no longer available. Explore our safaris and coastal experiences instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-ocean-700 px-5 py-3 font-semibold text-white hover:bg-ocean-800"><ArrowLeft className="h-4 w-4" /> Back home</Link>
        <Link href="/excursions" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50">Explore excursions</Link>
        <a href="https://wa.me/254101923355" className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-3 font-semibold text-green-800"><MessageCircle className="h-4 w-4" /> WhatsApp us</a>
      </div>
    </main>
  );
}
