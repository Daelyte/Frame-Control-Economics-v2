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
  const eyeX = useTransform(mouseX, [0, window?.innerWidth || 1920], [-6, 6]);
  const eyeY = useTransform(mouseY, [0, window?.innerHeight || 1080], [-4, 4]);

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
        style={{\n          // Hex fallback first\n          background: `conic-gradient(from 180deg at 50% 50%, ${jade600Hex} 0deg, #F59E0B 60deg, #DC2626 120deg, ${jade700Hex} 180deg, #F59E0B 240deg, ${jade600Hex} 360deg)`,\n          filter: 'blur(85px)',\n          animation: 'stormAura 16s ease-in-out infinite',\n          y: parallaxScroll ? auroraY : 0,\n        }}\n      />\n\n      {/* Multi-Layer Rain System with Parallax */}\n      {effectiveRainIntensity > 0 && (\n        <motion.div \n          style={{ y: parallaxScroll ? rainParallax : 0 }}\n          className=\"absolute inset-0\"\n        >\n          {/* Heavy rain layer - closest, most visible */}\n          <div \n            className={`absolute inset-0 motion-reduce:animate-none rain-heavy-layer`}\n            style={{\n              opacity: effectiveRainIntensity === 2 ? 0.20 : 0.16,\n              backgroundImage: `repeating-linear-gradient(15deg, transparent 0px, transparent 32px, color-mix(in oklab, ${ink} 40%, transparent) 33px, color-mix(in oklab, ${jade600} 18%, transparent) 35px, transparent 38px)`,\n              animation: `rain-heavy ${effectiveRainIntensity === 2 ? 2.2 : 3.0}s linear infinite`,\n              willChange: 'background-position',\n              transform: 'translateZ(0)',\n            }}\n          />\n          \n          {/* Medium rain layer */}\n          <div \n            className={`absolute inset-0 motion-reduce:animate-none rain-medium-layer`}\n            style={{\n              opacity: effectiveRainIntensity === 2 ? 0.15 : 0.12,\n              backgroundImage: `repeating-linear-gradient(13deg, transparent 0px, transparent 42px, color-mix(in oklab, ${ink} 28%, transparent) 43px, color-mix(in oklab, ${jade500} 12%, transparent) 45px, transparent 49px)`,\n              animation: `rain-medium ${effectiveRainIntensity === 2 ? 3.6 : 4.4}s linear infinite`,\n              willChange: 'background-position',\n              transform: 'translateZ(0)',\n            }}\n          />\n          \n          {/* Light rain layer - furthest */}\n          {!isMobile && (\n            <div \n              className={`absolute inset-0 motion-reduce:animate-none rain-light-layer`}\n              style={{\n                opacity: effectiveRainIntensity === 2 ? 0.11 : 0.08,\n                backgroundImage: `repeating-linear-gradient(11deg, transparent 0px, transparent 55px, color-mix(in oklab, ${ink} 22%, transparent) 56px, color-mix(in oklab, ${jade700} 10%, transparent) 58px, transparent 62px)`,\n                animation: `rain-light ${effectiveRainIntensity === 2 ? 5.0 : 6.2}s linear infinite`,\n                willChange: 'background-position',\n                transform: 'translateZ(0)',\n              }}\n            />\n          )}\n          \n          {/* Ground splash effects for heavy storms */}\n          {effectiveRainIntensity === 2 && (\n            <div \n              className=\"absolute bottom-0 left-0 right-0 h-40 motion-reduce:animate-none\"\n              style={{\n                opacity: 0.08,\n                background: `radial-gradient(ellipse 180% 35% at center bottom, color-mix(in oklab, ${jade400} 25%, transparent) 0%, transparent 75%)`,\n                animation: 'rainSplash 7s ease-in-out infinite',\n                willChange: 'transform',\n              }}\n            />\n          )}\n        </motion.div>\n      )}\n\n      {/* Enhanced Lightning System with Stroke Dash Animation */}\n      {lightning && (\n        <>\n          {/* Global screen flash */}\n          <div \n            className=\"absolute inset-0 motion-reduce:animate-none lightning-flash-overlay\"\n            style={{ \n              background: `radial-gradient(75% 75% at 50% 25%, color-mix(in oklab, ${jade400} 65%, transparent) 0%, transparent 50%), radial-gradient(55% 55% at 25% 85%, color-mix(in oklab, white 85%, transparent) 0%, transparent 65%)`,\n              mixBlendMode: 'screen',\n              animation: 'lightning-flash 22s ease-in-out infinite',\n              willChange: 'opacity'\n            }} \n          />\n          \n          {/* Main lightning bolt with path drawing */}\n          <svg \n            viewBox=\"0 0 800 800\" \n            className=\"absolute left-[10%] top-[6%] w-[34vmin] h-[34vmin] opacity-0 motion-reduce:hidden\"\n            style={{ \n              animation: 'lightning-bolt-main 22s ease-in-out infinite',\n              transform: 'translateZ(0)',\n              willChange: 'opacity, transform'\n            }}\n          >\n            <defs>\n              <filter id={`${idPrefix}-lightningGlowMain`} filterUnits=\"userSpaceOnUse\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\">\n                <feGaussianBlur stdDeviation=\"7\" result=\"glow\"/>\n                <feColorMatrix in=\"glow\" type=\"matrix\" values=\"0 0 0 0 0.086  0 0 0 0 0.588  0 0 0 0 0.518  0 0 0 1 0\"/>\n                <feMerge>\n                  <feMergeNode in=\"glow\"/>\n                  <feMergeNode in=\"SourceGraphic\"/>\n                </feMerge>\n              </filter>\n            </defs>\n            <path \n              d=\"M 320 60 L 280 180 L 360 180 L 300 300 L 380 300 L 320 460 L 480 280 L 400 280 L 440 160 L 360 160 L 400 60 Z\"\n              fill=\"none\"\n              stroke=\"oklch(99% 0 0)\"\n              strokeWidth=\"4\"\n              filter={`url(#${idPrefix}-lightningGlowMain)`}\n              strokeDasharray=\"800\"\n              strokeDashoffset=\"800\"\n              style={{\n                animation: 'lightning-draw 22s ease-in-out infinite'\n              }}\n            />\n          </svg>\n          \n          {/* Secondary lightning bolt */}\n          <svg \n            viewBox=\"0 0 600 600\" \n            className=\"absolute right-[6%] top-[12%] w-[26vmin] h-[26vmin] opacity-0 motion-reduce:hidden\"\n            style={{ \n              animation: 'lightning-bolt-secondary 22s ease-in-out infinite',\n              transform: 'translateZ(0)',\n              animationDelay: '0.3s',\n              willChange: 'opacity, transform'\n            }}\n          >\n            <defs>\n              <filter id={`${idPrefix}-lightningGlowSecondary`} filterUnits=\"userSpaceOnUse\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\">\n                <feGaussianBlur stdDeviation=\"5\" result=\"glow\"/>\n                <feColorMatrix in=\"glow\" type=\"matrix\" values=\"0 0 0 0 0.176  0 0 0 0 0.831  0 0 0 0 0.749  0 0 0 1 0\"/>\n                <feMerge>\n                  <feMergeNode in=\"glow\"/>\n                  <feMergeNode in=\"SourceGraphic\"/>\n                </feMerge>\n              </filter>\n            </defs>\n            <path \n              d=\"M 280 80 L 240 160 L 300 160 L 260 240 L 340 240 L 300 350 L 420 220 L 360 220 L 400 140 L 340 140 L 380 80 Z\"\n              fill=\"none\"\n              stroke=\"oklch(98% 0.05 170)\"\n              strokeWidth=\"3\"\n              filter={`url(#${idPrefix}-lightningGlowSecondary)`}\n              strokeDasharray=\"600\"\n              strokeDashoffset=\"600\"\n              style={{\n                animation: 'lightning-draw-secondary 22s ease-in-out infinite',\n                animationDelay: '0.3s'\n              }}\n            />\n          </svg>\n          \n          {/* Distant atmospheric flash - desktop only */}\n          {showDistantLightning && (\n            <svg \n              viewBox=\"0 0 400 400\" \n              className=\"absolute left-[28%] top-[3%] w-[20vmin] h-[20vmin] opacity-0 motion-reduce:hidden\"\n              style={{ \n                animation: 'lightning-bolt-distant 22s ease-in-out infinite',\n                transform: 'translateZ(0)',\n                animationDelay: '1.2s',\n                willChange: 'opacity, transform'\n              }}\n            >\n              <path \n                d=\"M 200 40 L 180 120 L 220 120 L 200 200 L 280 140 L 240 140 L 260 40 Z\"\n                fill=\"oklch(96% 0.08 170)\"\n                opacity=\"0.7\"\n                filter=\"blur(1.2px)\"\n              />\n            </svg>\n          )}\n        </>\n      )}\n\n      {/* Dragon Silhouette with Eye Tracking */}\n      <motion.svg \n        viewBox=\"0 0 1600 900\" \n        preserveAspectRatio=\"xMidYMid slice\"\n        className=\"absolute inset-0 w-full h-full\"\n        style={{ \n          transform: 'translateZ(0)',\n          willChange: 'transform',\n          scale: parallaxScroll ? dragonScale : 1,\n        }}\n      >\n        <defs>\n          {/* Enhanced rim lighting */}\n          <linearGradient id={`${idPrefix}-dragonRim`} x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n            <stop offset=\"0%\" stopColor={jade500} />\n            <stop offset=\"50%\" stopColor={gold} />\n            <stop offset=\"100%\" stopColor={danger} stopOpacity=\"0.8\" />\n          </linearGradient>\n\n          {/* Pearlescent teeth */}\n          <linearGradient id={`${idPrefix}-tooth`} x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n            <stop offset=\"0%\" stopColor=\"oklch(99% 0 0)\" />\n            <stop offset=\"30%\" stopColor=\"oklch(94% 0.02 100)\" />\n            <stop offset=\"100%\" stopColor=\"oklch(82% 0.04 120)\" />\n          </linearGradient>\n\n          {/* Eye glow */}\n          <radialGradient id={`${idPrefix}-eye`}>\n            <stop offset=\"0%\" stopColor={jade400} />\n            <stop offset=\"70%\" stopColor={jade600} />\n            <stop offset=\"100%\" stopColor={ink} />\n          </radialGradient>\n\n          {/* Storm breath filter */}\n          <filter \n            id={`${idPrefix}-breath`}\n            filterUnits=\"userSpaceOnUse\"\n            x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\"\n          >\n            <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.009 0.007\" numOctaves=\"4\" seed=\"42\" result=\"noise\">\n              <animate attributeName=\"baseFrequency\" dur=\"18s\" values=\"0.009 0.007; 0.007 0.009; 0.009 0.007\" repeatCount=\"indefinite\" />\n            </feTurbulence>\n            <feDisplacementMap in=\"SourceGraphic\" in2=\"noise\" scale=\"28\">\n              <animate attributeName=\"scale\" dur=\"14s\" values=\"22;32;22\" repeatCount=\"indefinite\" />\n            </feDisplacementMap>\n            <feGaussianBlur stdDeviation=\"3\" />\n          </filter>\n\n          {/* Dragon mask */}\n          <mask id={`${idPrefix}-mask`} maskUnits=\"userSpaceOnUse\">\n            <rect width=\"1600\" height=\"900\" fill=\"black\" />\n            <g transform=\"translate(120,20) scale(1.45)\">\n              <path fill=\"white\" d=\"\n                M 200 280\n                C 320 150, 540 100, 760 150\n                C 880 175, 1050 235, 1140 350\n                C 1220 450, 1200 570, 1080 630\n                C 960 705, 780 725, 640 700\n                C 550 690, 480 650, 420 600\n                C 380 530, 350 480, 310 430\n                C 270 400, 235 360, 200 280 Z\n              \" />\n            </g>\n          </mask>\n        </defs>\n\n        {/* Storm breath emanating from dragon */}\n        <g mask={`url(#${idPrefix}-mask)`} opacity=\"0.28\">\n          <rect width=\"1600\" height=\"900\" fill={ink} filter={`url(#${idPrefix}-breath)`}>\n            <animate attributeName=\"x\" dur=\"26s\" values=\"0;-45;8;0\" repeatCount=\"indefinite\" />\n            <animate attributeName=\"y\" dur=\"32s\" values=\"0;-35;18;0\" repeatCount=\"indefinite\" />\n          </rect>\n        </g>\n\n        {/* Dragon head silhouette */}\n        <g transform=\"translate(120,20) scale(1.45)\" opacity={baseOpacity}>\n          {/* Main head outline */}\n          <path\n            d=\"\n              M 200 280\n              C 320 150, 540 100, 760 150\n              C 880 175, 1050 235, 1140 350\n              C 1220 450, 1200 570, 1080 630\n              C 960 705, 780 725, 640 700\n              C 550 690, 480 650, 420 600\n              C 380 530, 350 480, 310 430\n              C 270 400, 235 360, 200 280 Z\n            \"\n            fill=\"none\"\n            stroke={`url(#${idPrefix}-dragonRim)`}\n            strokeWidth=\"3\"\n            strokeOpacity=\"0.9\"\n            vectorEffect=\"non-scaling-stroke\"\n          />\n\n          {/* Jaw line */}\n          <path\n            d=\"\n              M 420 600\n              C 530 625, 680 645, 790 635\n              C 900 620, 980 580, 1040 535\n              C 1020 590, 970 670, 870 710\n              C 730 765, 520 730, 450 690\n              C 430 670, 425 640, 420 600 Z\n            \"\n            fill=\"none\"\n            stroke={`url(#${idPrefix}-dragonRim)`}\n            strokeWidth=\"2\"\n            strokeOpacity=\"0.75\"\n            vectorEffect=\"non-scaling-stroke\"\n          />\n\n          {/* Sharp teeth */}\n          <g opacity=\"0.95\">\n            <path d=\"M540 650 l16 42 l18 -38 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M580 665 l14 40 l16 -36 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M620 675 l17 36 l19 -34 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M665 678 l15 32 l17 -30 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M710 675 l16 34 l18 -32 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M755 668 l14 36 l16 -34 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M800 655 l17 38 l19 -36 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M845 638 l15 34 l17 -32 Z\" fill={`url(#${idPrefix}-tooth)`} />\n            <path d=\"M890 615 l16 32 l18 -30 Z\" fill={`url(#${idPrefix}-tooth)`} />\n          </g>\n\n          {/* Intelligent Eye with Motion Tracking */}\n          <motion.g \n            style={{\n              x: eyeTracking ? eyeX : 0,\n              y: eyeTracking ? eyeY : 0,\n            }}\n            animate={eyeTracking ? {} : { x: [0, 2, -1, 0], y: [0, -1, 2, 0] }}\n            transition={eyeTracking ? {} : { duration: 12, repeat: Infinity, ease: \"easeInOut\" }}\n          >\n            <g transform=\"translate(925,380)\">\n              {/* Eye socket shadow */}\n              <circle r=\"24\" fill={ink} opacity=\"0.65\" />\n              {/* Iris with intelligence pulsing */}\n              <circle r=\"17\" fill={`url(#${idPrefix}-eye)`}>\n                <animate attributeName=\"r\" values=\"17;19;17\" dur=\"11s\" repeatCount=\"indefinite\" />\n                <animate attributeName=\"opacity\" values=\"0.8;0.95;0.8\" dur=\"11s\" repeatCount=\"indefinite\" />\n              </circle>\n              {/* Pupil */}\n              <circle r=\"9\" fill={ink}>\n                <animate attributeName=\"r\" values=\"9;7;9\" dur=\"9s\" repeatCount=\"indefinite\" />\n              </circle>\n              {/* Intelligence glint */}\n              <circle cx=\"-4\" cy=\"-4\" r=\"3.5\" fill=\"white\">\n                <animate attributeName=\"opacity\" values=\"0.4;0.9;0.4\" dur=\"7s\" repeatCount=\"indefinite\" />\n              </circle>\n              {/* Rare danger flash */}\n              <circle r=\"22\" fill={danger} opacity=\"0\">\n                <animate attributeName=\"opacity\" values=\"0;0;0;0.18;0;0;0;0;0\" dur=\"28s\" repeatCount=\"indefinite\" />\n              </circle>\n            </g>\n          </motion.g>\n        </g>\n      </motion.svg>\n\n      {/* OKLCH Progressive Enhancement */}\n      <style jsx global>{`\n        @supports (color: oklch(50% 0.1 180)) {\n          .aurora-backdrop {\n            background: conic-gradient(from 180deg at 50% 50%,\n              oklch(58% 0.12 ${hue}) 0deg,\n              oklch(70% 0.15 95) 60deg,\n              oklch(55% 0.18 25) 120deg,\n              oklch(50% 0.12 ${hue}) 180deg,\n              oklch(70% 0.15 95) 240deg,\n              oklch(58% 0.12 ${hue}) 360deg) !important;\n          }\n        }\n      `}</style>\n    </div>\n  );\n}