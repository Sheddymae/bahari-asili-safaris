import type { Locale } from './i18n';

export const destinationPageLabels: Record<Locale, {
  story: string;
  historyTitle: string;
  regionFallback: string;
}> = {
  en:{story:'Destination story',historyTitle:'A short history of',regionFallback:'East Africa'},
  it:{story:'Storia della destinazione',historyTitle:'Una breve storia di',regionFallback:'Africa orientale'},
  fr:{story:'Histoire de la destination',historyTitle:'Brève histoire de',regionFallback:'Afrique de l’Est'},
  es:{story:'Historia del destino',historyTitle:'Breve historia de',regionFallback:'África Oriental'},
  de:{story:'Geschichte des Reiseziels',historyTitle:'Eine kurze Geschichte von',regionFallback:'Ostafrika'},
  ar:{story:'قصة الوجهة',historyTitle:'نبذة تاريخية عن',regionFallback:'شرق أفريقيا'},
  zh:{story:'目的地故事',historyTitle:'目的地简史：',regionFallback:'东非'},
  sw:{story:'Historia ya eneo',historyTitle:'Historia fupi ya',regionFallback:'Afrika Mashariki'},
};
