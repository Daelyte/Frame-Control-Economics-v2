import React, { useState, useEffect } from 'react';
import { getDeviceInfo } from '../utils/deviceDetection';
import { getDragonAsset, getDragonSize, checkDragonAssets, dragonPlaceholder } from '../utils/dragonAssets';

interface DragonOverlayProps {
  context: 'hero' | 'section' | 'watermark' | 'overlay';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'custom';
  customStyle?: React.CSSProperties;
  className?: string;
  animate?: boolean;
  parallax?: boolean;
}

const DragonOverlay: React.FC<DragonOverlayProps> = ({
  context,
  position = 'top-right',
  customStyle = {},
  className = '',
  animate = true,
  parallax = false
}) => {
  const [dragonAvailable, setDragonAvailable] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());

  useEffect(() => {
    // Check if dragon assets are available
    checkDragonAssets().then(setDragonAvailable);
    
    // Update device info on resize
    const handleResize = () => setDeviceInfo(getDeviceInfo());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get dragon asset based on context
  const dragonAsset = getDragonAsset(context);
  const dragonSize = getDragonSize(deviceInfo.screenSize);

  // Position mapping
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4 md:top-8 md:right-8';
      case 'top-left':
        return 'top-4 left-4 md:top-8 md:left-8';
      case 'bottom-right':
        return 'bottom-4 right-4 md:bottom-8 md:right-8';
      case 'bottom-left':
        return 'bottom-4 left-4 md:bottom-8 md:left-8';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4 md:top-8 md:right-8';
    }
  };

  // Animation classes
  const getAnimationClasses = () => {
    if (!animate) return '';
    
    const baseAnimation = 'transition-all duration-1000 ease-out';
    
    switch (context) {
      case 'hero':
        return `${baseAnimation} animate-float`;
      case 'overlay':
        return `${baseAnimation} hover:scale-105`;
      case 'watermark':
        return `${baseAnimation} opacity-30 hover:opacity-50`;
      default:
        return baseAnimation;
    }
  };

  // Parallax effect
  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const element = document.getElementById(`dragon-${context}`);
      if (element) {
        const yPos = -(scrolled * 0.3);
        element.style.transform = `translateY(${yPos}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax, context]);

  const dragonStyle: React.CSSProperties = {
    width: dragonSize.split(' ')[0],
    height: dragonSize.split(' ')[1],
    backgroundImage: `url('${dragonAvailable ? dragonAsset.path : dragonPlaceholder}')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    pointerEvents: 'none',
    zIndex: context === 'watermark' ? -1 : 1,
    opacity: context === 'watermark' ? 0.15 : 1,
    ...customStyle
  };

  return (
    <div
      id={`dragon-${context}`}
      className={`
        absolute select-none
        ${getPositionClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
      style={dragonStyle}
      aria-hidden="true"
    >
      {/* Glow effect for hero context */}
      {context === 'hero' && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(57,215,201,0.1) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: -1
          }}
        />
      )}
      
      {/* Interactive hover effect */}
      {context === 'overlay' && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </div>
  );
};

/**
 * Specialized Dragon Components for common use cases
 */

// Hero Dragon - Large, prominent, animated
export const HeroDragon: React.FC<{ className?: string }> = ({ className }) => (
  <DragonOverlay
    context="hero"
    position="top-right"
    animate={true}
    parallax={true}
    className={`hidden md:block ${className}`}
  />
);

// Section Dragon - Medium, subtle, corner placement
export const SectionDragon: React.FC<{ position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }> = ({ 
  position = 'top-right' 
}) => (
  <DragonOverlay
    context="section"
    position={position}
    animate={true}
    className="hidden lg:block opacity-40 hover:opacity-60 transition-opacity duration-500"
  />
);

// Watermark Dragon - Large, very subtle, centered
export const WatermarkDragon: React.FC = () => (
  <DragonOverlay
    context="watermark"
    position="center"
    animate={false}
    className="opacity-5 dark:opacity-10"
    customStyle={{ 
      width: '80vh', 
      height: '80vh',
      maxWidth: '800px',
      maxHeight: '800px'
    }}
  />
);

// Floating Dragon - Small, interactive, customizable
export const FloatingDragon: React.FC<{ 
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}> = ({ position, className }) => (
  <DragonOverlay
    context="overlay"
    position={position}
    animate={true}
    className={`group cursor-pointer ${className}`}
    customStyle={{ width: '120px', height: '120px' }}
  />
);

export default DragonOverlay;