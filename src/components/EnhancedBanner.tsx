import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';

interface BannerVariant {
  id: string;
  name: string;
  src: string;
  description: string;
  theme: 'light' | 'dark';
}

// Banner variants based on your generated images
const BANNER_VARIANTS: BannerVariant[] = [
  {
    id: 'og-light',
    name: 'Original Light',
    src: '/og-earth-dragon.png', // Your existing light banner
    description: 'Clean teal dragon on light background',
    theme: 'light'
  },
  {
    id: 'og-dark',
    name: 'Dark Gradient',
    src: '/og-dragon-dark.png', // We'll add the dark version
    description: 'Dragon silhouette on dark gradient with topo lines',
    theme: 'dark'
  },
  {
    id: 'og-professional',
    name: 'Professional',
    src: '/og-dragon-pro.png', // Professional variant
    description: 'Corporate style with subtle dragon',
    theme: 'dark'
  }
];

interface EnhancedBannerProps {
  className?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  defaultVariant?: string;
}

export const EnhancedBanner: React.FC<EnhancedBannerProps> = ({ 
  className = '', 
  showControls = false,
  autoRotate = false,
  defaultVariant = 'og-light'
}) => {
  const [currentVariant, setCurrentVariant] = useState(defaultVariant);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const current = BANNER_VARIANTS.find(v => v.id === currentVariant) || BANNER_VARIANTS[0];

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setCurrentVariant(prev => {
        const currentIndex = BANNER_VARIANTS.findIndex(v => v.id === prev);
        const nextIndex = (currentIndex + 1) % BANNER_VARIANTS.length;
        return BANNER_VARIANTS[nextIndex].id;
      });
    }, 8000); // Switch every 8 seconds

    return () => clearInterval(interval);
  }, [autoRotate]);

  const nextVariant = () => {
    const currentIndex = BANNER_VARIANTS.findIndex(v => v.id === currentVariant);
    const nextIndex = (currentIndex + 1) % BANNER_VARIANTS.length;
    setCurrentVariant(BANNER_VARIANTS[nextIndex].id);
  };

  const prevVariant = () => {
    const currentIndex = BANNER_VARIANTS.findIndex(v => v.id === currentVariant);
    const prevIndex = currentIndex === 0 ? BANNER_VARIANTS.length - 1 : currentIndex - 1;
    setCurrentVariant(BANNER_VARIANTS[prevIndex].id);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Main Banner Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-700/50">
        <div className="aspect-[1200/630] max-h-[50vh] sm:max-h-[70vh] relative">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Error State - Fallback to CSS Dragon */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">🐉</div>
                <h2 className="text-2xl font-bold mb-2">Frame Economics</h2>
                <p className="text-teal-300">Master Behavioral Psychology & Influence</p>
              </div>
            </div>
          )}

          {/* Main Banner Image */}
          <img
            src={current.src}
            alt={`Frame Economics - ${current.description}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Variant Indicator */}
          {showControls && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                {current.name}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {showControls && (
            <>
              <button
                onClick={prevVariant}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous banner variant"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextVariant}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next banner variant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Variant Selector */}
        {showControls && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              {BANNER_VARIANTS.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setCurrentVariant(variant.id)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    variant.id === currentVariant
                      ? 'bg-teal-400'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  title={variant.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Banner Info (when controls are shown) */}
      {showControls && (
        <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <Palette className="w-4 h-4 inline mr-1" />
            {current.description}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Simple banner component for use in sections without controls
 */
export const SimpleBanner: React.FC<{
  variant?: string;
  className?: string;
}> = ({ variant = 'og-light', className = '' }) => {
  return (
    <EnhancedBanner 
      className={className}
      defaultVariant={variant}
      showControls={false}
      autoRotate={false}
    />
  );
};

/**
 * Interactive banner with all controls
 */
export const InteractiveBanner: React.FC<{
  className?: string;
  autoRotate?: boolean;
}> = ({ className = '', autoRotate = false }) => {
  return (
    <EnhancedBanner 
      className={className}
      showControls={true}
      autoRotate={autoRotate}
    />
  );
};

export default EnhancedBanner;