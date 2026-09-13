'use client';

import { Users, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TravellersValue {
  adults: number;
  children: number;
  childrenAges: number[];
}

interface TravellersStepProps {
  value: TravellersValue;
  onChange: (value: TravellersValue) => void;
  errors: Record<string, string>;
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between bg-sand-50 rounded-xl border border-sand-200 px-5 py-4">
      <span className="font-inter text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:border-ocean-500 hover:text-ocean-700 transition-colors disabled:opacity-40"
          disabled={value <= min}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-poppins font-bold text-lg text-foreground w-6 text-center">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:border-ocean-500 hover:text-ocean-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function TravellersStep({ value, onChange, errors }: TravellersStepProps) {
  const { t } = useLanguage();
  const tr = t.safariBuilder.travellers;
  const setChildren = (n: number) => {
    const ages = [...value.childrenAges];
    while (ages.length < n) ages.push(5);
    ages.length = n;
    onChange({ ...value, children: n, childrenAges: ages });
  };

  const setAge = (index: number, age: number) => {
    const ages = [...value.childrenAges];
    ages[index] = age;
    onChange({ ...value, childrenAges: ages });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-1">{tr.title}</h2>
        <p className="font-inter text-sm text-muted-foreground">{tr.subtitle}</p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-ocean-700" />
        <span className="font-inter text-sm text-muted-foreground">{tr.guestsLabel}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Stepper label={tr.adultsLabel} value={value.adults} min={1} onChange={(n) => onChange({ ...value, adults: n })} />
        <Stepper label={`${tr.childrenLabel} (0–17)`} value={value.children} min={0} onChange={setChildren} />
      </div>
      {errors.adults && <p className="text-sm text-destructive font-inter">{errors.adults}</p>}

      {value.children > 0 && (
        <div>
          <p className="font-inter text-sm font-medium text-foreground mb-3">{tr.childrenAgesTitle}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {value.childrenAges.map((age, i) => (
              <div key={i}>
                <label htmlFor={`child-age-${i}`} className="sr-only">{tr.childAgeLabel} {i + 1}</label>
                <select
                  id={`child-age-${i}`}
                  value={age}
                  onChange={(e) => setAge(i, Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-lg border border-border focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100 outline-none font-inter text-sm bg-white"
                >
                  {Array.from({ length: 18 }, (_, a) => (
                    <option key={a} value={a}>{a === 0 ? tr.under1 : `${a} ${tr.yrs}`}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {errors.childrenAges && <p className="text-sm text-destructive font-inter mt-2">{errors.childrenAges}</p>}
        </div>
      )}
    </div>
  );
}
