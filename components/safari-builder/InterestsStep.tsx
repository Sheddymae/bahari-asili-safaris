'use client';

import { Sparkles } from 'lucide-react';
import { SAFARI_INTERESTS } from '@/lib/quotation-pricing';
import { useLanguage } from '@/contexts/LanguageContext';

interface InterestsStepProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function InterestsStep({ value, onChange }: InterestsStepProps) {
  const { t } = useLanguage();
  const st = t.safariBuilder.style;
  const toggle = (key: string) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-1">{st.title}</h2>
        <p className="font-inter text-sm text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-safari-500" /> {st.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap gap-3" role="group" aria-label="Safari interests">
        {SAFARI_INTERESTS.map((interest) => {
          const selected = value.includes(interest.key);
          const label = (st.interestLabels as Record<string, string>)[interest.key] || interest.label;
          return (
            <button
              key={interest.key}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(interest.key)}
              className={`font-inter text-sm font-medium px-5 py-2.5 rounded-full border-2 transition-all ${
                selected
                  ? 'bg-ocean-700 border-ocean-700 text-white shadow-sm'
                  : 'bg-white border-border text-foreground hover:border-ocean-400 hover:text-ocean-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
