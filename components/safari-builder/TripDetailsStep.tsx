'use client';

import { Calendar, MapPin } from 'lucide-react';
import { ALL_LOCATIONS, type StartEndLocation } from '@/lib/quotation-pricing';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TripDetailsValue {
  arrivalDate: string;
  departureDate: string;
  startLocation: StartEndLocation | '';
  endLocation: StartEndLocation | '';
}

interface TripDetailsStepProps {
  value: TripDetailsValue;
  onChange: (value: TripDetailsValue) => void;
  errors: Record<string, string>;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TripDetailsStep({ value, onChange, errors }: TripDetailsStepProps) {
  const { t } = useLanguage();
  const tr = t.safariBuilder.trip;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-1">{tr.title}</h2>
        <p className="font-inter text-sm text-muted-foreground">{tr.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="arrivalDate" className="font-inter text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-ocean-700" /> {tr.arrivalLabel}
          </label>
          <input
            id="arrivalDate"
            type="date"
            min={todayISO()}
            value={value.arrivalDate}
            onChange={(e) => onChange({ ...value, arrivalDate: e.target.value })}
            className="w-full h-12 px-4 rounded-xl border border-border focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100 outline-none font-inter text-sm"
          />
        </div>
        <div>
          <label htmlFor="departureDate" className="font-inter text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-ocean-700" /> {tr.departureLabel}
          </label>
          <input
            id="departureDate"
            type="date"
            min={value.arrivalDate || todayISO()}
            value={value.departureDate}
            onChange={(e) => onChange({ ...value, departureDate: e.target.value })}
            className="w-full h-12 px-4 rounded-xl border border-border focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100 outline-none font-inter text-sm"
          />
        </div>
      </div>
      {errors.dates && <p className="text-sm text-destructive font-inter -mt-4">{errors.dates}</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="startLocation" className="font-inter text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-safari-500" /> {tr.startLocationLabel}
          </label>
          <select
            id="startLocation"
            value={value.startLocation}
            onChange={(e) => onChange({ ...value, startLocation: e.target.value as StartEndLocation })}
            className="w-full h-12 px-4 rounded-xl border border-border focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100 outline-none font-inter text-sm bg-white"
          >
            <option value="">{tr.selectLocationPlaceholder}</option>
            {ALL_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endLocation" className="font-inter text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-safari-500" /> {tr.endLocationLabel}
          </label>
          <select
            id="endLocation"
            value={value.endLocation}
            onChange={(e) => onChange({ ...value, endLocation: e.target.value as StartEndLocation })}
            className="w-full h-12 px-4 rounded-xl border border-border focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100 outline-none font-inter text-sm bg-white"
          >
            <option value="">{tr.selectLocationPlaceholder}</option>
            {ALL_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>
      {errors.locations && <p className="text-sm text-destructive font-inter -mt-4">{errors.locations}</p>}
    </div>
  );
}
