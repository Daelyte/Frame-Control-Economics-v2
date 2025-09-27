// Simple Dragon that you can actually see
import React from 'react';

export default function SimpleDragon() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        background: 'radial-gradient(circle at 30% 40%, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.05) 50%, transparent 100%)',
      }}
    >
      {/* Visible background aurora */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, #14B8A6 0deg, #F59E0B 60deg, #DC2626 120deg, #0D9488 180deg, #F59E0B 240deg, #14B8A6 360deg)',
          filter: 'blur(60px)',
          opacity: 0.3,
          animation: 'spin 20s linear infinite',
        }}
      />
      
      {/* Simple rain effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(15deg, transparent 0px, transparent 40px, rgba(20, 184, 166, 0.2) 41px, transparent 43px)',
          animation: 'rain 3s linear infinite',
        }}
      />
      
      {/* Dragon silhouette */}
      <svg 
        viewBox="0 0 1000 600" 
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      >
        <path
          d="M100 200 Q200 100 400 120 Q600 140 700 200 Q800 260 750 350 Q700 400 600 420 Q400 440 200 400 Q50 350 100 200 Z"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="3"
          strokeOpacity="0.8"
        />
        
        {/* Dragon eye */}
        <circle cx="600" cy="280" r="15" fill="#14B8A6" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
        
        {/* Dragon teeth */}
        <path d="M400 380 L410 420 L420 380" fill="#FFFFFF" opacity="0.6" />
        <path d="M450 385 L460 425 L470 385" fill="#FFFFFF" opacity="0.6" />
        <path d="M500 390 L510 430 L520 390" fill="#FFFFFF" opacity="0.6" />
      </svg>

      <style jsx>{`
        @keyframes rain {
          0% { background-position: 0px 0px; }
          100% { background-position: 50px 100vh; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}