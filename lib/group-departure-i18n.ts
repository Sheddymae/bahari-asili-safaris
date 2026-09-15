import type { Locale } from './i18n';

export const groupDepartureLabels: Record<Locale, {
  joining: string;
  seatsLeft: string;
  firstToJoin: string;
  seat: string;
  seats: string;
}> = {
  en:{joining:'Join {count} {nationality} on {date} — {seats} {seatWord} left',seatsLeft:'{seats} seats left',firstToJoin:'be the first to join',seat:'seat',seats:'seats'},
  it:{joining:'Unisciti a {count} {nationality} il {date} — {seats} {seatWord} disponibili',seatsLeft:'{seats} posti disponibili',firstToJoin:'sii il primo a partecipare',seat:'posto',seats:'posti'},
  fr:{joining:'Rejoignez {count} {nationality} le {date} — {seats} {seatWord} restant(s)',seatsLeft:'{seats} places restantes',firstToJoin:'soyez le premier à participer',seat:'place',seats:'places'},
  es:{joining:'Únete a {count} {nationality} el {date} — quedan {seats} {seatWord}',seatsLeft:'Quedan {seats} plazas',firstToJoin:'sé el primero en unirte',seat:'plaza',seats:'plazas'},
  de:{joining:'Reisen Sie am {date} mit {count} {nationality} — noch {seats} {seatWord} frei',seatsLeft:'Noch {seats} Plätze frei',firstToJoin:'als Erster dabei sein',seat:'Platz',seats:'Plätze'},
  ar:{joining:'انضم إلى {count} من {nationality} في {date} — تبقى {seats} {seatWord}',seatsLeft:'تبقى {seats} مقاعد',firstToJoin:'كن أول من ينضم',seat:'مقعد',seats:'مقاعد'},
  zh:{joining:'于{date}加入{count}位{nationality}旅客 — 剩余{seats}{seatWord}',seatsLeft:'剩余{seats}个座位',firstToJoin:'成为第一位加入的客人',seat:'个座位',seats:'个座位'},
  sw:{joining:'Jiunge na {count} {nationality} tarehe {date} — zimesalia nafasi {seats}',seatsLeft:'Zimesalia nafasi {seats}',firstToJoin:'kuwa wa kwanza kujiunga',seat:'nafasi',seats:'nafasi'},
};
