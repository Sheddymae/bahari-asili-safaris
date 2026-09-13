'use client';

import Image from 'next/image';
import { Check, MapPin } from 'lucide-react';
import { destinations } from '@/lib/destinations-data';
import { type SafariTab } from '@/lib/tours-data';
import { useLanguage } from '@/contexts/LanguageContext';

interface DestinationsStepProps {
  value: SafariTab[];
  onChange: (value: SafariTab[]) => void;
  errors: Record<string, string>;
}

export default function DestinationsStep({ value, onChange, errors }: DestinationsStepProps) {
  const { t } = useLanguage();
  const ds = t.safariBuilder.destinationsStep;
  const toggle = (slug: SafariTab) => {
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-1">{ds.title}</h2>
        <p className="font-inter text-sm text-muted-foreground">{ds.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5" role="group" aria-label="Destinations">
        {destinations.map((dest) => {
          const selected = value.includes(dest.slug);
          return (
            <button
              key={dest.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(dest.slug)}
              className={`relative text-left rounded-2xl overflow-hidden border-2 transition-all ${
                selected ? 'border-book shadow-lg' : 'border-transparent hover:border-border'
              }`}
            >
              <div className="relative h-40 w-full">
                <Image src={dest.heroImage} alt={dest.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {selected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-book rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-poppins font-bold text-lg text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {dest.name}
                  </h3>
                </div>
              </div>
              <div className="bg-white p-4">
                <p className="font-inter text-xs text-foreground mb-2 line-clamp-2">{dest.tagline}</p>
                <p className="font-inter text-[11px] text-safari-600 font-medium">{dest.wildlifeHighlights[0]}</p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.destinations && <p className="text-sm text-destructive font-inter">{errors.destinations}</p>}
    </div>
  );
}
