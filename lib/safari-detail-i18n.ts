import type { Locale } from './i18n';

export interface SafariDetailTranslation {
  quoteTitle: string;
  whatsappTitle: string;
  reassurance: string[];
  home: string;
  safaris: string;
  youMightAlsoLike: string;
}

export const safariDetailTranslations: Record<Locale, SafariDetailTranslation> = {
  en: {
    quoteTitle: 'Get a Free Quote',
    whatsappTitle: 'WhatsApp us about this safari',
    reassurance: ['No payment required to request a quote', 'We usually reply within a few hours', 'Free changes before your booking is confirmed'],
    home: 'Home',
    safaris: 'Safaris',
    youMightAlsoLike: 'You Might Also Like',
  },
  it: {
    quoteTitle: 'Richiedi un preventivo gratuito',
    whatsappTitle: 'Scrivici su WhatsApp per questo safari',
    reassurance: ['Nessun pagamento richiesto per richiedere un preventivo', 'Di solito rispondiamo entro poche ore', 'Modifiche gratuite prima della conferma della prenotazione'],
    home: 'Home',
    safaris: 'Safari',
    youMightAlsoLike: 'Potrebbe piacerti anche',
  },
  fr: {
    quoteTitle: 'Demander un devis gratuit',
    whatsappTitle: 'Écrivez-nous sur WhatsApp pour ce safari',
    reassurance: ['Aucun paiement requis pour demander un devis', 'Nous répondons généralement en quelques heures', 'Modifications gratuites avant la confirmation de votre réservation'],
    home: 'Accueil',
    safaris: 'Safaris',
    youMightAlsoLike: 'Vous aimerez peut-être aussi',
  },
  es: {
    quoteTitle: 'Solicita un presupuesto gratuito',
    whatsappTitle: 'Escríbenos por WhatsApp sobre este safari',
    reassurance: ['No se requiere pago para solicitar un presupuesto', 'Normalmente respondemos en unas horas', 'Cambios gratuitos antes de confirmar tu reserva'],
    home: 'Inicio',
    safaris: 'Safaris',
    youMightAlsoLike: 'También te puede gustar',
  },
  de: {
    quoteTitle: 'Kostenloses Angebot anfragen',
    whatsappTitle: 'Schreiben Sie uns auf WhatsApp zu dieser Safari',
    reassurance: ['Für eine Angebotsanfrage ist keine Zahlung erforderlich', 'Wir antworten normalerweise innerhalb weniger Stunden', 'Kostenlose Änderungen vor der Bestätigung Ihrer Buchung'],
    home: 'Startseite',
    safaris: 'Safaris',
    youMightAlsoLike: 'Das könnte Ihnen auch gefallen',
  },
  ar: {
    quoteTitle: 'احصل على عرض مجاني',
    whatsappTitle: 'تواصل معنا عبر واتساب حول هذه الرحلة',
    reassurance: ['لا يلزم الدفع لطلب عرض سعر', 'نرد عادة خلال بضع ساعات', 'تعديلات مجانية قبل تأكيد الحجز'],
    home: 'الرئيسية',
    safaris: 'رحلات السفاري',
    youMightAlsoLike: 'قد يعجبك أيضًا',
  },
  zh: {
    quoteTitle: '获取免费报价',
    whatsappTitle: '通过 WhatsApp 咨询此 Safari',
    reassurance: ['申请报价无需付款', '我们通常会在几小时内回复', '确认预订前可免费修改'],
    home: '首页',
    safaris: '野生动物之旅',
    youMightAlsoLike: '你可能也喜欢',
  },
  sw: {
    quoteTitle: 'Pata Nukuu ya Bure',
    whatsappTitle: 'Wasiliana nasi WhatsApp kuhusu safari hii',
    reassurance: ['Hakuna malipo yanayohitajika kuomba nukuu', 'Kwa kawaida tunajibu ndani ya saa chache', 'Mabadiliko ni bure kabla ya kuhakikishwa kwa nafasi yako'],
    home: 'Nyumbani',
    safaris: 'Safari',
    youMightAlsoLike: 'Unaweza pia kupenda',
  },
};