import { useState, useEffect } from 'react';
import Orb from './Orb';

interface CompactLoadingStateProps {
  className?: string;
}

export default function CompactLoadingState({ className = '' }: CompactLoadingStateProps) {
  const [currentText, setCurrentText] = useState(0);
  
  const texts = [
    'Analyzing Reviews',
    'Turning reviews into revenue'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {/* Stunning Glassmorphic Container */}
      <div className="relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 w-full max-w-md shadow-2xl">
        {/* Beautiful gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-slate-600/20 rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 rounded-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Large, Prominent Orb */}
          <div className="w-32 h-32 relative">
            <Orb 
              hue={240}
              hoverIntensity={0.4}
              rotateOnHover={false}
            />
          </div>
          
          {/* Minimal, Elegant Text */}
          <div className="text-center space-y-2">
            <div className="text-white font-semibold text-lg transition-all duration-700">
              {texts[currentText]}
            </div>
            <div className="text-gray-300 text-sm opacity-80">
              2-3 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 