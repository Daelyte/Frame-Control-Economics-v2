import React from 'react';

const TechBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Aurora gradient background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, var(--brand-400) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--accent-400) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, var(--brand-300) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20 animate-pulse"
            style={{
              background: i % 3 === 0 ? 'var(--brand-400)' : 'var(--accent-400)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TechBackdrop;