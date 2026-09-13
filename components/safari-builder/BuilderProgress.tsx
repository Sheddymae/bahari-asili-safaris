'use client';

import { Check } from 'lucide-react';

interface BuilderProgressProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export default function BuilderProgress({ steps, currentStep }: BuilderProgressProps) {
  return (
    <div className="flex items-center justify-center mb-10" role="navigation" aria-label="Safari builder progress">
      {steps.map((label, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                aria-current={isActive ? 'step' : undefined}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-poppins font-semibold text-xs transition-colors ${
                  isDone
                    ? 'bg-ocean-700 text-white'
                    : isActive
                    ? 'bg-book text-white'
                    : 'bg-white border border-border text-muted-foreground'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`hidden sm:block font-inter text-[11px] text-center max-w-[72px] ${
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 ${isDone ? 'bg-ocean-700' : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
