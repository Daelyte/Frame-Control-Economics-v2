import React from 'react';

interface DragonMarkProps {
  className?: string;
}

const DragonMark: React.FC<DragonMarkProps> = ({ className = "" }) => {
  return (
    <div className={`w-16 h-16 ${className}`}>
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full transition-transform duration-300 hover:scale-110"
        style={{ filter: 'drop-shadow(0 4px 8px color-mix(in oklab, var(--brand-500) 20%, transparent))' }}
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="var(--brand-400)"
          opacity="0.2"
        />
        <circle
          cx="32"
          cy="32"
          r="12"
          fill="var(--brand-600)"
          opacity="0.6"
        />
        <circle
          cx="32"
          cy="32"
          r="6"
          fill="var(--accent-500)"
        />
      </svg>
    </div>
  );
};

export default DragonMark;