'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const copy = {
  en: { title: 'Something went wrong', body: 'We could not load this page right now. Please try again, or return to the homepage if the problem continues.', retry: 'Try again', home: 'Back to homepage' },
  it: { title: 'Si è verificato un problema', body: 'Non è stato possibile caricare questa pagina. Riprova oppure torna alla home se il problema continua.', retry: 'Riprova', home: 'Torna alla home' },
  fr: { title: 'Un problème est survenu', body: 'Nous ne pouvons pas charger cette page pour le moment. Réessayez ou revenez à l’accueil si le problème persiste.', retry: 'Réessayer', home: 'Retour à l’accueil' },
  es: { title: 'Ha ocurrido un problema', body: 'No hemos podido cargar esta página. Inténtalo de nuevo o vuelve al inicio si el problema continúa.', retry: 'Intentar de nuevo', home: 'Volver al inicio' },
  de: { title: 'Etwas ist schiefgelaufen', body: 'Diese Seite konnte gerade nicht geladen werden. Versuche es erneut oder kehre zur Startseite zurück, wenn das Problem bestehen bleibt.', retry: 'Erneut versuchen', home: 'Zur Startseite' },
  ar: { title: 'حدث خطأ ما', body: 'تعذر تحميل هذه الصفحة الآن. حاول مرة أخرى أو عد إلى الصفحة الرئيسية إذا استمرت المشكلة.', retry: 'حاول مرة أخرى', home: 'العودة إلى الرئيسية' },
  zh: { title: '出现了一些问题', body: '目前无法加载此页面。请重试；如果问题仍然存在，请返回首页。', retry: '重试', home: '返回首页' },
  sw: { title: 'Kuna tatizo', body: 'Hatukuweza kupakia ukurasa huu kwa sasa. Tafadhali jaribu tena au rudi mwanzo ikiwa tatizo litaendelea.', retry: 'Jaribu tena', home: 'Rudi mwanzo' },
} as const;

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale } = useLanguage();
  const c = copy[locale as keyof typeof copy] || copy.en;

  useEffect(() => {
    console.error('Bahari Asili page error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-sand-50 px-6 py-20 flex items-center justify-center">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-safari-600">Bahari Asili Safaris</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">{c.title}</h1>
        <p className="mt-4 text-muted-foreground leading-7">{c.body}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => reset()} className="rounded-xl bg-ocean-700 px-6 py-3 font-semibold text-white hover:bg-ocean-800">{c.retry}</button>
          <Link href="/" className="rounded-xl border border-border bg-white px-6 py-3 font-semibold text-foreground hover:bg-sand-100">{c.home}</Link>
        </div>
      </section>
    </main>
  );
}
