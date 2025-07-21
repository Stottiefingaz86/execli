import React, { useState, useEffect, useRef } from 'react';

interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function MagicBento({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = "132, 0, 255",
  className = "",
  children
}: MagicBentoProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableStars) return;

    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: Math.random()
    }));
    setParticles(newParticles);

    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 100) % 100,
        y: (particle.y + particle.vy + 100) % 100,
        life: (particle.life + 0.01) % 1
      })));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [enableStars, particleCount]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });

    if (enableTilt) {
      const tiltX = (y - 50) * 0.1;
      const tiltY = (x - 50) * 0.1;
      setTilt({ x: tiltX, y: tiltY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!clickEffect) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = `radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 70%)`;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.transition = 'all 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';

    containerRef.current?.appendChild(ripple);

    setTimeout(() => {
      ripple.style.width = '200px';
      ripple.style.height = '200px';
      ripple.style.opacity = '0';
    }, 10);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl ${className}`}
      style={{
        transform: enableTilt ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
        transition: 'transform 0.1s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Spotlight Effect */}
      {enableSpotlight && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle ${spotlightRadius}px at ${mousePosition.x}% ${mousePosition.y}%, rgba(${glowColor}, 0.1) 0%, transparent 50%)`,
            transition: 'all 0.1s ease-out'
          }}
        />
      )}

      {/* Border Glow */}
      {enableBorderGlow && isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px rgba(${glowColor}, 0.3), inset 0 0 20px rgba(${glowColor}, 0.1)`,
            transition: 'all 0.3s ease-out'
          }}
        />
      )}

      {/* Floating Particles */}
      {enableStars && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, index) => (
            <div
              key={index}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: Math.sin(particle.life * Math.PI) * 0.5 + 0.2,
                transform: `scale(${Math.sin(particle.life * Math.PI) * 0.5 + 0.5})`,
                transition: 'all 0.1s ease-out'
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
} 