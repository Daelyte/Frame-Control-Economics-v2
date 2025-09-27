import React from 'react';
import '../styles/enhanced-animations.css';
import { DragonBackground, DragonParticles } from './DragonBackground';

/**
 * Floating Shapes Component - Creates moving geometric shapes
 */
export const FloatingShapes: React.FC = () => {
  return (
    <div className="floating-shapes" aria-hidden="true">
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
    </div>
  );
};

/**
 * Particle System Component - Creates floating particles
 */
export const ParticleSystem: React.FC<{ density?: 'light' | 'normal' | 'dense' }> = ({ 
  density = 'normal' 
}) => {
  const particleCount = density === 'light' ? 4 : density === 'dense' ? 12 : 8;
  
  return (
    <div className="particles-container" aria-hidden="true">
      {Array.from({ length: particleCount }, (_, i) => (
        <div key={i} className="particle"></div>
      ))}
    </div>
  );
};

/**
 * Morphing Blobs Component - Creates shape-shifting background elements
 */
export const MorphingBlobs: React.FC<{ count?: number }> = ({ count = 2 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div 
          key={i}
          className="morphing-blob"
          style={{
            width: `${120 + i * 20}px`,
            height: `${120 + i * 20}px`,
            top: `${20 + i * 40}%`,
            right: `${10 + i * 30}%`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Glowing Orbs Component - Creates orbiting light effects
 */
export const GlowingOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="glowing-orb" style={{ top: '10%', left: '20%' }}></div>
      <div className="glowing-orb" style={{ top: '60%', left: '70%' }}></div>
    </div>
  );
};

/**
 * Enhanced Section Background - Combines multiple animation effects
 */
interface EnhancedSectionBackgroundProps {
  variant?: 'intro' | 'rules' | 'assessment' | 'community';
  intensity?: 'subtle' | 'normal' | 'vibrant';
}

export const EnhancedSectionBackground: React.FC<EnhancedSectionBackgroundProps> = ({ 
  variant = 'intro', 
  intensity = 'normal' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rules':
        return 'animated-gradient-bg bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-50/50 dark:from-purple-900/20 dark:via-blue-900/10 dark:to-indigo-900/20';
      case 'assessment':
        return 'animated-gradient-bg bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-purple-900/20';
      case 'community':
        return 'animated-gradient-bg bg-gradient-to-br from-green-50/50 via-teal-50/30 to-blue-50/50 dark:from-green-900/20 dark:via-teal-900/10 dark:to-blue-900/20';
      default:
        return 'animated-gradient-bg bg-gradient-to-br from-slate-50/80 via-purple-50/30 to-blue-50/80 dark:from-slate-900/80 dark:via-purple-900/30 dark:to-blue-900/80';
    }
  };

  return (
    <div className={`absolute inset-0 ${getVariantStyles()}`} aria-hidden="true">
      {/* Dragon background - always subtle */}
      <DragonBackground opacity={variant === 'intro' ? 0.08 : 0.05} animate={intensity !== 'subtle'} />
      {intensity !== 'subtle' && <FloatingShapes />}
      {intensity === 'vibrant' && <ParticleSystem density="dense" />}
      {intensity === 'normal' && <ParticleSystem density="normal" />}
      {intensity === 'vibrant' && <MorphingBlobs count={3} />}
      {intensity !== 'subtle' && <GlowingOrbs />}
      {/* Dragon particles for intro section */}
      {variant === 'intro' && intensity !== 'subtle' && <DragonParticles count={2} />}
    </div>
  );
};

/**
 * Enhanced Card Wrapper - Adds subtle glow effects to cards
 */
interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  className = '', 
  glow = false 
}) => {
  return (
    <div className={`${glow ? 'card-glow' : ''} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Enhanced Button - Adds ripple effects and animations
 */
interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700';
      case 'ghost':
        return 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
      default:
        return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        btn-enhanced
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-lg font-semibold shadow-md hover:shadow-lg 
        transition-all duration-300 transform hover:scale-105
        ${className}
      `}
    >
      {children}
    </button>
  );
};

/**
 * Text Float Animation Wrapper
 */
export const FloatingText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => {
  return (
    <span 
      className="text-float inline-block" 
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  );
};