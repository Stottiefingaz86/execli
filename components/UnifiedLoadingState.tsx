import React from 'react';
import Orb from './Orb';

interface UnifiedLoadingStateProps {
  text?: string;
  subtitle?: string;
  className?: string;
}

export default function UnifiedLoadingState({
  text = 'Processing with AI...',
  subtitle = 'This may take a few minutes',
  className = ''
}: UnifiedLoadingStateProps) {
  return (
    <div className={`min-h-screen bg-[#0f1117] text-white flex items-center justify-center ${className}`}>
      <div className="text-center max-w-sm mx-auto px-6">
        {/* Large, Dynamic Orb */}
        <div className="w-80 h-80 mx-auto mb-8 relative">
          <Orb 
            hue={0}
            hoverIntensity={0.5}
            rotateOnHover={false}
            forceHoverState={true}
          />
        </div>
        
        {/* Clean, Minimal Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">{text}</h2>
          {subtitle && (
            <p className="text-gray-400 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized versions for different contexts
export function VOCLoading() {
  return (
    <UnifiedLoadingState
      text="Analyzing customer feedback..."
      subtitle="Finding and processing reviews across multiple platforms"
    />
  );
}

export function ReportLoading() {
  return (
    <UnifiedLoadingState
      text="Generating your report..."
      subtitle="Creating comprehensive insights from customer data"
    />
  );
}

export function ProcessingLoading() {
  return (
    <UnifiedLoadingState
      text="Processing with AI..."
      subtitle="Analyzing and categorizing customer feedback"
    />
  );
} 