import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper px-6 py-20 flex items-center justify-center">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Bahari Asili Safaris</p>
        <h1 className="mt-3 font-editorial text-4xl text-foreground">We could not find that page</h1>
        <p className="mt-4 text-muted-foreground leading-7">The page may have moved, or the address may no longer be available. You can return to the homepage or continue planning your Kenya journey.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="rounded-[2px] bg-ocean-700 px-6 py-3 font-semibold text-white hover:bg-ocean-800">Back to homepage</Link>
          <Link href="/contact" className="rounded-[2px] border border-border bg-white px-6 py-3 font-semibold text-foreground hover:bg-sand-100">Contact us</Link>
        </div>
      </section>
    </main>
  );
}
