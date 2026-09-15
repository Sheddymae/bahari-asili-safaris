import type { Locale } from './i18n';

export const destinationPageLabels: Record<Locale, {
  story: string;
  historyTitle: string;
}> = {
  en:{story:'Destination story',historyTitle:'A short history of'},
  it:{story:'Storia della destinazione',historyTitle:'Una breve storia di'},
  fr:{story:'Histoire de la destination',historyTitle:'Brève histoire de'},
  es:{story:'Historia del destino',historyTitle:'Breve historia de'},
  de:{story:'Geschichte des Reiseziels',historyTitle:'Eine kurze Geschichte von'},
  ar:{story:'قصة الوجهة',historyTitle:'نبذة تاريخية عن'},
  zh:{story:'目的地故事',historyTitle:'目的地简史：'},
  sw:{story:'Historia ya eneo',historyTitle:'Historia fupi ya'},
};
