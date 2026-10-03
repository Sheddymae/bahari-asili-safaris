'use client';

import { Check } from 'lucide-react';

interface BuilderProgressProps { steps: string[]; currentStep: number; }

export default function BuilderProgress({ steps, currentStep }: BuilderProgressProps) {
  return (
    <nav className="mb-8 border-y border-line py-4" aria-label="Safari builder progress">
      <ol className="grid grid-cols-5 gap-2">
        {steps.map((label, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <li key={label} className="relative min-w-0">
              <div className="flex items-start gap-2">
                <span aria-current={isActive ? 'step' : undefined} className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border font-mono-editorial text-[9px] transition-colors ${isDone ? 'border-ocean bg-ocean text-paper' : isActive ? 'border-orange bg-orange text-ink' : 'border-line bg-paper text-muted'}`}>
                  {isDone ? <Check className="h-3.5 w-3.5" /> : `0${i + 1}`}
                </span>
                <span className={`hidden min-w-0 font-mono-editorial text-[9px] uppercase leading-4 tracking-[0.1em] sm:block ${isActive ? 'text-ink' : 'text-muted'}`}>{label}</span>
              </div>
              <span className={`mt-2 block h-px ${i < currentStep ? 'bg-ocean' : isActive ? 'bg-orange' : 'bg-line'}`} aria-hidden="true" />
            </li>
          );
        })}
      </ol>
      <p className="mt-3 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-muted sm:hidden">Step {currentStep + 1} / {steps.length} — {steps[currentStep]}</p>
    </nav>
  );
}
