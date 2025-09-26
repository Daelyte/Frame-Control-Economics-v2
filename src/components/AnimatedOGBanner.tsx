import React, { useState } from 'react';

interface AnimatedOGBannerProps {
  className?: string;
  priority?: boolean;
}

const AnimatedOGBanner: React.FC<AnimatedOGBannerProps> = ({ 
  className = '', 
  priority = false 
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    // Fallback to old image if dragon image fails
    return (
      <img
        src="/og-image.jpg"
        alt="Frame Economics - Master Behavioral Psychology & Influence"
        className={`w-full h-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Dragon-themed animated hero */}
      <div className="animated-hero w-full h-full">
        {/* Animated sweep effect */}
        <div className="animated-sweep" aria-hidden="true"></div>
        
        {/* Animated grain texture */}
        <div className="animated-grain" aria-hidden="true"></div>
        
        {/* Dragon OG Image */}
        <img
          src="/dragon-og.png"
          alt="Frame Economics - Master Behavioral Psychology & Influence with Dragon Theme"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          style={{ mixBlendMode: 'multiply' }}
          loading={priority ? "eager" : "lazy"}
          onError={handleError}
        />
      </div>
      
      {/* Accessibility overlay for screen readers */}
      <div className="sr-only">
        Animated dragon-themed banner showcasing Frame Economics branding with mystical dragon symbolizing power, wisdom, and behavioral psychology mastery.
      </div>
    </div>
  );
};

export default AnimatedOGBanner;