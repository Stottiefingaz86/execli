import { useState } from 'react';
import Orb from './Orb';
import ShinyText from './ShinyText';
import Aurora from './Aurora';

interface MinimalLoadingStateProps {
  className?: string;
  noCard?: boolean;
  reportId?: string;
}

export default function MinimalLoadingState({ className = '', noCard = false }: MinimalLoadingStateProps) {
  // Static text for premium loader
  const currentText = 'AI Analyzing';
  const subtitle = 'Building your report. This usually takes 1–2 minutes. Please keep this page open.';

  const content = (
    <div className="relative z-10 flex flex-col items-center gap-8">
      {/* Orb */}
      <div className="w-40 h-40 relative">
        <Orb 
          hue={220}
          hoverIntensity={0.8}
          rotateOnHover={false}
        />
      </div>
      {/* Text */}
      <div className="text-center space-y-2">
        <div className="font-semibold text-lg transition-all duration-700">
          <ShinyText text={currentText} speed={3} />
        </div>
        {subtitle && (
          <div className="text-gray-300 text-sm opacity-80">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  if (noCard) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen flex items-center justify-center ${className}`}>
      {/* Aurora animated background */}
      <div className="absolute inset-0 -z-10">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.2} blend={0.6} />
      </div>
      {/* Glassmorphic Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 w-full max-w-md h-80 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex items-center justify-center">
        {content}
      </div>
    </div>
  );
} 