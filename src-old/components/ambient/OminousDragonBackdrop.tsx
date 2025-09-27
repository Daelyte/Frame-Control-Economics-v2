// components/ambient/OminousDragonBackdrop.tsx
// Advanced motion design system for behavioral psychology education
// Dragon as core metaphor: Intelligence + Danger + Allure
// React 18 + TypeScript + OKLCH + Framer Motion integration

"use client";
import { useEffect, useRef } from 'react';

export default function OminousDragonBackdrop({
  opacity = 0.15,        // More visible for education (was 0.12)
  smokeOpacity = 0.24,   // Denser mystical presence (was 0.18)
  hue = 170,             // jade/teal hue for Frame Economics brand
  enableGazeTracking = true,  // Eye follows cursor for intelligence
  enableBreathReaction = true, // Smoke reacts to scroll for allure
}: {
  opacity?: number;
  smokeOpacity?: number;
  hue?: number;
  enableGazeTracking?: boolean;
  enableBreathReaction?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const eyeRef = useRef<SVGGElement>(null);
  const smokeRef = useRef<SVGRectElement>(null);
  
  // OKLCH color system for perceptual uniformity
  const brand600 = `oklch(58% 0.12 ${hue})`; // Primary jade
  const brand500 = `oklch(65% 0.11 ${hue})`; // Lighter jade
  const brand700 = `oklch(50% 0.12 ${hue})`; // Darker jade
  const accent500 = `oklch(70% 0.15 95)`; // Gold accent
  const neutralInk = `oklch(22% 0 0)`; // Deep shadow
  const dangerRed = `oklch(55% 0.18 25)`; // Subtle threat
  
  // Intelligence: Eye gaze tracking
  useEffect(() => {
    if (!enableGazeTracking || !eyeRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const eye = eyeRef.current;
      if (!eye) return;
      
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(e.clientY - eyeCenterX, e.clientX - eyeCenterY);
      const distance = Math.min(2, Math.sqrt(
        Math.pow(e.clientX - eyeCenterX, 2) + Math.pow(e.clientY - eyeCenterY, 2)
      ) / 100);
      
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;
      
      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [enableGazeTracking]);
  
  // Allure: Breath reacts to scroll speed
  useEffect(() => {
    if (!enableBreathReaction || !smokeRef.current) return;
    
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollSpeed = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      
      if (smokeRef.current) {
        // Faster scroll = more turbulent smoke
        const intensity = Math.min(1, scrollSpeed / 50);
        smokeRef.current.style.filter = `blur(${2 + intensity * 4}px) opacity(${smokeOpacity * (0.8 + intensity * 0.4)})`;
      }
      
      // Reset after scroll stops
      setTimeout(() => {
        if (smokeRef.current && scrollSpeed < 1) {
          smokeRef.current.style.filter = `blur(2px) opacity(${smokeOpacity})`;
        }
      }, 150);
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [enableBreathReaction, smokeOpacity]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Aurora wash - more prominent for educational atmosphere */}
      <div
        className="absolute -inset-[2%] opacity-75 [filter:blur(80px)] motion-reduce:animate-none"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, ${brand600} 0deg, ${accent500} 60deg, ${dangerRed} 120deg, ${brand700} 180deg, ${accent500} 240deg, ${brand600} 360deg)`,
          animation: "dragonAura 18s ease-in-out infinite",
        }}
      />

      {/* Massive Dragon Head - spans 70% viewport width */}
      <svg 
        ref={svgRef}
        viewBox="0 0 1600 900" 
        className="absolute inset-0 w-full h-full" 
        role="img" 
        aria-label="Intelligent dragon presence"
      >
        <defs>
          {/* Enhanced smoke system for breath reactions */}
          <filter id="dragonBreath">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.008" numOctaves="4" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="22s" values="0.006 0.008; 0.008 0.006; 0.006 0.008" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" dur="16s" values="28;42;28" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Intelligence glow for rim lighting */}
          <filter id="intelligenceGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          {/* Danger pulse filter */}
          <filter id="dangerPulse">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feColorMatrix in="blur" values="1 0 0 0 0  0 0.7 0.7 0 0  0 0 1 0 0  0 0 0 1 0"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          {/* Expanded dragon head mask - 70% viewport width */}
          <mask id="dragonHeadMask">
            <rect width="1600" height="900" fill="black" />
            <g transform="translate(120,20) scale(1.4)">
              {/* Massive head silhouette */}
              <path fill="white" d="
                M 200 280
                C 320 150, 540 100, 760 150
                C 880 175, 1050 235, 1140 340
                C 1220 440, 1200 560, 1080 630
                C 960 705, 780 725, 640 700
                C 550 690, 480 650, 420 600
                C 380 530, 350 480, 310 430
                C 270 400, 235 360, 200 280 Z
              " />
              {/* Massive open jaw */}
              <path fill="white" d="
                M 420 600
                C 530 625, 680 645, 790 635
                C 900 620, 980 580, 1040 535
                C 1020 590, 970 670, 870 710
                C 730 765, 520 730, 450 690
                C 430 670, 425 640, 420 600 Z
              " />
            </g>
          </mask>

          {/* Sharp teeth gradient - pearlescent */}
          <linearGradient id="dragonTooth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(99% 0 0)" />
            <stop offset="30%" stopColor="oklch(95% 0.02 100)" />
            <stop offset="100%" stopColor="oklch(82% 0.04 120)" />
          </linearGradient>

          {/* Rim light with danger undertones */}
          <linearGradient id="dragonRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={brand500} />
            <stop offset="50%" stopColor={accent500} />
            <stop offset="100%" stopColor={dangerRed} stopOpacity="0.7" />
          </linearGradient>

          {/* Eye glow gradient */}
          <radialGradient id="eyeGlow">
            <stop offset="0%" stopColor={brand600} />
            <stop offset="70%" stopColor={brand700} />
            <stop offset="100%" stopColor={neutralInk} />
          </radialGradient>
        </defs>

        {/* Enhanced dragon breath - reactive to scroll */}
        <g mask="url(#dragonHeadMask)" opacity={smokeOpacity}>
          <rect 
            ref={smokeRef}
            width="1600" 
            height="900" 
            fill={neutralInk} 
            filter="url(#dragonBreath)"
            opacity={smokeOpacity}
          >
            <animate attributeName="x" dur="26s" values="0;-60;20;0" repeatCount="indefinite" />
            <animate attributeName="y" dur="32s" values="0;-45;15;0" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Massive dragon head outline - 70% viewport span */}
        <g transform="translate(120,20) scale(1.4)" opacity={opacity} filter="url(#intelligenceGlow)">
          <path
            d="
              M 200 280
              C 320 150, 540 100, 760 150
              C 880 175, 1050 235, 1140 340
              C 1220 440, 1200 560, 1080 630
              C 960 705, 780 725, 640 700
              C 550 690, 480 650, 420 600
              C 380 530, 350 480, 310 430
              C 270 400, 235 360, 200 280 Z
            "
            fill="none"
            stroke="url(#dragonRim)"
            strokeWidth="3"
            strokeOpacity="0.8"
          />

          {/* Open jaw outline */}
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
            stroke="url(#dragonRim)"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Sharp dragon teeth - more prominent and dangerous */}
          <g opacity="0.9">
            <path d="M540 650 l14 38 l16 -35 Z" fill="url(#dragonTooth)" />
            <path d="M580 665 l12 36 l14 -32 Z" fill="url(#dragonTooth)" />
            <path d="M620 675 l15 32 l17 -30 Z" fill="url(#dragonTooth)" />
            <path d="M665 678 l13 28 l15 -26 Z" fill="url(#dragonTooth)" />
            <path d="M710 675 l14 30 l16 -28 Z" fill="url(#dragonTooth)" />
            <path d="M755 668 l12 32 l14 -30 Z" fill="url(#dragonTooth)" />
            <path d="M800 655 l15 34 l17 -32 Z" fill="url(#dragonTooth)" />
            <path d="M845 638 l13 30 l15 -28 Z" fill="url(#dragonTooth)" />
            <path d="M890 615 l14 28 l16 -26 Z" fill="url(#dragonTooth)" />
          </g>

          {/* Intelligent tracking eye with enhanced presence */}
          <g ref={eyeRef} transform="translate(925,380)">
            {/* Eye socket shadow */}
            <circle r="18" fill={neutralInk} opacity="0.6" />
            {/* Eye iris with pulsing intelligence */}
            <circle r="12" fill="url(#eyeGlow)">
              <animate attributeName="r" values="12;14;12" dur="10s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.95;0.7" dur="10s" repeatCount="indefinite" />
            </circle>
            {/* Pupil - contracts during focus */}
            <circle r="6" fill={neutralInk}>
              <animate attributeName="r" values="6;4;6" dur="8s" repeatCount="indefinite" />
            </circle>
            {/* Intelligence glint */}
            <circle cx="-3" cy="-3" r="2" fill="white">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="6s" repeatCount="indefinite" />
            </circle>
            {/* Danger flash - rare but noticeable */}
            <circle r="15" fill={dangerRed} opacity="0">
              <animate attributeName="opacity" values="0;0;0;0.15;0;0;0;0;0" dur="30s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </svg>

      {/* Keyframes are defined in motion.css */}
    </div>
  );
}
