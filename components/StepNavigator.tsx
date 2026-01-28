
import React from 'react';
import { ResumeStep } from '../types.ts';

interface StepNavigatorProps {
  currentStep: ResumeStep;
  onStepChange: (step: ResumeStep) => void;
}

export default function StepNavigator({ currentStep, onStepChange }: StepNavigatorProps) {
  const steps = Object.values(ResumeStep);

  return (
    <nav className="flex flex-col space-y-1 py-4">
      {steps.map((step, index) => {
        const isActive = currentStep === step;
        const isPast = steps.indexOf(currentStep) > index;

        return (
          <button
            key={step}
            onClick={() => onStepChange(step)}
            className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 text-left group ${
              isActive 
                ? 'bg-teal text-navy shadow-xl scale-105 z-10 font-black' 
                : isPast 
                  ? 'text-teal hover:bg-white/5 opacity-80' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black border-2 ${
              isActive ? 'bg-navy text-teal border-navy' : 'border-current'
            }`}>
              {index + 1}
            </span>
            <span className="font-bold text-sm tracking-wide">{step}</span>
            {isPast && !isActive && <i className="fas fa-check-circle ml-auto scale-75 opacity-50"></i>}
          </button>
        );
      })}
    </nav>
  );
}