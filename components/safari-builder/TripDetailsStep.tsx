'use client';

import { Calendar, MapPin } from 'lucide-react';
import { ALL_LOCATIONS, type StartEndLocation } from '@/lib/quotation-pricing';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TripDetailsValue { arrivalDate: string; departureDate: string; startLocation: StartEndLocation | ''; endLocation: StartEndLocation | ''; }
interface TripDetailsStepProps { value: TripDetailsValue; onChange: (value: TripDetailsValue) => void; errors: Record<string, string>; }
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TripDetailsStep({ value, onChange, errors }: TripDetailsStepProps) {
  const { t } = useLanguage(); const tr = t.safariBuilder.trip;
  const input = 'mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-3 font-grotesk text-sm text-ink outline-none transition focus:border-ocean focus:ring-0';
  return <div className="space-y-10">
    <header className="max-w-2xl border-b border-line pb-6">
      <p className="editorial-label text-orange">01 / TRIP</p>
      <h2 className="mt-3 font-editorial text-4xl leading-none text-ink sm:text-5xl">{tr.title}</h2>
      <p className="mt-4 max-w-xl font-grotesk text-sm leading-6 text-ink-soft">{tr.subtitle}</p>
    </header>
    <div className="grid gap-8 sm:grid-cols-2">
      <label htmlFor="arrivalDate" className="block font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-muted"><span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-ocean" />{tr.arrivalLabel}</span><input id="arrivalDate" type="date" min={todayISO()} value={value.arrivalDate} onChange={(e) => onChange({ ...value, arrivalDate: e.target.value })} className={input} /></label>
      <label htmlFor="departureDate" className="block font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-muted"><span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-ocean" />{tr.departureLabel}</span><input id="departureDate" type="date" min={value.arrivalDate || todayISO()} value={value.departureDate} onChange={(e) => onChange({ ...value, departureDate: e.target.value })} className={input} /></label>
    </div>
    {errors.dates && <p className="border-l-2 border-orange pl-3 font-grotesk text-sm text-ink">{errors.dates}</p>}
    <div className="grid gap-8 sm:grid-cols-2">
      <label htmlFor="startLocation" className="block font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-muted"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-orange" />{tr.startLocationLabel}</span><select id="startLocation" value={value.startLocation} onChange={(e) => onChange({ ...value, startLocation: e.target.value as StartEndLocation })} className={input}><option value="">{tr.selectLocationPlaceholder}</option>{ALL_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select></label>
      <label htmlFor="endLocation" className="block font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-muted"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-orange" />{tr.endLocationLabel}</span><select id="endLocation" value={value.endLocation} onChange={(e) => onChange({ ...value, endLocation: e.target.value as StartEndLocation })} className={input}><option value="">{tr.selectLocationPlaceholder}</option>{ALL_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select></label>
    </div>
    {errors.locations && <p className="border-l-2 border-orange pl-3 font-grotesk text-sm text-ink">{errors.locations}</p>}
  </div>;
}
