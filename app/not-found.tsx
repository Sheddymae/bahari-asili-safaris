'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const copy = {
  en: { title: 'We could not find that page', body: 'The page may have moved, or the address may no longer be available. You can return to the homepage or continue planning your Kenya journey.', home: 'Back to homepage', contact: 'Contact us' },
  it: { title: 'Pagina non trovata', body: 'La pagina potrebbe essere stata spostata o l’indirizzo non è più disponibile. Puoi tornare alla home o continuare a pianificare il tuo viaggio in Kenya.', home: 'Torna alla home', contact: 'Contattaci' },
  fr: { title: 'Page introuvable', body: 'La page a peut-être été déplacée ou cette adresse n’est plus disponible. Vous pouvez revenir à l’accueil ou continuer à préparer votre voyage au Kenya.', home: 'Retour à l’accueil', contact: 'Nous contacter' },
  es: { title: 'No encontramos esa página', body: 'La página puede haber cambiado de dirección o ya no estar disponible. Puedes volver al inicio o continuar planificando tu viaje a Kenia.', home: 'Volver al inicio', contact: 'Contáctanos' },
  de: { title: 'Seite nicht gefunden', body: 'Die Seite wurde möglicherweise verschoben oder diese Adresse ist nicht mehr verfügbar. Kehre zur Startseite zurück oder plane deine Kenia-Reise weiter.', home: 'Zur Startseite', contact: 'Kontakt' },
  ar: { title: 'لم نتمكن من العثور على الصفحة', body: 'ربما تم نقل الصفحة أو لم يعد هذا العنوان متاحاً. يمكنك العودة إلى الصفحة الرئيسية أو متابعة التخطيط لرحلتك إلى كينيا.', home: 'العودة إلى الرئيسية', contact: 'اتصل بنا' },
  zh: { title: '找不到此页面', body: '该页面可能已移动，或此地址已不再可用。您可以返回首页，继续规划您的肯尼亚之旅。', home: '返回首页', contact: '联系我们' },
  sw: { title: 'Ukurasa haukupatikana', body: 'Huenda ukurasa umehamishwa au anwani hii haipatikani tena. Unaweza kurudi mwanzo au kuendelea kupanga safari yako ya Kenya.', home: 'Rudi mwanzo', contact: 'Wasiliana nasi' },
} as const;

export default function NotFound() {
  const { locale } = useLanguage();
  const c = copy[locale as keyof typeof copy] || copy.en;
  return (
    <main className="min-h-screen bg-sand-50 px-6 py-20 flex items-center justify-center">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-safari-600">Bahari Asili Safaris</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">{c.title}</h1>
        <p className="mt-4 text-muted-foreground leading-7">{c.body}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="rounded-xl bg-ocean-700 px-6 py-3 font-semibold text-white hover:bg-ocean-800">{c.home}</Link>
          <Link href="/contact" className="rounded-xl border border-border bg-white px-6 py-3 font-semibold text-foreground hover:bg-sand-100">{c.contact}</Link>
        </div>
      </section>
    </main>
  );
}
