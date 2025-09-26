import React, { useEffect, useState } from 'react';

interface ElegantDragonProps {
  enabled?: boolean;
}

export default function ElegantDragon({ enabled = true }: ElegantDragonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    // Gentle fade in
    const timer = setTimeout(() => setIsVisible(true), 1000);

    // Subtle mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Elegant gradient orb */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)',
          top: '20%',
          right: '15%',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />

      {/* Secondary accent orb */}
      <div 
        className="absolute w-64 h-64 rounded-full opacity-10 blur-2xl transition-transform duration-1500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
          bottom: '30%',
          left: '20%',
          transform: `translate(${-mousePos.x * 0.7}px, ${-mousePos.y * 0.7}px)`
        }}
      />

      {/* Subtle animated particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              top: `${20 + Math.sin(i * 0.8) * 30}%`,
              left: `${15 + Math.cos(i * 1.2) * 40}%`,
              animation: `float ${3 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Ambient glow lines */}
      <div 
        className="absolute opacity-20"
        style={{
          top: '40%',
          right: '10%',
          width: '300px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.4), transparent)',
          transform: `translateX(${mousePos.x * 2}px) rotate(${mousePos.x * 0.1}deg)`,
          transition: 'transform 1s ease-out'
        }}
      />

      <div 
        className="absolute opacity-15"
        style={{
          bottom: '35%',
          left: '8%',
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
          transform: `translateX(${-mousePos.x * 1.5}px) rotate(${-mousePos.x * 0.08}deg)`,
          transition: 'transform 1.2s ease-out'
        }}
      />

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) scale(1); 
              opacity: 0.3; 
            }
            33% { 
              transform: translateY(-10px) scale(1.1); 
              opacity: 0.6; 
            }
            66% { 
              transform: translateY(-5px) scale(0.9); 
              opacity: 0.4; 
            }
          }

          @keyframes pulse-glow {
            0%, 100% { 
              opacity: 0.2; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.3; 
              transform: scale(1.05); 
            }
          }

          /* Respect reduced motion preferences */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `
      }} />
    </div>
  );
}