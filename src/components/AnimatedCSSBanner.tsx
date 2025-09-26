import React, { useEffect } from 'react';

interface AnimatedCSSBannerProps {
  className?: string;
}

const AnimatedCSSBanner: React.FC<AnimatedCSSBannerProps> = ({ className = '' }) => {
  useEffect(() => {
    // Inject the CSS styles once
    const styleId = 'animated-banner-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .animated-hero {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 1.375rem;
          overflow: hidden;
          background:
            radial-gradient(140% 140% at 10% 10%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.5) 100%),
            radial-gradient(100% 120% at 20% 10%, #0f2a33 0%, #07181b 45%, #041013 100%),
            url("/og-image.jpg") center/112% 112% no-repeat;
          background-size: cover, cover, 112% 112%;
          animation: kenburns 14s ease-in-out infinite alternate;
          isolation: isolate;
        }

        .animated-hero::before {
          content: "";
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background:
            repeating-linear-gradient(to right, rgba(57,215,201,0.06) 0 1px, transparent 1px 44px),
            repeating-linear-gradient(to bottom, rgba(57,215,201,0.05) 0 1px, transparent 1px 44px);
          mix-blend-mode: screen;
          opacity: 0.65;
          animation: gridmove 12s linear infinite;
          pointer-events: none;
        }

        .animated-hero::after {
          content: "";
          position: absolute;
          left: 74%;
          top: 52%;
          width: 44vmin;
          height: 44vmin;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle at 50% 50%, 
            rgba(57,215,201,0.32), 
            rgba(57,215,201,0.07) 60%, 
            transparent 72%
          );
          filter: blur(24px);
          mix-blend-mode: screen;
          animation: pulse 3.6s ease-in-out infinite;
          pointer-events: none;
        }

        .animated-sweep {
          position: absolute;
          top: -10%; right: -10%; bottom: -10%; left: -10%;
          background: linear-gradient(
            110deg, 
            transparent 0%, 
            rgba(255,255,255,0.03) 40%, 
            rgba(255,255,255,0.10) 50%, 
            rgba(255,255,255,0.03) 60%, 
            transparent 100%
          );
          transform: translateX(-60%);
          mix-blend-mode: screen;
          filter: blur(0.4px);
          animation: sweep 7s ease-in-out infinite;
          pointer-events: none;
        }

        .animated-grain {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          opacity: 0.12;
          mix-blend-mode: overlay;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
          background-size: 220px 220px;
          animation: grainShift 1.6s steps(2) infinite;
          pointer-events: none;
        }

        @keyframes kenburns {
          0% { background-position: 52% 48%; background-size: 110%; }
          100% { background-position: 48% 52%; background-size: 116%; }
        }

        @keyframes gridmove {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 44px 44px, 44px 44px; }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.85; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        }

        @keyframes sweep {
          0% { transform: translateX(-65%) rotate(0.001deg); }
          100% { transform: translateX(65%) rotate(0.001deg); }
        }

        @keyframes grainShift {
          0% { background-position: 0 0; }
          100% { background-position: 160px -160px; }
        }

        @media (max-width: 768px) {
          .animated-hero::after {
            width: 35vmin;
            height: 35vmin;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="animated-hero">
        <div className="animated-sweep" aria-hidden="true"></div>
        <div className="animated-grain" aria-hidden="true"></div>
        
        {/* Content overlay - shows when OG image is not available */}
        <div className="absolute inset-0 flex items-center justify-between p-6 md:p-12">
          <div className="text-left max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-[#b8fff6] leading-none mb-3 drop-shadow-lg">
              FRAME<br/>ECONOMICS
            </h1>
            <p className="text-lg md:text-2xl text-[#9ee7de] mb-4">
              Master Behavioral Psychology & Influence
            </p>
            <p className="text-base md:text-lg text-[#cdeeed] opacity-90">
              Rules • Science • Case Studies
            </p>
            <div className="mt-6 px-4 py-2 border border-[#39D7C9] rounded-full text-[#7fe7db] text-sm">
              icecoldfroste.com
            </div>
          </div>
          
          {/* Chess knight symbol */}
          <div className="text-right text-[#39D7C9] opacity-30 hidden sm:block">
            <div className="text-6xl md:text-9xl">♞</div>
          </div>
        </div>
      </div>

      {/* Accessibility description */}
      <div className="sr-only">
        Animated Frame Economics banner featuring chess knight piece with teal glow effects, 
        moving tech grid overlay, and subtle light sweep animations showcasing strategic 
        behavioral psychology mastery.
      </div>
    </div>
  );
};

export default AnimatedCSSBanner;