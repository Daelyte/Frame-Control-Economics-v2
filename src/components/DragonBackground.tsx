import React from 'react';

/**
 * Dragon Background Component - Based on Frame Economics brand dragon
 */
export const DragonBackground: React.FC<{
  className?: string;
  opacity?: number;
  animate?: boolean;
}> = ({ className = '', opacity = 0.1, animate = true }) => {
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 1000"
        className={`absolute w-full h-full ${animate ? 'dragon-float' : ''}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Dragon design based on the teal dragon image */}
        <defs>
          <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39D7C9" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4ADED5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#59E5DC" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#39D7C9" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#4ADED5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#59E5DC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dragon silhouette - positioned in upper right */}
        <g transform="translate(650, 150) scale(0.8)">
          {/* Dragon head */}
          <path
            d="M50 100 C30 80, 20 60, 40 40 C60 20, 80 30, 90 50 C100 70, 95 85, 85 95 C75 105, 65 110, 50 100 Z"
            fill="url(#dragonGradient)"
            stroke="#2DB5A5"
            strokeWidth="1"
          />
          
          {/* Dragon horns/antlers */}
          <path
            d="M70 35 C75 20, 80 15, 85 10 M80 30 C85 18, 92 12, 98 8 M85 40 C95 28, 105 20, 115 15"
            stroke="url(#dragonGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Dragon eye */}
          <circle cx="65" cy="55" r="3" fill="#39D7C9" opacity="0.8" />
          
          {/* Dragon neck/body curve */}
          <path
            d="M50 100 C40 120, 35 140, 45 160 C55 180, 70 190, 85 185 C100 180, 110 165, 105 150"
            fill="none"
            stroke="url(#dragonGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Dragon spines/ridges */}
          <path
            d="M60 110 L65 105 M70 125 L75 120 M80 140 L85 135 M90 155 L95 150"
            stroke="#39D7C9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Breath/flame effect */}
          <g className={animate ? 'dragon-breath' : ''}>
            <path
              d="M30 90 C15 85, 5 80, -10 75 C-25 70, -35 65, -45 60"
              stroke="url(#breathGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M25 95 C10 92, 0 88, -15 83 C-30 78, -40 73, -50 68"
              stroke="url(#breathGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M35 85 C20 82, 10 78, -5 73 C-20 68, -30 63, -40 58"
              stroke="url(#breathGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Additional decorative elements - smaller dragons */}
        <g transform="translate(100, 600) scale(0.3) rotate(-15)" opacity="0.3">
          <path
            d="M50 100 C30 80, 20 60, 40 40 C60 20, 80 30, 90 50 C100 70, 95 85, 85 95 C75 105, 65 110, 50 100 Z"
            fill="url(#dragonGradient)"
          />
          <path
            d="M30 90 C15 85, 5 80, -10 75"
            stroke="url(#breathGradient)"
            strokeWidth="2"
            fill="none"
          />
        </g>

        <g transform="translate(800, 700) scale(0.25) rotate(45)" opacity="0.2">
          <path
            d="M50 100 C30 80, 20 60, 40 40 C60 20, 80 30, 90 50 C100 70, 95 85, 85 95 C75 105, 65 110, 50 100 Z"
            fill="url(#dragonGradient)"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Animated Dragon Particles - Small dragon elements that float across screen
 */
export const DragonParticles: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute dragon-particle"
          style={{
            left: '-100px',
            top: `${20 + i * 30}%`,
            animationDelay: `${i * 8}s`,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            className="opacity-20"
          >
            <path
              d="M50 60 C35 45, 30 30, 45 20 C60 10, 75 20, 80 35 C85 50, 82 58, 75 62 C68 66, 62 67, 50 60 Z"
              fill="#39D7C9"
            />
            <path
              d="M35 55 C25 52, 18 48, 8 45"
              stroke="#39D7C9"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default DragonBackground;