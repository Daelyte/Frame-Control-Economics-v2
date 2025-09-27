import React from 'react';
import '../styles/animated-banner.css';

interface AnimatedCSSBannerProps {
  className?: string;
}

const AnimatedCSSBanner: React.FC<AnimatedCSSBannerProps> = ({ className = '' }) => {

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