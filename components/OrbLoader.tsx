import React from 'react';

interface OrbLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  showText?: boolean;
}

export default function OrbLoader({ 
  size = 'lg', 
  className = '', 
  text = 'Analyzing...',
  showText = true 
}: OrbLoaderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Orb Container */}
      <div className={`relative ${sizeClasses[size]} mb-6`}>
        {/* Main Orb */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse shadow-2xl">
          {/* Inner Glow */}
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-300/50 via-blue-400/50 to-purple-500/50 rounded-full blur-sm"></div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-300/30 animate-spin"></div>
          
          {/* Pulsing Core */}
          <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-ping"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-2 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-bounce"></div>
          <div className="absolute bottom-2 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 right-2 w-1 h-1 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      
      {/* Loading Text */}
      {showText && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{text}</h3>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced version with more dynamic effects
export function DynamicOrbLoader({ 
  size = 'lg', 
  className = '', 
  text = 'Processing with AI...',
  showText = true,
  variant = 'default'
}: OrbLoaderProps & { variant?: 'default' | 'pulse' | 'wave' }) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const variants = {
    default: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600',
    pulse: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    wave: 'bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Enhanced Orb Container */}
      <div className={`relative ${sizeClasses[size]} mb-6`}>
        {/* Main Orb with variant colors */}
        <div className={`absolute inset-0 ${variants[variant]} rounded-full animate-pulse shadow-2xl`}>
          {/* Multiple Glow Layers */}
          <div className="absolute inset-2 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full blur-sm"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
          
          {/* Animated Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border border-white/10 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          
          {/* Pulsing Core */}
          <div className="absolute inset-6 bg-gradient-to-br from-white/30 to-transparent rounded-full animate-ping"></div>
        </div>
        
        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1 left-1/2 w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 right-1 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
      
      {/* Enhanced Loading Text */}
      {showText && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-3">{text}</h3>
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
} 