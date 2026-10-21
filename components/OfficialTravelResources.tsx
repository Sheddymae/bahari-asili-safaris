'use client';

import { ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const copy = {
  en: { eyebrow: 'Official travel resources', title: 'Check Kenya entry requirements before you fly', intro: 'Entry rules depend on your passport and circumstances and may change. Use the official government portal to check whether you need an Electronic Travel Authorisation (eTA), confirm any exemptions, and review the latest instructions before applying.', eta: 'Kenya Electronic Travel Authorisation (eTA)', etaText: 'Check eligibility, exemptions, requirements and application guidance on the official portal.', tra: 'Tourism Regulatory Authority (TRA)', traText: 'Official information about tourism regulation in Kenya.', note: 'Bahari Asili Safaris is not a government immigration authority. These links are provided for convenience; always follow current official instructions. Do not rely on this guide as a guarantee of entry or approval.', action: 'Open official website' },
  it: { eyebrow: 'Risorse ufficiali per il viaggio', title: 'Verifica i requisiti d’ingresso in Kenya prima di partire', intro: 'Le regole d’ingresso dipendono dal passaporto e dalla situazione personale e possono cambiare. Consulta il portale governativo ufficiale per verificare se ti serve un’Electronic Travel Authorisation (eTA), controllare eventuali esenzioni e leggere le istruzioni aggiornate.', eta: 'Autorizzazione elettronica di viaggio per il Kenya (eTA)', etaText: 'Verifica idoneità, esenzioni, requisiti e istruzioni per la domanda sul portale ufficiale.', tra: 'Tourism Regulatory Authority (TRA)', traText: 'Informazioni ufficiali sulla regolamentazione del turismo in Kenya.', note: 'Bahari Asili Safaris non è un’autorità governativa per l’immigrazione. I link sono forniti per comodità; segui sempre le istruzioni ufficiali aggiornate. Questa guida non garantisce l’ingresso o l’approvazione.', action: 'Apri il sito ufficiale' },
  fr: { eyebrow: 'Ressources officielles de voyage', title: 'Vérifiez les conditions d’entrée au Kenya avant le départ', intro: 'Les règles d’entrée dépendent du passeport et de la situation de chaque voyageur et peuvent changer. Consultez le portail gouvernemental officiel pour vérifier si une autorisation électronique de voyage (eTA) est nécessaire, les éventuelles exemptions et les instructions à jour.', eta: 'Autorisation électronique de voyage au Kenya (eTA)', etaText: 'Vérifiez l’éligibilité, les exemptions, les exigences et les instructions sur le portail officiel.', tra: 'Tourism Regulatory Authority (TRA)', traText: 'Informations officielles sur la réglementation du tourisme au Kenya.', note: 'Bahari Asili Safaris n’est pas une autorité gouvernementale d’immigration. Ces liens sont fournis à titre pratique ; suivez toujours les instructions officielles en vigueur. Ce guide ne garantit ni l’entrée ni l’approbation.', action: 'Ouvrir le site officiel' },
  es: { eyebrow: 'Recursos oficiales de viaje', title: 'Comprueba los requisitos de entrada a Kenia antes de viajar', intro: 'Las normas de entrada dependen del pasaporte y de las circunstancias de cada persona y pueden cambiar. Consulta el portal oficial del gobierno para comprobar si necesitas una autorización electrónica de viaje (eTA), revisar posibles exenciones y leer las instrucciones vigentes.', eta: 'Autorización electrónica de viaje a Kenia (eTA)', etaText: 'Comprueba la elegibilidad, las exenciones, los requisitos y las instrucciones en el portal oficial.', tra: 'Tourism Regulatory Authority (TRA)', traText: 'Información oficial sobre la regulación turística en Kenia.', note: 'Bahari Asili Safaris no es una autoridad gubernamental de inmigración. Estos enlaces se ofrecen como ayuda; sigue siempre las instrucciones oficiales vigentes. Esta guía no garantiza la entrada ni la aprobación.', action: 'Abrir sitio oficial' },
  de: { eyebrow: 'Offizielle Reiseinformationen', title: 'Prüfen Sie die Einreisebestimmungen für Kenia vor der Abreise', intro: 'Die Einreisebestimmungen hängen vom Reisepass und den persönlichen Umständen ab und können sich ändern. Prüfen Sie auf dem offiziellen Regierungsportal, ob Sie eine elektronische Reisegenehmigung (eTA) benötigen, welche Ausnahmen gelten und welche aktuellen Anweisungen zu beachten sind.', eta: 'Elektronische Reisegenehmigung für Kenia (eTA)', etaText: 'Prüfen Sie Berechtigung, Ausnahmen, Anforderungen und Antragshinweise auf dem offiziellen Portal.', tra: 'Tourism Regulatory Authority (TRA)', traText: 'Offizielle Informationen zur Tourismusregulierung in Kenia.', note: 'Bahari Asili Safaris ist keine staatliche Einwanderungsbehörde. Die Links dienen der Orientierung; maßgeblich sind stets die aktuellen offiziellen Anweisungen. Dieser Leitfaden garantiert weder Einreise noch Genehmigung.', action: 'Offizielle Website öffnen' },
  ar: { eyebrow: 'مصادر السفر الرسمية', title: 'تحقق من متطلبات دخول كينيا قبل السفر', intro: 'تعتمد قواعد الدخول على جواز السفر والظروف الشخصية وقد تتغير. استخدم البوابة الحكومية الرسمية للتحقق مما إذا كنت تحتاج إلى تصريح السفر الإلكتروني (eTA)، ومراجعة أي إعفاءات والتعليمات الحالية.', eta: 'تصريح السفر الإلكتروني إلى كينيا (eTA)', etaText: 'تحقق من الأهلية والإعفاءات والمتطلبات وإرشادات التقديم عبر البوابة الرسمية.', tra: 'هيئة تنظيم السياحة (TRA)', traText: 'معلومات رسمية حول تنظيم السياحة في كينيا.', note: 'Bahari Asili Safaris ليست جهة حكومية للهجرة. تُقدَّم هذه الروابط للتسهيل؛ اتبع دائمًا التعليمات الرسمية الحالية. لا يضمن هذا الدليل الدخول أو الموافقة.', action: 'افتح الموقع الرسمي' },
  zh: { eyebrow: '官方旅行资源', title: '出发前请核实肯尼亚入境要求', intro: '入境规定取决于护照和个人情况，并可能发生变化。请使用政府官方门户确认您是否需要电子旅行授权（eTA）、是否适用豁免以及最新申请说明。', eta: '肯尼亚电子旅行授权（eTA）', etaText: '在官方门户查看资格、豁免、要求和申请说明。', tra: '肯尼亚旅游监管局（TRA）', traText: '关于肯尼亚旅游监管的官方信息。', note: 'Bahari Asili Safaris 不是政府移民机构。提供这些链接仅为方便；请始终遵循最新官方说明。本指南不保证获准入境或申请获批。', action: '打开官方网站' },
  sw: { eyebrow: 'Taarifa rasmi za safari', title: 'Thibitisha masharti ya kuingia Kenya kabla ya kusafiri', intro: 'Masharti ya kuingia hutegemea pasipoti na hali ya msafiri na yanaweza kubadilika. Tumia tovuti rasmi ya serikali kuangalia kama unahitaji Electronic Travel Authorisation (eTA), misamaha inayoweza kutumika na maelekezo ya sasa.', eta: 'Kibali cha Kielektroniki cha Kusafiri Kenya (eTA)', etaText: 'Angalia ustahiki, misamaha, masharti na maelekezo ya maombi kwenye tovuti rasmi.', tra: 'Mamlaka ya Udhibiti wa Utalii (TRA)', traText: 'Taarifa rasmi kuhusu udhibiti wa utalii nchini Kenya.', note: 'Bahari Asili Safaris si mamlaka ya serikali ya uhamiaji. Viungo hivi vimetolewa kwa urahisi; fuata maelekezo rasmi ya sasa kila wakati. Mwongozo huu hauhakikishi kuingia nchini au kuidhinishwa kwa ombi.', action: 'Fungua tovuti rasmi' },
} as const;

export default function OfficialTravelResources() {
  const { locale, isRTL } = useLanguage();
  const t = copy[locale] ?? copy.en;

  return (
    <section lang={locale} dir={isRTL ? 'rtl' : 'ltr'} aria-labelledby="official-travel-resources-title" className="border-b border-sand-200 bg-sand-50 py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 block font-inter text-xs font-semibold uppercase tracking-widest text-safari-600">{t.eyebrow}</span>
          <h2 id="official-travel-resources-title" className="font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">{t.title}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-foreground/75">{t.intro}</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-safari-50 text-safari-700"><FileCheck2 className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="font-poppins text-lg font-bold text-foreground">{t.eta}</h3>
            <p className="mt-2 font-inter text-sm leading-6 text-foreground/70">{t.etaText}</p>
            <a href="https://etakenya.go.ke/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-safari-600 px-4 py-2 font-inter text-sm font-semibold text-white transition-colors hover:bg-safari-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-500 focus-visible:ring-offset-2">
              {t.action}<ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
          <article className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-50 text-ocean-700"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></div>
            <h3 className="font-poppins text-lg font-bold text-foreground">{t.tra}</h3>
            <p className="mt-2 font-inter text-sm leading-6 text-foreground/70">{t.traText}</p>
            <a href="https://tourkenya.go.ke/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-ocean-200 px-4 py-2 font-inter text-sm font-semibold text-ocean-800 transition-colors hover:bg-ocean-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2">
              {t.action}<ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        </div>
        <p className="mx-auto mt-6 max-w-5xl rounded-xl border border-sand-200 bg-white/80 p-4 font-inter text-xs leading-5 text-foreground/70">{t.note}</p>
      </div>
    </section>
  );
}
