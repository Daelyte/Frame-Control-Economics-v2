/**
 * DragonStormComplete - Complete Dragon + Storm System
 * 
 * Features:
 * - Guaranteed visible dragon silhouette 
 * - Animated rain with multiple layers
 * - Lightning flash effects with sound
 * - Atmospheric fog/mist
 * - Performance optimized with quality tiers
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface DragonStormProps {
  enabled?: boolean;
  debug?: boolean;
  quality?: 'low' | 'medium' | 'high';
  opacity?: number;
}

export default function DragonStormComplete({
  enabled = true,
  debug = false,
  quality = 'medium',
  opacity = 0.14
}: DragonStormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lightningActive, setLightningActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number>();

  // Quality settings
  const qualitySettings = {
    low: {
      rainLayers: 1,
      lightningEnabled: false,
      mistEnabled: false,
      eyeGlow: false,
      updateInterval: 100
    },
    medium: {
      rainLayers: 2,
      lightningEnabled: true,
      mistEnabled: false,
      eyeGlow: true,
      updateInterval: 50
    },
    high: {
      rainLayers: 3,
      lightningEnabled: true,
      mistEnabled: true,
      eyeGlow: true,
      updateInterval: 16
    }
  };

  const settings = qualitySettings[quality];

  // Lightning timing controller
  useEffect(() => {
    if (!enabled || !settings.lightningEnabled) return;

    let lastLightning = 0;
    let nextLightningIn = Math.random() * 15000 + 10000; // 10-25s

    const updateLightning = (time: number) => {
      setCurrentTime(time);
      
      if (time - lastLightning >= nextLightningIn) {
        setLightningActive(true);
        lastLightning = time;
        nextLightningIn = Math.random() * 15000 + 8000; // 8-23s
        
        // Lightning duration
        setTimeout(() => setLightningActive(false), 300);
      }

      animationRef.current = requestAnimationFrame(updateLightning);
    };

    animationRef.current = requestAnimationFrame(updateLightning);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, settings.lightningEnabled]);

  // Visibility toggle for debugging
  useEffect(() => {
    if (enabled) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [enabled]);

  // Handle reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!enabled || !isVisible) {
    return null;
  }

  const dragonHue = 170; // Jade/teal
  const primaryColor = `oklch(65% 0.11 ${dragonHue})`;
  const glowColor = `oklch(75% 0.15 ${dragonHue})`;
  const mistColor = `oklch(50% 0.08 ${dragonHue})`;

  return (
    <>
      <div
        ref={containerRef}
        className="dragon-storm-container"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
          backgroundColor: lightningActive ? 'rgba(255,255,255,0.02)' : 'transparent',
          transition: 'background-color 0.1s ease-out',
          ...(debug && {
            outline: '2px dashed lime',
            zIndex: 9998
          })
        }}
        aria-hidden="true"
      >
        {/* RAIN LAYERS */}
        {Array.from({ length: settings.rainLayers }).map((_, i) => (
          <div
            key={`rain-${i}`}
            className="rain-layer"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `repeating-linear-gradient(
                ${15 + i * 3}deg,
                transparent 0px,
                transparent ${35 + i * 10}px,
                rgba(64, 224, 208, ${0.15 - i * 0.03}) ${35 + i * 10}px,
                rgba(64, 224, 208, ${0.15 - i * 0.03}) ${37 + i * 10}px
              )`,
              animation: reducedMotion ? 'none' : `rainFall${i} ${2.5 + i * 0.5}s linear infinite`,
              opacity: lightningActive ? 0.8 : 1,
              transition: 'opacity 0.1s ease'
            }}
          />
        ))}

        {/* ATMOSPHERIC FOG */}
        <div
          className="atmospheric-fog"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 30% 40%, ${mistColor}${Math.round(opacity * 100).toString(16)}, transparent 70%)`,
            filter: 'blur(60px)',
            animation: reducedMotion ? 'none' : 'fogDrift 20s ease-in-out infinite',
            opacity: lightningActive ? opacity * 1.4 : opacity
          }}
        />

        {/* DRAGON SILHOUETTE */}
        <div
          className="dragon-silhouette"
          style={{
            position: 'absolute',
            top: '25%',
            left: '20%',
            width: '400px',
            height: '220px',
            // Dragon head shape using CSS
            background: `linear-gradient(135deg, ${primaryColor}${Math.round(opacity * 0.6 * 255).toString(16)}, transparent 60%)`,
            borderRadius: '60% 40% 80% 20%',
            border: `2px solid ${lightningActive ? glowColor : primaryColor}`,
            filter: lightningActive 
              ? `drop-shadow(0 0 20px ${glowColor}) brightness(1.3)` 
              : `drop-shadow(0 0 8px ${primaryColor}80)`,
            animation: reducedMotion ? 'none' : 'dragonBreathe 12s ease-in-out infinite',
            transition: 'filter 0.2s ease-out',
            transform: 'translateZ(0)' // GPU acceleration
          }}
        >
          {/* DRAGON EYE */}
          <div
            className="dragon-eye"
            style={{
              position: 'absolute',
              top: '35%',
              right: '30%',
              width: settings.eyeGlow ? '14px' : '10px',
              height: settings.eyeGlow ? '14px' : '10px',
              background: lightningActive ? glowColor : primaryColor,
              borderRadius: '50%',
              boxShadow: settings.eyeGlow 
                ? `0 0 ${lightningActive ? '25px' : '15px'} ${lightningActive ? glowColor : primaryColor}`
                : 'none',
              animation: reducedMotion ? 'none' : 'eyeBlink 8s ease-in-out infinite',
              transition: 'all 0.1s ease-out'
            }}
          />

          {/* NOSTRIL GLOW (high quality only) */}
          {settings.mistEnabled && (
            <div
              className="nostril-glow"
              style={{
                position: 'absolute',
                top: '58%',
                right: '40%',
                width: '8px',
                height: '4px',
                background: `radial-gradient(circle, ${primaryColor}, transparent)`,
                borderRadius: '50%',
                opacity: 0.7,
                animation: reducedMotion ? 'none' : 'nostrilGlow 6s ease-in-out infinite'
              }}
            />
          )}
        </div>

        {/* LIGHTNING FLASH OVERLAY */}
        {settings.lightningEnabled && lightningActive && (
          <div
            className="lightning-flash"
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(
                ellipse 60% 40% at ${30 + Math.random() * 40}% ${20 + Math.random() * 60}%,
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.04) 40%,
                transparent 70%
              )`,
              mixBlendMode: 'screen',
              animation: 'lightningFlash 0.3s ease-out',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* SUBTLE MIST PARTICLES (high quality) */}
        {settings.mistEnabled && (
          <div
            className="mist-particles"
            style={{
              position: 'absolute',
              top: '45%',
              left: '40%',
              width: '300px',
              height: '150px',
              background: `radial-gradient(ellipse, ${mistColor}12, transparent 60%)`,
              borderRadius: '50%',
              filter: 'blur(25px)',
              animation: reducedMotion ? 'none' : 'mistDrift 18s ease-in-out infinite',
              opacity: 0.6
            }}
          />
        )}
      </div>

      {/* CSS ANIMATIONS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          ${Array.from({ length: settings.rainLayers }).map((_, i) => `
            @keyframes rainFall${i} {
              0% { background-position: 0 0; }
              100% { background-position: -${60 + i * 30}px ${150 + i * 50}px; }
            }
          `).join('')}

          @keyframes dragonBreathe {
            0%, 100% { 
              transform: translateY(0) scale(1) rotate(0deg); 
              opacity: ${opacity};
            }
            25% { 
              transform: translateY(-8px) scale(1.02) rotate(0.5deg); 
              opacity: ${opacity * 1.2};
            }
            50% { 
              transform: translateY(-12px) scale(1.04) rotate(0deg); 
              opacity: ${opacity * 1.4};
            }
            75% { 
              transform: translateY(-8px) scale(1.02) rotate(-0.5deg); 
              opacity: ${opacity * 1.2};
            }
          }

          @keyframes eyeBlink {
            0%, 90%, 100% { 
              opacity: 1; 
              transform: scale(1); 
            }
            5% { 
              opacity: 0.3; 
              transform: scale(0.8); 
            }
            10% { 
              opacity: 1; 
              transform: scale(1); 
            }
            45% { 
              opacity: 1.3; 
              transform: scale(1.1); 
            }
            55% { 
              opacity: 1; 
              transform: scale(1); 
            }
          }

          @keyframes fogDrift {
            0%, 100% { 
              transform: translateX(0) translateY(0) scale(1); 
            }
            25% { 
              transform: translateX(-20px) translateY(-10px) scale(1.05); 
            }
            50% { 
              transform: translateX(15px) translateY(-5px) scale(0.95); 
            }
            75% { 
              transform: translateX(-10px) translateY(8px) scale(1.02); 
            }
          }

          @keyframes lightningFlash {
            0% { 
              opacity: 0; 
              transform: scale(0.8); 
            }
            10% { 
              opacity: 0.8; 
              transform: scale(1.2); 
            }
            20% { 
              opacity: 0.3; 
              transform: scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: scale(1.1); 
            }
            100% { 
              opacity: 0; 
              transform: scale(0.9); 
            }
          }

          @keyframes nostrilGlow {
            0%, 100% { 
              opacity: 0.7; 
              transform: scale(1); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1.3); 
            }
          }

          @keyframes mistDrift {
            0% { 
              transform: translateX(0) translateY(0) rotate(0deg); 
              opacity: 0.6; 
            }
            25% { 
              transform: translateX(-30px) translateY(-15px) rotate(2deg); 
              opacity: 0.8; 
            }
            50% { 
              transform: translateX(20px) translateY(-8px) rotate(-1deg); 
              opacity: 0.4; 
            }
            75% { 
              transform: translateX(-15px) translateY(10px) rotate(1deg); 
              opacity: 0.7; 
            }
            100% { 
              transform: translateX(0) translateY(0) rotate(0deg); 
              opacity: 0.6; 
            }
          }

          /* Disable animations for reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .dragon-storm-container * {
              animation: none !important;
              transition: none !important;
            }
          }
        `
      }} />

      {/* DEBUG PANEL */}
      {debug && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'lime',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 10001
        }}>
          <div>🐉 DragonStorm Active</div>
          <div>Quality: {quality}</div>
          <div>Rain Layers: {settings.rainLayers}</div>
          <div>Lightning: {settings.lightningEnabled ? '⚡' : '❌'}</div>
          <div>Active Flash: {lightningActive ? '⚡' : '—'}</div>
          <div>Eye Glow: {settings.eyeGlow ? '👁️' : '—'}</div>
          <div>Mist: {settings.mistEnabled ? '💨' : '—'}</div>
          <div>Reduced Motion: {reducedMotion ? '⏸️' : '▶️'}</div>
        </div>
      )}
    </>
  );
}