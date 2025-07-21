import { useState, useEffect } from 'react';
import Orb from './Orb';
import ShinyText from './ShinyText';

interface MinimalLoadingStateProps {
  className?: string;
  noCard?: boolean;
  reportId?: string;
}

export default function MinimalLoadingState({ className = '', noCard = false, reportId }: MinimalLoadingStateProps) {
  const [currentText, setCurrentText] = useState('Analyzing Reviews');
  const [subtitle, setSubtitle] = useState('Processing customer feedback...');
  
  const fallbackTexts = [
    'Analyzing Reviews',
    'Turning reviews into revenue'
  ];

  useEffect(() => {
    if (reportId) {
      // Fetch loading text from API
      const fetchLoadingText = async () => {
        try {
          const response = await fetch(`/api/loading-text?reportId=${reportId}`);
          const data = await response.json();
          setCurrentText(data.text);
          setSubtitle(data.subtitle);
        } catch (error) {
          console.error('Error fetching loading text:', error);
        }
      };

      fetchLoadingText();
      const interval = setInterval(fetchLoadingText, 3000);
      return () => clearInterval(interval);
    } else {
      // Fallback to cycling text
      const interval = setInterval(() => {
        setCurrentText((prev) => {
          const currentIndex = fallbackTexts.indexOf(prev);
          const nextIndex = (currentIndex + 1) % fallbackTexts.length;
          return fallbackTexts[nextIndex];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [reportId, fallbackTexts.length]);

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
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {/* Minimal Loading Container */}
      <div className="relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 w-full max-w-md h-80 shadow-2xl">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-slate-600/20 rounded-3xl" />
        
        {/* Content */}
        {content}
      </div>
    </div>
  );
} 