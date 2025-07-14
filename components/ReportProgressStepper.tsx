import React from 'react';

interface Step {
  label: string;
  commentary: string;
}

interface ReportProgressStepperProps {
  steps: Step[];
  currentStep: number;
  progressMessage: string;
}

const ReportProgressStepper: React.FC<ReportProgressStepperProps> = ({ steps, currentStep, progressMessage }) => (
  <div className="w-full max-w-md mx-auto p-6 bg-white/10 rounded-2xl shadow-lg border border-white/20">
    <ol className="space-y-4">
      {steps.map((step, idx) => (
        <li key={step.label} className={`flex items-center gap-3 ${idx < currentStep ? 'opacity-80' : idx === currentStep ? 'font-bold text-accent' : 'opacity-40'}`}>
          {idx < currentStep ? (
            <span className="inline-block w-5 h-5 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-full flex items-center justify-center text-xs">✓</span>
          ) : idx === currentStep ? (
            <span className="inline-block w-5 h-5 animate-pulse bg-gradient-to-br from-[#8b5cf6] via-[#a78bfa] to-[#86EFF5] rounded-full"></span>
          ) : (
            <span className="inline-block w-5 h-5 border-2 border-[#a78bfa] rounded-full"></span>
          )}
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
    <div className="mt-6 text-center text-[#B0B0C0] text-base min-h-[32px]">
      {steps[currentStep]?.commentary}
    </div>
    <div className="mt-2 text-xs text-[#B0B0C0] text-center">
      {progressMessage}
    </div>
  </div>
);

export default ReportProgressStepper; 