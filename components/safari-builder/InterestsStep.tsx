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
  const interestLabels = t.safariBuilder.interestLabels as Record<string, string>;
  const toggle = (key: string) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  };

  return (
    <div className="space-y-9">
      <div>
        <h2 className="font-editorial text-4xl leading-none text-ink sm:text-5xl">{st.title}</h2>
        <p className="font-grotesk text-sm leading-6 text-ink-soft flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-safari-500" /> {st.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap gap-3" role="group" aria-label="Safari interests">
        {SAFARI_INTERESTS.map((interest) => {
          const selected = value.includes(interest.key);
          const label = interestLabels[interest.key] || interest.label;
          return (
            <button
              key={interest.key}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(interest.key)}
              className={`font-grotesk text-sm px-5 py-2.5 border border-line transition-all ${
                selected
                  ? 'bg-ocean border-ocean text-paper'
                  : 'bg-paper border-line text-ink hover:bg-sand hover:text-ocean'
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
