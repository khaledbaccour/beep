'use client';

import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function OnboardingProgress({ currentStep, totalSteps, stepLabels }: OnboardingProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile: simple text */}
      <div className="sm:hidden flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-bold text-ink-900">
          {stepLabels[currentStep - 1]}
        </span>
      </div>

      {/* Mobile progress bar */}
      <div className="sm:hidden w-full h-3 bg-cream-200 rounded-full border-2 border-ink-900 overflow-hidden">
        <div
          className="h-full bg-peach-500 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Desktop stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Line behind steps */}
        <div className="absolute top-5 left-0 right-0 h-[3px] bg-ink-200" />
        <div
          className="absolute top-5 left-0 h-[3px] bg-peach-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={stepNum} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-xl border-[2.5px] flex items-center justify-center
                  font-bold text-sm transition-all duration-300
                  ${isComplete
                    ? 'bg-peach-500 border-ink-900 text-ink-900 shadow-retro-sm'
                    : isCurrent
                      ? 'bg-white border-ink-900 text-ink-900 shadow-retro animate-shadow-pulse'
                      : 'bg-cream-100 border-ink-300 text-ink-400'
                  }
                `}
              >
                {isComplete ? <Check size={18} strokeWidth={3} /> : stepNum}
              </div>
              <span
                className={`
                  mt-2.5 text-xs font-bold uppercase tracking-wider
                  ${isCurrent ? 'text-ink-900' : isComplete ? 'text-ink-600' : 'text-ink-400'}
                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
