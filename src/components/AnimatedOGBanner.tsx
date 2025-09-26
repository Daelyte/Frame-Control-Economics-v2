import React, { useRef, useEffect, useState } from 'react';

interface AnimatedOGBannerProps {
  className?: string;
  priority?: boolean;
}

const AnimatedOGBanner: React.FC<AnimatedOGBannerProps> = ({ 
  className = '', 
  priority = false 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Ensure video plays (some browsers need explicit play call)
      video.play().catch(() => {
        // Autoplay might be blocked, that's fine - user can still see static frame
      });
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    // Fallback to static OG image
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
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        poster="/og-image.jpg"
        aria-label="Frame Economics animated banner"
      >
        <source src="/og_animated_seamless.webm" type="video/webm" />
        <source src="/og_animated_seamless.mp4" type="video/mp4" />
        
        {/* Fallback for browsers that don't support video */}
        <img
          src="/og-image.jpg"
          alt="Frame Economics - Master Behavioral Psychology & Influence"
          className="w-full h-full object-cover"
        />
      </video>
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-teal-200 text-sm">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Accessibility overlay for screen readers */}
      <div className="sr-only">
        Animated banner showcasing Frame Economics branding with knight chess piece symbolizing strategic thinking and behavioral psychology mastery.
      </div>
    </div>
  );
};

export default AnimatedOGBanner;