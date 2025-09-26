"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useAdaptiveQuality } from '../../utils/qualityTier';

interface DragonSceneProps {
  debug?: boolean;
}

/**
 * DragonScene - Terror-Optimized CSS/SVG Dragon
 * 
 * Menacing effects optimized for compositor:
 * - Irregular lightning flashes every 18-26s
 * - Slow menacing eye glow and pupil dilation
 * - Breathing mist with 14-22s drift
 * - Tiny eye brightness ping synced to lightning
 * 
 * All animations use transform/opacity only for GPU acceleration
 */
export const DragonScene: React.FC<DragonSceneProps> = ({ debug = false }) => {
  const { tier, settings } = useAdaptiveQuality();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [lightningTime, setLightningTime] = useState(0);
  const animationRef = useRef<number>();

  // Performance guardrails
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsRunning(!document.hidden);
    };

    const handleReducedMotion = (e: MediaQueryListEvent) => {
      setIsRunning(!e.matches);
    };

    // Tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', handleReducedMotion);
    setIsRunning(!mediaQuery.matches);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleReducedMotion);
    };
  }, []);

  // Lightning timing controller
  useEffect(() => {
    if (!isRunning || !settings.lightningEnabled) return;

    let lastTime = 0;
    let nextLightning = Math.random() * 18000 + 18000; // 18-36s random

    const updateLightning = (currentTime: number) => {
      if (currentTime - lastTime >= nextLightning) {
        setLightningTime(currentTime);
        lastTime = currentTime;
        nextLightning = Math.random() * 8000 + 18000; // Next in 18-26s
      }
      
      animationRef.current = requestAnimationFrame(updateLightning);
    };

    animationRef.current = requestAnimationFrame(updateLightning);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, settings.lightningEnabled]);

  // Calculate dynamic values
  const dragonHue = 170; // Jade
  const primaryColor = `oklch(65% 0.11 ${dragonHue})`;
  const secondaryColor = `oklch(50% 0.12 ${dragonHue})`;
  const eyeGlowColor = `oklch(75% 0.15 ${dragonHue})`;
  
  // Lightning flash detection (recent flash)
  const recentFlash = Date.now() - lightningTime < 500;

  return (
    <>
      <div
        ref={containerRef}
        className="dragon-terror-layer"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          contain: 'layout paint size style',
          transform: 'translateZ(0)', // Promote to compositor
          ...(debug && {
            outline: '2px solid red',
            zIndex: 9998
          })
        }}
        aria-hidden="true"
      >
        {/* Atmospheric Layers */}
        {Array.from({ length: settings.dragonLayers }).map((_, i) => (
          <div
            key={`atmosphere-${i}`}
            className="dragon-atmosphere"
            style={{
              position: 'absolute',
              top: `${-5 - i * 2}%`,
              left: `${-5 - i * 2}%`,
              width: `${110 + i * 4}%`,
              height: `${110 + i * 4}%`,
              background: i === 0 
                ? `conic-gradient(from ${180 + i * 30}deg at 50% 50%, ${primaryColor} 0deg, oklch(70% 0.15 95) 120deg, ${secondaryColor} 240deg, ${primaryColor} 360deg)`
                : `radial-gradient(60% 60% at 50% 40%, ${primaryColor}${Math.round(0.03 * (3-i) * 100).toString(16)}, transparent)`,
              opacity: settings.opacity * (1 - i * 0.3),
              filter: `blur(${settings.blur + i * 20}px)`,
              animation: isRunning ? `dragon-breathing-${i} ${settings.animationDuration.breathing + i * 2}s ease-in-out infinite` : 'none',
              // Lightning pulse enhancement
              ...(recentFlash && settings.lightningEnabled && {
                filter: `blur(${settings.blur + i * 20}px) brightness(1.2)`,
                opacity: settings.opacity * (1 - i * 0.3) * 1.3
              })
            }}
          />
        ))}

        {/* Rain Layers */}
        {Array.from({ length: settings.rainLayers }).map((_, i) => (
          <div
            key={`rain-${i}`}
            className="dragon-rain"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `repeating-linear-gradient(${12 + i * 2}deg, transparent 0px, transparent ${38 + i * 8}px, rgba(64, 224, 208, ${0.12 - i * 0.02}) ${38 + i * 8}px, rgba(64, 224, 208, ${0.12 - i * 0.02}) ${40 + i * 8}px)`,
              animation: isRunning ? `dragon-rain-${i} ${3.6 + i * 1.0}s linear infinite` : 'none',
              opacity: settings.lightningEnabled ? 1 : 0.7
            }}
          />
        ))}

        {/* Dragon Head Silhouette */}
        <div
          className="dragon-head"
          style={{
            position: 'absolute',
            top: '22%',
            left: '18%',
            width: '320px',
            height: '180px',
            border: `3px solid ${primaryColor}`,
            borderRadius: '45% 35% 85% 15%', // More dragon-like head shape
            background: `radial-gradient(ellipse 60% 40% at 40% 35%, ${primaryColor}22, transparent 70%)`,
            opacity: settings.opacity + 0.2,
            animation: isRunning ? `dragon-head-breathing ${settings.animationDuration.breathing}s ease-in-out infinite` : 'none',
            // Breathing amplitude based on quality
            '--breathing-amplitude': `${settings.breathingAmplitude}`,
            // Lightning enhancement
            ...(recentFlash && {
              borderColor: eyeGlowColor,
              filter: `drop-shadow(0 0 15px ${primaryColor})`
            })
          } as React.CSSProperties}
        >
          {/* Menacing Eye */}
          <div
            className="dragon-eye"
            style={{
              position: 'absolute',
              top: '38%',
              right: '35%',
              width: settings.glowEnabled ? '12px' : '8px',
              height: settings.glowEnabled ? '12px' : '8px',
              background: recentFlash ? eyeGlowColor : primaryColor,
              borderRadius: '50%',
              boxShadow: settings.glowEnabled 
                ? `0 0 ${recentFlash ? '20px' : '12px'} ${recentFlash ? eyeGlowColor : primaryColor}` 
                : 'none',
              animation: isRunning ? `dragon-eye-menace ${settings.animationDuration.eyeBlink}s ease-in-out infinite` : 'none',
              // Lightning flash ping
              ...(recentFlash && {
                transform: 'scale(1.4)',
                transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
              })
            }}
          />

          {/* Nostril Glow (high quality only) */}
          {settings.tier === 'high' && (
            <div
              className="dragon-nostril"
              style={{
                position: 'absolute',
                top: '55%',
                right: '45%',
                width: '6px',
                height: '3px',
                background: `linear-gradient(45deg, ${primaryColor}, transparent)`,
                borderRadius: '50%',
                opacity: 0.6,
                animation: isRunning ? `dragon-nostril-glow ${settings.animationDuration.breathing * 0.5}s ease-in-out infinite` : 'none'
              }}
            />
          )}
        </div>

        {/* Lightning Flash Overlay */}
        {settings.lightningEnabled && (
          <div
            className="lightning-flash"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: recentFlash 
                ? `radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
                : 'transparent',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
              animation: recentFlash ? 'dragon-lightning-burst 0.4s ease-out' : 'none'
            }}
          />
        )}

        {/* Particles/Mist (high quality only) */}
        {settings.particlesEnabled && (
          <div
            className="dragon-mist"
            style={{
              position: 'absolute',
              top: '40%',
              left: '35%',
              width: '200px',
              height: '100px',
              background: `radial-gradient(ellipse, ${primaryColor}08, transparent)`,
              borderRadius: '50%',
              animation: isRunning ? `dragon-mist-drift ${settings.animationDuration.breathing * 1.5}s ease-in-out infinite` : 'none',
              opacity: 0.4
            }}
          />
        )}
      </div>

      {/* CSS Keyframes - Compositor-Only Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Breathing animations - different phases for each layer */
          @keyframes dragon-breathing-0 {
            0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: ${settings.opacity}; }
            25% { transform: translateY(-${settings.breathingAmplitude * 100}%) scale(1.005) rotate(0.1deg); opacity: ${settings.opacity * 1.1}; }
            50% { transform: translateY(-${settings.breathingAmplitude * 150}%) scale(1.01) rotate(0deg); opacity: ${settings.opacity * 1.2}; }
            75% { transform: translateY(-${settings.breathingAmplitude * 100}%) scale(1.005) rotate(-0.1deg); opacity: ${settings.opacity * 1.1}; }
          }
          @keyframes dragon-breathing-1 {
            0%, 100% { transform: translateY(0) scale(1); opacity: ${settings.opacity * 0.7}; }
            30% { transform: translateY(${settings.breathingAmplitude * 80}%) scale(1.008); opacity: ${settings.opacity * 0.9}; }
            70% { transform: translateY(${settings.breathingAmplitude * 120}%) scale(1.012); opacity: ${settings.opacity * 0.8}; }
          }
          @keyframes dragon-breathing-2 {
            0%, 100% { transform: translateY(0) scale(1); opacity: ${settings.opacity * 0.4}; }
            40% { transform: translateY(-${settings.breathingAmplitude * 60}%) scale(1.006); opacity: ${settings.opacity * 0.6}; }
            80% { transform: translateY(-${settings.breathingAmplitude * 90}%) scale(1.009); opacity: ${settings.opacity * 0.5}; }
          }
          
          /* Head breathing - more subtle */
          @keyframes dragon-head-breathing {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-${settings.breathingAmplitude * 200}%) scale(${1 + settings.breathingAmplitude}); }
          }
          
          /* Menacing eye glow with irregular blinks */
          @keyframes dragon-eye-menace {
            0% { opacity: 1; transform: scale(1); }
            15% { opacity: 0.8; transform: scale(0.95); }
            20% { opacity: 0.2; transform: scale(0.9); } /* Blink */
            25% { opacity: 1; transform: scale(1); }
            40% { opacity: 1.1; transform: scale(1.05); } /* Glow */
            60% { opacity: 0.9; transform: scale(0.98); }
            85% { opacity: 1; transform: scale(1); }
            92% { opacity: 0.3; transform: scale(0.9); } /* Quick blink */
            96% { opacity: 1; transform: scale(1); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          /* Rain animations */
          ${Array.from({ length: settings.rainLayers }).map((_, i) => `
            @keyframes dragon-rain-${i} {
              0% { background-position: 0 0; }
              100% { background-position: -${140 + i * 50}px ${260 + i * 100}px; }
            }
          `).join('')}
          
          /* Lightning burst */
          @keyframes dragon-lightning-burst {
            0% { opacity: 0; transform: scale(0.8); }
            10% { opacity: 0.8; transform: scale(1.1); }
            20% { opacity: 0.4; transform: scale(1); }
            40% { opacity: 0.6; transform: scale(1.05); }
            70% { opacity: 0.2; transform: scale(0.95); }
            100% { opacity: 0; transform: scale(0.9); }
          }
          
          /* Nostril glow */
          @keyframes dragon-nostril-glow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.2); }
          }
          
          /* Mist drift */
          @keyframes dragon-mist-drift {
            0% { transform: translateX(0) rotate(0deg); opacity: 0.4; }
            25% { transform: translateX(-10px) rotate(1deg); opacity: 0.6; }
            50% { transform: translateX(5px) rotate(0deg); opacity: 0.3; }
            75% { transform: translateX(-5px) rotate(-0.5deg); opacity: 0.5; }
            100% { transform: translateX(0) rotate(0deg); opacity: 0.4; }
          }
          
          /* Disable animations for reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .dragon-terror-layer * {
              animation: none !important;
              transition: none !important;
            }
          }
        `
      }} />

      {/* Debug Panel */}
      {debug && (
        <div style={{
          position: 'fixed',
          top: '50px',
          right: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '11px',
          fontFamily: 'monospace',
          zIndex: 10001,
          maxWidth: '200px'
        }}>
          <div>🐉 Terror Dragon Active</div>
          <div>Quality: {tier}</div>
          <div>Layers: {settings.dragonLayers}</div>
          <div>Rain: {settings.rainLayers}</div>
          <div>Lightning: {settings.lightningEnabled ? '⚡' : '❌'}</div>
          <div>Glow: {settings.glowEnabled ? '✨' : '❌'}</div>
          <div>Particles: {settings.particlesEnabled ? '💨' : '❌'}</div>
          <div>FPS Target: {settings.targetFPS}</div>
          <div>Running: {isRunning ? '✅' : '⏸️'}</div>
          <div>Recent Flash: {recentFlash ? '⚡' : '—'}</div>
        </div>
      )}
    </>
  );
};

export default DragonScene;