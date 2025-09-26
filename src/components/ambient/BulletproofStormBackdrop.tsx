// components/ambient/BulletproofStormBackdrop.tsx
// BULLETPROOF: Addresses all SVG rendering pitfalls, stacking context traps, and browser quirks
// Server component: zero client JS. All animations via CSS/SVG with proper fallbacks.
// Hardened against OKLCH support issues, filter clipping, mask inversions, and Tailwind purging

type Props = {
  idPrefix?: string;        // to dedupe filter/mask ids if used multiple times  
  hue?: number;             // 160–175 for jade/teal Frame Economics brand
  baseOpacity?: number;     // 0.10–0.18 dragon visibility for educational impact
  rainIntensity?: 0|1|2;    // 0 off, 1 normal, 2 heavy storm
  lightning?: boolean;      // true for lightning flashes
  debugMode?: boolean;      // shows stacking context outlines and motion state
};

export default function BulletproofStormBackdrop({
  idPrefix = "drg",
  hue = 170,
  baseOpacity = 0.15,      // Increased for better educational visibility
  rainIntensity = 1,
  lightning = true,
  debugMode = false,
}: Props) {
  // OKLCH with safe hex fallbacks (addresses older browser support)
  const jade600 = `oklch(58% 0.12 ${hue})`;
  const jade500 = `oklch(65% 0.11 ${hue})`;  
  const jade700 = `oklch(50% 0.12 ${hue})`;
  const jade400 = `oklch(72% 0.10 ${hue})`;
  const gold = `oklch(70% 0.15 95)`;
  const danger = `oklch(55% 0.18 25)`;
  const ink = `oklch(22% 0 0)`;

  // Hex fallbacks for older browsers
  const jade600Hex = "#0F766E"; // teal-700 equivalent
  const jade500Hex = "#14B8A6"; // teal-500 equivalent  
  const jade700Hex = "#0D9488"; // teal-600 equivalent

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden isolate" 
      aria-hidden="true"
      style={debugMode ? { outline: '2px solid red', background: 'rgba(255,0,0,0.1)' } : {}}
    >
      {/* Debug info overlay */}
      {debugMode && (
        <div className="absolute top-4 right-4 z-10 p-2 bg-black/80 text-white text-xs font-mono">
          <div>Dragon Opacity: {baseOpacity}</div>
          <div>Rain Intensity: {rainIntensity}</div>
          <div>Lightning: {lightning ? 'ON' : 'OFF'}</div>
          <div>Reduced Motion: {typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'ACTIVE' : 'INACTIVE'}</div>
        </div>
      )}

      {/* Enhanced aurora wash with OKLCH + hex fallbacks */}
      <div 
        className="absolute -inset-[2%] opacity-70 will-change-transform motion-reduce:animate-none aurora-backdrop"
        style={{
          // Hex fallback first
          background: `conic-gradient(from 180deg at 50% 50%, ${jade600Hex} 0deg, #F59E0B 60deg, #DC2626 120deg, ${jade700Hex} 180deg, #F59E0B 240deg, ${jade600Hex} 360deg)`,
          filter: 'blur(80px)',
          animation: 'stormAura 18s ease-in-out infinite',
        }}
      />

      {/* Enhanced Multi-Layer Rain System with Proven Patterns */}
      {rainIntensity > 0 && (
        <>
          {/* Heavy rain layer - closest, fastest */}
          <div 
            className={`absolute inset-0 motion-reduce:animate-none rain-heavy-layer ${rainIntensity === 2 ? 'rain-heavy-fast' : ''}`}
            style={{
              opacity: rainIntensity === 2 ? 0.18 : 0.15,
              backgroundImage: `repeating-linear-gradient(15deg, transparent 0px, transparent 35px, color-mix(in oklab, ${ink} 35%, transparent) 36px, color-mix(in oklab, ${jade600} 15%, transparent) 38px, transparent 40px)`,
              animation: `rain-heavy ${rainIntensity === 2 ? 2.4 : 3.2}s linear infinite`,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          {/* Medium rain layer - middle depth */}
          <div 
            className={`absolute inset-0 motion-reduce:animate-none rain-medium-layer ${rainIntensity === 2 ? 'rain-medium-fast' : ''}`}
            style={{
              opacity: rainIntensity === 2 ? 0.14 : 0.11,
              backgroundImage: `repeating-linear-gradient(13deg, transparent 0px, transparent 45px, color-mix(in oklab, ${ink} 25%, transparent) 46px, color-mix(in oklab, ${jade500} 10%, transparent) 48px, transparent 52px)`,
              animation: `rain-medium ${rainIntensity === 2 ? 3.8 : 4.8}s linear infinite`,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          {/* Light rain layer - furthest, atmospheric */}
          <div 
            className={`absolute inset-0 motion-reduce:animate-none rain-light-layer ${rainIntensity === 2 ? 'rain-light-fast' : ''}`}
            style={{
              opacity: rainIntensity === 2 ? 0.10 : 0.07,
              backgroundImage: `repeating-linear-gradient(11deg, transparent 0px, transparent 58px, color-mix(in oklab, ${ink} 20%, transparent) 59px, color-mix(in oklab, ${jade700} 8%, transparent) 61px, transparent 65px)`,
              animation: `rain-light ${rainIntensity === 2 ? 5.2 : 6.4}s linear infinite`,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          {/* Rain splatter effects on ground (subtle) */}
          {rainIntensity === 2 && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-32 motion-reduce:animate-none"
              style={{
                opacity: 0.06,
                background: `radial-gradient(ellipse 200% 30% at center bottom, color-mix(in oklab, ${jade400} 20%, transparent) 0%, transparent 70%)`,
                animation: 'rainSplash 8s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
          )}
        </>
      )}

      {/* MASSIVE DRAGON HEAD - Enhanced visibility and proper SVG setup */}
      <svg 
        viewBox="0 0 1600 900" 
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        style={{ 
          transform: 'translateZ(0)', // GPU layer
          willChange: 'transform'
        }}
      >
        <defs>
          {/* Enhanced rim lighting with fallbacks */}
          <linearGradient id={`${idPrefix}-dragonStormRim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={jade500} />
            <stop offset="50%" stopColor={gold} />
            <stop offset="100%" stopColor={danger} stopOpacity="0.8" />
          </linearGradient>

          {/* Pearlescent teeth gradient */}
          <linearGradient id={`${idPrefix}-stormTooth`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(99% 0 0)" />
            <stop offset="30%" stopColor="oklch(94% 0.02 100)" />
            <stop offset="100%" stopColor="oklch(82% 0.04 120)" />
          </linearGradient>

          {/* Eye glow with radial gradient */}
          <radialGradient id={`${idPrefix}-stormEye`}>
            <stop offset="0%" stopColor={jade400} />
            <stop offset="70%" stopColor={jade600} />
            <stop offset="100%" stopColor={ink} />
          </radialGradient>

          {/* Storm breath filter - EXPANDED REGION to prevent clipping */}
          <filter 
            id={`${idPrefix}-stormBreath`}
            filterUnits="userSpaceOnUse"
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.006" numOctaves="3" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="20s" values="0.008 0.006; 0.006 0.008; 0.008 0.006" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="25">
              <animate attributeName="scale" dur="15s" values="20;30;20" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Dragon head mask - WHITE shows content, BLACK hides (proper mask semantics) */}
          <mask id={`${idPrefix}-dragonMask`} maskUnits="userSpaceOnUse">
            <rect width="1600" height="900" fill="black" />
            <g transform="translate(120,20) scale(1.4)">
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

        {/* Storm breath emanating from dragon (masked properly) */}
        <g mask={`url(#${idPrefix}-dragonMask)`} opacity="0.25">
          <rect width="1600" height="900" fill={ink} filter={`url(#${idPrefix}-stormBreath)`}>
            <animate attributeName="x" dur="28s" values="0;-50;10;0" repeatCount="indefinite" />
            <animate attributeName="y" dur="35s" values="0;-40;20;0" repeatCount="indefinite" />
          </rect>
        </g>

        {/* MASSIVE DRAGON HEAD OUTLINE - 70% viewport commanding presence */}
        <g transform="translate(120,20) scale(1.4)" opacity={baseOpacity}>
          {/* Main head outline with vector-effect for consistent stroke */}
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
            stroke={`url(#${idPrefix}-dragonStormRim)`}
            strokeWidth="3"
            strokeOpacity="0.9"
            vectorEffect="non-scaling-stroke"
          />

          {/* Open jaw for menacing presence */}
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
            stroke={`url(#${idPrefix}-dragonStormRim)`}
            strokeWidth="2"
            strokeOpacity="0.75"
            vectorEffect="non-scaling-stroke"
          />

          {/* SHARP PROMINENT TEETH - Educational danger element */}
          <g opacity="0.95">
            <path d="M540 650 l16 42 l18 -38 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M580 665 l14 40 l16 -36 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M620 675 l17 36 l19 -34 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M665 678 l15 32 l17 -30 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M710 675 l16 34 l18 -32 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M755 668 l14 36 l16 -34 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M800 655 l17 38 l19 -36 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M845 638 l15 34 l17 -32 Z" fill={`url(#${idPrefix}-stormTooth)`} />
            <path d="M890 615 l16 32 l18 -30 Z" fill={`url(#${idPrefix}-stormTooth)`} />
          </g>

          {/* INTELLIGENT EYE - Watchful presence with enhanced animations */}
          <g transform="translate(925,380)">
            {/* Eye socket shadow */}
            <circle r="22" fill={ink} opacity="0.6" />
            {/* Iris with intelligence pulsing */}
            <circle r="16" fill={`url(#${idPrefix}-stormEye)`}>
              <animate attributeName="r" values="16;18;16" dur="12s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.95;0.8" dur="12s" repeatCount="indefinite" />
            </circle>
            {/* Pupil with focus dilation */}
            <circle r="8" fill={ink}>
              <animate attributeName="r" values="8;6;8" dur="10s" repeatCount="indefinite" />
            </circle>
            {/* Intelligence glint */}
            <circle cx="-4" cy="-4" r="3" fill="white">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="8s" repeatCount="indefinite" />
            </circle>
            {/* Rare danger flash */}
            <circle r="20" fill={danger} opacity="0">
              <animate attributeName="opacity" values="0;0;0;0.15;0;0;0;0;0" dur="30s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </svg>

      {/* ENHANCED LIGHTNING SYSTEM - CodePen-inspired with proper stroke dash timing */}
      {lightning && (
        <>
          {/* Global screen flash with improved blend */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none lightning-flash-overlay"
            style={{ 
              background: `radial-gradient(70% 70% at 50% 30%, color-mix(in oklab, ${jade400} 60%, transparent) 0%, transparent 45%), radial-gradient(50% 50% at 20% 80%, color-mix(in oklab, white 80%, transparent) 0%, transparent 60%)`,
              mixBlendMode: 'screen',
              animation: 'lightning-flash 22s ease-in-out infinite',
              willChange: 'opacity'
            }} 
          />
          
          {/* Lightning bolt 1 - Main strike with path drawing */}
          <svg 
            viewBox="0 0 800 800" 
            className="absolute left-[12%] top-[8%] w-[32vmin] h-[32vmin] opacity-0 motion-reduce:hidden"
            style={{ 
              animation: 'lightning-bolt-main 22s ease-in-out infinite',
              transform: 'translateZ(0)',
              willChange: 'opacity, transform'
            }}
          >
            <defs>
              <filter id={`${idPrefix}-lightningGlowMain`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="glow"/>
                <feColorMatrix in="glow" values={`0 0 0 0 ${jade500Hex.slice(1,3)} 0 0 0 0 ${jade500Hex.slice(3,5)} 0 0 0 0 ${jade500Hex.slice(5,7)} 0 0 0 1 0`}/>
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
              strokeWidth="3"
              filter={`url(#${idPrefix}-lightningGlowMain)`}
              strokeDasharray="800"
              strokeDashoffset="800"
              style={{
                animation: 'lightning-draw 22s ease-in-out infinite'
              }}
            />
          </svg>
          
          {/* Lightning bolt 2 - Secondary branch */}
          <svg 
            viewBox="0 0 600 600" 
            className="absolute right-[8%] top-[15%] w-[24vmin] h-[24vmin] opacity-0 motion-reduce:hidden"
            style={{ 
              animation: 'lightning-bolt-secondary 22s ease-in-out infinite',
              transform: 'translateZ(0)',
              animationDelay: '0.3s',
              willChange: 'opacity, transform'
            }}
          >
            <defs>
              <filter id={`${idPrefix}-lightningGlowSecondary`} filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="glow"/>
                <feColorMatrix in="glow" values={`0 0 0 0 ${jade400Hex.slice(1,3)} 0 0 0 0 ${jade400Hex.slice(3,5)} 0 0 0 0 ${jade400Hex.slice(5,7)} 0 0 0 1 0`}/>
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
              strokeWidth="2"
              filter={`url(#${idPrefix}-lightningGlowSecondary)`}
              strokeDasharray="600"
              strokeDashoffset="600"
              style={{
                animation: 'lightning-draw-secondary 22s ease-in-out infinite',
                animationDelay: '0.3s'
              }}
            />
          </svg>
          
          {/* Lightning bolt 3 - Distant atmospheric flash */}
          <svg 
            viewBox="0 0 400 400" 
            className="absolute left-[25%] top-[5%] w-[18vmin] h-[18vmin] opacity-0 motion-reduce:hidden"
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
              filter="blur(1px)"
            />
          </svg>
        </>
      )}

      {/* OKLCH Progressive Enhancement Styles */}
      <style jsx global>{`
        /* OKLCH progressive enhancement with safe fallbacks */
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