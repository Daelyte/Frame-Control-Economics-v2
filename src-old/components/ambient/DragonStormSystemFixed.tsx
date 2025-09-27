// components/ambient/DragonStormSystem.tsx
// COMPOSITE STORM SYSTEM: Integrates proven animation patterns with Framer Motion
// Features: Aurora wash, multi-layer rain, lightning streaks, eye tracking, parallax scroll

'use client';

import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

type DragonStormProps = {
  hue?: number;              // 160-175 for jade/teal Frame Economics brand
  baseOpacity?: number;      // 0.08-0.18 dragon visibility
  rainIntensity?: 0|1|2;     // Rain system intensity
  lightning?: boolean;       // Lightning system enable
  eyeTracking?: boolean;     // Framer Motion eye cursor following
  parallaxScroll?: boolean;  // Scroll-linked background parallax
  idPrefix?: string;         // Unique IDs for multiple instances
  debugMode?: boolean;       // Debug overlay and performance info
};

export default function DragonStormSystem({
  hue = 170,
  baseOpacity = 0.12,
  rainIntensity = 1,
  lightning = true,
  eyeTracking = true,
  parallaxScroll = true,
  idPrefix = "storm",
  debugMode = false,
}: DragonStormProps) {
  // Enhanced OKLCH color system with fallbacks
  const jade600 = `oklch(58% 0.12 ${hue})`;
  const jade500 = `oklch(65% 0.11 ${hue})`;  
  const jade700 = `oklch(50% 0.12 ${hue})`;
  const jade400 = `oklch(72% 0.10 ${hue})`;
  const gold = `oklch(70% 0.15 95)`;
  const danger = `oklch(55% 0.18 25)`;
  const ink = `oklch(22% 0 0)`;

  // Hex fallbacks
  const jade600Hex = "#0F766E"; 
  const jade500Hex = "#14B8A6";  
  const jade700Hex = "#0D9488";
  const jade400Hex = "#2DD4BF";

  // Framer Motion values for eye tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Convert mouse position to eye movement (constrained)
  const eyeX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-6, 6]);
  const eyeY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-4, 4]);

  // Scroll parallax values
  const { scrollY } = useScroll();
  const auroraY = useTransform(scrollY, [0, 1000], [0, -100]);
  const rainParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const dragonScale = useTransform(scrollY, [0, 500], [1, 1.02]);

  // Performance monitoring
  const [performanceInfo, setPerformanceInfo] = useState({ fps: 60, layers: 0 });

  // Mouse tracking for eye following
  useEffect(() => {
    if (!eyeTracking) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [eyeTracking, mouseX, mouseY]);

  // Layer count calculation for mobile optimization
  useEffect(() => {
    const calculateLayers = () => {
      let layerCount = 1; // Base aurora
      if (rainIntensity > 0) layerCount += 3; // Rain layers
      if (rainIntensity === 2) layerCount += 1; // Splash effect
      if (lightning) layerCount += 4; // Lightning system
      layerCount += 1; // Dragon silhouette
      
      setPerformanceInfo(prev => ({ ...prev, layers: layerCount }));
    };

    calculateLayers();
  }, [rainIntensity, lightning]);

  // Container query detection for mobile layer reduction
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce layers on mobile for performance
  const effectiveRainIntensity = isMobile ? Math.min(rainIntensity, 1) : rainIntensity;
  const showDistantLightning = !isMobile;

  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden isolate pointer-events-none" 
      aria-hidden="true"
      style={debugMode ? { outline: '2px solid red', background: 'rgba(255,0,0,0.05)' } : {}}
    >
      {/* Debug Performance Overlay */}
      {debugMode && (
        <div className="absolute top-4 left-4 z-10 p-3 bg-black/90 text-white text-xs font-mono rounded">
          <div>🐉 Dragon Storm System v2.0</div>
          <div>Active Layers: {performanceInfo.layers}</div>
          <div>Rain Intensity: {effectiveRainIntensity}</div>
          <div>Lightning: {lightning ? 'ON' : 'OFF'}</div>
          <div>Eye Tracking: {eyeTracking ? 'ON' : 'OFF'}</div>
          <div>Scroll Parallax: {parallaxScroll ? 'ON' : 'OFF'}</div>
          <div>Mobile Mode: {isMobile ? 'ON' : 'OFF'}</div>
          <div>Hue: {hue}° | Opacity: {baseOpacity}</div>
        </div>
      )}

      {/* Enhanced Aurora Wash with Parallax */}
      <motion.div 
        className="absolute -inset-[3%] opacity-75 will-change-transform motion-reduce:animate-none aurora-backdrop"
        style={{
          // Hex fallback first
          background: `conic-gradient(from 180deg at 50% 50%, ${jade600Hex} 0deg, #F59E0B 60deg, #DC2626 120deg, ${jade700Hex} 180deg, #F59E0B 240deg, ${jade600Hex} 360deg)`,
          filter: 'blur(85px)',
          animation: 'stormAura 16s ease-in-out infinite',
          y: parallaxScroll ? auroraY : 0,
        }}
      />

      {/* Multi-Layer Rain System with Parallax */}
      {effectiveRainIntensity > 0 && (
        <motion.div 
          style={{ y: parallaxScroll ? rainParallax : 0 }}
          className="absolute inset-0"
        >
          {/* Heavy rain layer - closest, most visible */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none rain-heavy-layer"
            style={{
              opacity: effectiveRainIntensity === 2 ? 0.20 : 0.16,
              backgroundImage: `repeating-linear-gradient(15deg, transparent 0px, transparent 32px, color-mix(in oklab, ${ink} 40%, transparent) 33px, color-mix(in oklab, ${jade600} 18%, transparent) 35px, transparent 38px)`,
              animation: `rain-heavy ${effectiveRainIntensity === 2 ? 2.2 : 3.0}s linear infinite`,
              willChange: 'background-position',
              transform: 'translateZ(0)',
            }}
          />
          
          {/* Medium rain layer */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none rain-medium-layer"
            style={{
              opacity: effectiveRainIntensity === 2 ? 0.15 : 0.12,
              backgroundImage: `repeating-linear-gradient(13deg, transparent 0px, transparent 42px, color-mix(in oklab, ${ink} 28%, transparent) 43px, color-mix(in oklab, ${jade500} 12%, transparent) 45px, transparent 49px)`,
              animation: `rain-medium ${effectiveRainIntensity === 2 ? 3.6 : 4.4}s linear infinite`,
              willChange: 'background-position',
              transform: 'translateZ(0)',
            }}
          />
          
          {/* Light rain layer - furthest */}
          {!isMobile && (
            <div 
              className="absolute inset-0 motion-reduce:animate-none rain-light-layer"
              style={{
                opacity: effectiveRainIntensity === 2 ? 0.11 : 0.08,
                backgroundImage: `repeating-linear-gradient(11deg, transparent 0px, transparent 55px, color-mix(in oklab, ${ink} 22%, transparent) 56px, color-mix(in oklab, ${jade700} 10%, transparent) 58px, transparent 62px)`,
                animation: `rain-light ${effectiveRainIntensity === 2 ? 5.0 : 6.2}s linear infinite`,
                willChange: 'background-position',
                transform: 'translateZ(0)',
              }}
            />
          )}
          
          {/* Ground splash effects for heavy storms */}
          {effectiveRainIntensity === 2 && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-40 motion-reduce:animate-none"
              style={{
                opacity: 0.08,
                background: `radial-gradient(ellipse 180% 35% at center bottom, color-mix(in oklab, ${jade400} 25%, transparent) 0%, transparent 75%)`,
                animation: 'rainSplash 7s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
          )}
        </motion.div>
      )}

      {/* Enhanced Lightning System with Stroke Dash Animation */}
      {lightning && (
        <>
          {/* Global screen flash */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none lightning-flash-overlay"
            style={{ 
              background: `radial-gradient(75% 75% at 50% 25%, color-mix(in oklab, ${jade400} 65%, transparent) 0%, transparent 50%), radial-gradient(55% 55% at 25% 85%, color-mix(in oklab, white 85%, transparent) 0%, transparent 65%)`,
              mixBlendMode: 'screen',
              animation: 'lightning-flash 22s ease-in-out infinite',
              willChange: 'opacity'
            }} 
          />
          
          {/* Main lightning bolt with path drawing */}
          <svg 
            viewBox="0 0 800 800" 
            className="absolute left-[10%] top-[6%] w-[34vmin] h-[34vmin] opacity-0 motion-reduce:hidden"
            style={{ 
              animation: 'lightning-bolt-main 22s ease-in-out infinite',
              transform: 'translateZ(0)',
              willChange: 'opacity, transform'
            }}
          >
            <defs>
              <filter id={`${idPrefix}-lightningGlowMain`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="7" result="glow"/>
                <feColorMatrix in="glow" type="matrix" values="0 0 0 0 0.086  0 0 0 0 0.588  0 0 0 0 0.518  0 0 0 1 0"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M 320 60 L 280 180 L 360 180 L 300 300 L 380 300 L 320 460 L 480 280 L 400 280 L 440 160 L 360 160 L 400 60 Z"
              fill="none"
              stroke="oklch(99% 0 0)"
              strokeWidth="4"
              filter={`url(#${idPrefix}-lightningGlowMain)`}
              strokeDasharray="800"
              strokeDashoffset="800"
              style={{
                animation: 'lightning-draw 22s ease-in-out infinite'
              }}
            />
          </svg>
          
          {/* Secondary lightning bolt */}
          <svg 
            viewBox="0 0 600 600" 
            className="absolute right-[6%] top-[12%] w-[26vmin] h-[26vmin] opacity-0 motion-reduce:hidden"
            style={{ 
              animation: 'lightning-bolt-secondary 22s ease-in-out infinite',
              transform: 'translateZ(0)',
              animationDelay: '0.3s',
              willChange: 'opacity, transform'
            }}
          >
            <defs>
              <filter id={`${idPrefix}-lightningGlowSecondary`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="glow"/>
                <feColorMatrix in="glow" type="matrix" values="0 0 0 0 0.176  0 0 0 0 0.831  0 0 0 0 0.749  0 0 0 1 0"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M 280 80 L 240 160 L 300 160 L 260 240 L 340 240 L 300 350 L 420 220 L 360 220 L 400 140 L 340 140 L 380 80 Z"
              fill="none"
              stroke="oklch(98% 0.05 170)"
              strokeWidth="3"
              filter={`url(#${idPrefix}-lightningGlowSecondary)`}
              strokeDasharray="600"
              strokeDashoffset="600"
              style={{
                animation: 'lightning-draw-secondary 22s ease-in-out infinite',
                animationDelay: '0.3s'
              }}
            />
          </svg>
          
          {/* Distant atmospheric flash - desktop only */}
          {showDistantLightning && (
            <svg 
              viewBox="0 0 400 400" 
              className="absolute left-[28%] top-[3%] w-[20vmin] h-[20vmin] opacity-0 motion-reduce:hidden"
              style={{ 
                animation: 'lightning-bolt-distant 22s ease-in-out infinite',
                transform: 'translateZ(0)',
                animationDelay: '1.2s',
                willChange: 'opacity, transform'
              }}
            >
              <path 
                d="M 200 40 L 180 120 L 220 120 L 200 200 L 280 140 L 240 140 L 260 40 Z"
                fill="oklch(96% 0.08 170)"
                opacity="0.7"
                filter="blur(1.2px)"
              />
            </svg>
          )}
        </>
      )}

      {/* Dragon Silhouette with Eye Tracking */}
      <motion.svg 
        viewBox="0 0 1600 900" 
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        style={{ 
          transform: 'translateZ(0)',
          willChange: 'transform',
          scale: parallaxScroll ? dragonScale : 1,
        }}
      >
        <defs>
          {/* Enhanced rim lighting */}
          <linearGradient id={`${idPrefix}-dragonRim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={jade500} />
            <stop offset="50%" stopColor={gold} />
            <stop offset="100%" stopColor={danger} stopOpacity="0.8" />
          </linearGradient>

          {/* Pearlescent teeth */}
          <linearGradient id={`${idPrefix}-tooth`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(99% 0 0)" />
            <stop offset="30%" stopColor="oklch(94% 0.02 100)" />
            <stop offset="100%" stopColor="oklch(82% 0.04 120)" />
          </linearGradient>

          {/* Eye glow */}
          <radialGradient id={`${idPrefix}-eye`}>
            <stop offset="0%" stopColor={jade400} />
            <stop offset="70%" stopColor={jade600} />
            <stop offset="100%" stopColor={ink} />
          </radialGradient>

          {/* Storm breath filter */}
          <filter 
            id={`${idPrefix}-breath`}
            filterUnits="userSpaceOnUse"
            x="-25%" y="-25%" width="150%" height="150%"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.007" numOctaves="4" seed="42" result="noise">
              <animate attributeName="baseFrequency" dur="18s" values="0.009 0.007; 0.007 0.009; 0.009 0.007" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="28">
              <animate attributeName="scale" dur="14s" values="22;32;22" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Dragon mask */}
          <mask id={`${idPrefix}-mask`} maskUnits="userSpaceOnUse">
            <rect width="1600" height="900" fill="black" />
            <g transform="translate(120,20) scale(1.45)">
              <path fill="white" d="
                M 200 280
                C 320 150, 540 100, 760 150
                C 880 175, 1050 235, 1140 350
                C 1220 450, 1200 570, 1080 630
                C 960 705, 780 725, 640 700
                C 550 690, 480 650, 420 600
                C 380 530, 350 480, 310 430
                C 270 400, 235 360, 200 280 Z
              " />
            </g>
          </mask>
        </defs>

        {/* Storm breath emanating from dragon */}
        <g mask={`url(#${idPrefix}-mask)`} opacity="0.28">
          <rect width="1600" height="900" fill={ink} filter={`url(#${idPrefix}-breath)`}>
            <animate attributeName="x" dur="26s" values="0;-45;8;0" repeatCount="indefinite" />
            <animate attributeName="y" dur="32s" values="0;-35;18;0" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Dragon head silhouette */}
        <g transform="translate(120,20) scale(1.45)" opacity={baseOpacity}>
          {/* Main head outline */}
          <path
            d="
              M 200 280
              C 320 150, 540 100, 760 150
              C 880 175, 1050 235, 1140 350
              C 1220 450, 1200 570, 1080 630
              C 960 705, 780 725, 640 700
              C 550 690, 480 650, 420 600
              C 380 530, 350 480, 310 430
              C 270 400, 235 360, 200 280 Z
            "
            fill="none"
            stroke={`url(#${idPrefix}-dragonRim)`}
            strokeWidth="3"
            strokeOpacity="0.9"
            vectorEffect="non-scaling-stroke"
          />

          {/* Jaw line */}
          <path
            d="
              M 420 600
              C 530 625, 680 645, 790 635
              C 900 620, 980 580, 1040 535
              C 1020 590, 970 670, 870 710
              C 730 765, 520 730, 450 690
              C 430 670, 425 640, 420 600 Z
            "
            fill="none"
            stroke={`url(#${idPrefix}-dragonRim)`}
            strokeWidth="2"
            strokeOpacity="0.75"
            vectorEffect="non-scaling-stroke"
          />

          {/* Sharp teeth */}
          <g opacity="0.95">
            <path d="M540 650 l16 42 l18 -38 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M580 665 l14 40 l16 -36 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M620 675 l17 36 l19 -34 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M665 678 l15 32 l17 -30 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M710 675 l16 34 l18 -32 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M755 668 l14 36 l16 -34 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M800 655 l17 38 l19 -36 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M845 638 l15 34 l17 -32 Z" fill={`url(#${idPrefix}-tooth)`} />
            <path d="M890 615 l16 32 l18 -30 Z" fill={`url(#${idPrefix}-tooth)`} />
          </g>

          {/* Intelligent Eye with Motion Tracking */}
          <motion.g 
            style={{
              x: eyeTracking ? eyeX : 0,
              y: eyeTracking ? eyeY : 0,
            }}
            animate={eyeTracking ? {} : { x: [0, 2, -1, 0], y: [0, -1, 2, 0] }}
            transition={eyeTracking ? {} : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <g transform="translate(925,380)">
              {/* Eye socket shadow */}
              <circle r="24" fill={ink} opacity="0.65" />
              {/* Iris with intelligence pulsing */}
              <circle r="17" fill={`url(#${idPrefix}-eye)`}>
                <animate attributeName="r" values="17;19;17" dur="11s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.95;0.8" dur="11s" repeatCount="indefinite" />
              </circle>
              {/* Pupil */}
              <circle r="9" fill={ink}>
                <animate attributeName="r" values="9;7;9" dur="9s" repeatCount="indefinite" />
              </circle>
              {/* Intelligence glint */}
              <circle cx="-4" cy="-4" r="3.5" fill="white">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="7s" repeatCount="indefinite" />
              </circle>
              {/* Rare danger flash */}
              <circle r="22" fill={danger} opacity="0">
                <animate attributeName="opacity" values="0;0;0;0.18;0;0;0;0;0" dur="28s" repeatCount="indefinite" />
              </circle>
            </g>
          </motion.g>
        </g>
      </motion.svg>

      {/* OKLCH Progressive Enhancement */}
      <style jsx global>{`
        @supports (color: oklch(50% 0.1 180)) {
          .aurora-backdrop {
            background: conic-gradient(from 180deg at 50% 50%,
              oklch(58% 0.12 ${hue}) 0deg,
              oklch(70% 0.15 95) 60deg,
              oklch(55% 0.18 25) 120deg,
              oklch(50% 0.12 ${hue}) 180deg,
              oklch(70% 0.15 95) 240deg,
              oklch(58% 0.12 ${hue}) 360deg) !important;
          }
        }
      `}</style>
    </div>
  );
}