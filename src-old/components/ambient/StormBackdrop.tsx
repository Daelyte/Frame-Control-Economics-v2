// components/ambient/StormBackdrop.tsx
// Advanced storm system: ominous dragon + rain + lightning for Frame Economics
// Zero client JS - pure CSS/SVG animations optimized for behavioral psychology education

export default function StormBackdrop({
  hue = 170,         // jade/teal hue for Frame Economics brand
  baseOpacity = 0.18, // dragon visibility (increased from 0.12 for education)
  rainIntensity = 1,  // 0 = off, 1 = normal, 2 = heavy
  lightning = true,   // master toggle for lightning effects
}: {
  hue?: number;
  baseOpacity?: number;
  rainIntensity?: 0 | 1 | 2;
  lightning?: boolean;
}) {
  // Enhanced OKLCH color system
  const jade600 = `oklch(58% 0.12 ${hue})`;
  const jade500 = `oklch(65% 0.11 ${hue})`;
  const jade700 = `oklch(50% 0.12 ${hue})`;
  const jade400 = `oklch(72% 0.10 ${hue})`;
  const gold = `oklch(70% 0.15 95)`;
  const ink = `oklch(22% 0 0)`;
  const danger = `oklch(55% 0.18 25)`;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Enhanced aurora wash with storm atmosphere */}
      <div
        className="absolute -inset-[2%] opacity-70 [filter:blur(80px)] motion-reduce:animate-none"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%,
            ${jade600} 0deg, ${gold} 60deg, ${danger} 120deg,
            ${jade700} 180deg, ${gold} 240deg, ${jade600} 360deg)`,
          animation: "stormAura 18s ease-in-out infinite",
        }}
      />

      {/* RAIN SYSTEM: Three parallax sheets for depth */}
      {rainIntensity > 0 && (
        <>
          {/* Heavy rain layer */}
          <div
            className="absolute inset-0 opacity-15 motion-reduce:animate-none"
            style={{
              backgroundImage:
                `repeating-linear-gradient(12deg, transparent 0 38px, ` +
                `color-mix(in oklab, ${ink} 30%, transparent) 38px 40px)`,
              animation: `rain-heavy ${rainIntensity === 2 ? 2.8 : 3.6}s linear infinite`,
            }}
          />
          {/* Medium rain layer */}
          <div
            className="absolute inset-0 opacity-12 motion-reduce:animate-none"
            style={{
              backgroundImage:
                `repeating-linear-gradient(12deg, transparent 0 46px, ` +
                `color-mix(in oklab, ${ink} 25%, transparent) 46px 48px)`,
              transform: "translateZ(0)",
              animation: `rain-medium ${rainIntensity === 2 ? 3.6 : 4.6}s linear infinite`,
            }}
          />
          {/* Light rain layer */}
          <div
            className="absolute inset-0 opacity-8 motion-reduce:animate-none"
            style={{
              backgroundImage:
                `repeating-linear-gradient(12deg, transparent 0 52px, ` +
                `color-mix(in oklab, ${ink} 20%, transparent) 52px 54px)`,
              animation: `rain-light ${rainIntensity === 2 ? 4.2 : 5.2}s linear infinite`,
            }}
          />
        </>
      )}

      {/* MASSIVE DRAGON HEAD - Educational presence with enhanced visibility */}
      <svg viewBox="0 0 1600 900" className="absolute inset-0 w-full h-full">
        <defs>
          {/* Enhanced rim lighting with storm atmosphere */}
          <linearGradient id="dragonStormRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={jade500} />
            <stop offset="50%" stopColor={gold} />
            <stop offset="100%" stopColor={danger} stopOpacity="0.7" />
          </linearGradient>

          {/* Glowing teeth gradient */}
          <linearGradient id="stormTooth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(98% 0 0)" />
            <stop offset="30%" stopColor="oklch(92% 0.02 100)" />
            <stop offset="100%" stopColor="oklch(80% 0.04 120)" />
          </linearGradient>

          {/* Eye glow for intelligence */}
          <radialGradient id="stormEye">
            <stop offset="0%" stopColor={jade400} />
            <stop offset="70%" stopColor={jade600} />
            <stop offset="100%" stopColor={ink} />
          </radialGradient>

          {/* Storm breath filter */}
          <filter id="stormBreath">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.006" numOctaves="3" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="20s" values="0.008 0.006; 0.006 0.008; 0.008 0.006" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="25">
              <animate attributeName="scale" dur="15s" values="20;30;20" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Dragon head mask for breath */}
          <mask id="stormDragonMask">
            <rect width="1600" height="900" fill="black" />
            <g transform="translate(140,40) scale(1.3)">
              <path fill="white" d="
                M 220 300
                C 340 170, 560 120, 780 160
                C 900 185, 1070 245, 1160 350
                C 1240 450, 1220 570, 1100 640
                C 980 715, 800 735, 660 710
                C 570 700, 500 660, 440 610
                C 400 540, 370 490, 330 440
                C 290 410, 255 370, 220 300 Z
              " />
            </g>
          </mask>
        </defs>

        {/* Storm breath/smoke emanating from dragon */}
        <g mask="url(#stormDragonMask)" opacity="0.25">
          <rect width="1600" height="900" fill={ink} filter="url(#stormBreath)">
            <animate attributeName="x" dur="28s" values="0;-50;10;0" repeatCount="indefinite" />
            <animate attributeName="y" dur="35s" values="0;-40;20;0" repeatCount="indefinite" />
          </rect>
        </g>

        {/* MASSIVE DRAGON HEAD OUTLINE - 70% viewport commanding presence */}
        <g transform="translate(140,40) scale(1.3)" opacity={baseOpacity}>
          {/* Main head outline */}
          <path
            d="
              M 220 300
              C 340 170, 560 120, 780 160
              C 900 185, 1070 245, 1160 350
              C 1240 450, 1220 570, 1100 640
              C 980 715, 800 735, 660 710
              C 570 700, 500 660, 440 610
              C 400 540, 370 490, 330 440
              C 290 410, 255 370, 220 300 Z
            "
            fill="none"
            stroke="url(#dragonStormRim)"
            strokeWidth="3"
            strokeOpacity="0.85"
          />

          {/* Open jaw for menacing presence */}
          <path
            d="
              M 440 610
              C 550 635, 700 655, 810 645
              C 920 630, 1000 590, 1060 545
              C 1040 600, 990 680, 890 720
              C 750 775, 540 740, 470 700
              C 450 680, 445 650, 440 610 Z
            "
            fill="none"
            stroke="url(#dragonStormRim)"
            strokeWidth="2"
            strokeOpacity="0.7"
          />

          {/* SHARP PROMINENT TEETH - danger element */}
          <g opacity="0.9">
            <path d="M560 670 l16 42 l18 -38 Z" fill="url(#stormTooth)" />
            <path d="M600 685 l14 40 l16 -36 Z" fill="url(#stormTooth)" />
            <path d="M640 695 l17 36 l19 -34 Z" fill="url(#stormTooth)" />
            <path d="M685 698 l15 32 l17 -30 Z" fill="url(#stormTooth)" />
            <path d="M730 695 l16 34 l18 -32 Z" fill="url(#stormTooth)" />
            <path d="M775 688 l14 36 l16 -34 Z" fill="url(#stormTooth)" />
            <path d="M820 675 l17 38 l19 -36 Z" fill="url(#stormTooth)" />
            <path d="M865 658 l15 34 l17 -32 Z" fill="url(#stormTooth)" />
            <path d="M910 635 l16 32 l18 -30 Z" fill="url(#stormTooth)" />
          </g>

          {/* INTELLIGENT EYE - watchful presence */}
          <g transform="translate(945,390)">
            {/* Eye socket */}
            <circle r="20" fill={ink} opacity="0.7" />
            {/* Iris with intelligence */}
            <circle r="14" fill="url(#stormEye)">
              <animate attributeName="r" values="14;16;14" dur="12s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.95;0.8" dur="12s" repeatCount="indefinite" />
            </circle>
            {/* Pupil */}
            <circle r="7" fill={ink}>
              <animate attributeName="r" values="7;5;7" dur="10s" repeatCount="indefinite" />
            </circle>
            {/* Intelligence glint */}
            <circle cx="-3" cy="-3" r="2.5" fill="white">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="8s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </svg>

      {/* LIGHTNING SYSTEM: Screen flashes + bolt silhouettes */}
      {lightning && (
        <>
          {/* Global screen flash for atmospheric tension */}
          <div 
            className="absolute inset-0 mix-blend-screen motion-reduce:animate-none"
            style={{ 
              background: "radial-gradient(60% 60% at 50% 40%, oklch(98% 0 0 / 0.0), oklch(98% 0 0 / 0))",
              animation: "lightning-flash 25s ease-in-out infinite" 
            }} 
          />
          
          {/* Lightning bolt left */}
          <svg 
            viewBox="0 0 800 800" 
            className="absolute left-[8%] top-[8%] w-[28vmin] h-[28vmin] opacity-0 motion-reduce:hidden"
            style={{ animation: "lightning-bolt-left 25s ease-in-out infinite" }}
          >
            <defs>
              <filter id="lightningGlowLeft">
                <feGaussianBlur stdDeviation="3" result="glow"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M 320 40 L 260 220 L 340 220 L 280 420 L 440 200 L 360 200 L 420 40 Z"
              fill="oklch(98% 0 0)" 
              filter="url(#lightningGlowLeft)"
            />
          </svg>
          
          {/* Lightning bolt right */}
          <svg 
            viewBox="0 0 800 800" 
            className="absolute right-[10%] top-[18%] w-[22vmin] h-[22vmin] opacity-0 motion-reduce:hidden"
            style={{ animation: "lightning-bolt-right 25s ease-in-out infinite" }}
          >
            <defs>
              <filter id="lightningGlowRight">
                <feGaussianBlur stdDeviation="2.5" result="glow"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M 420 60 L 360 210 L 430 210 L 370 370 L 520 180 L 450 180 L 500 60 Z"
              fill="oklch(98% 0 0)" 
              filter="url(#lightningGlowRight)"
            />
          </svg>
        </>
      )}

      {/* Storm keyframes are defined in motion.css */}
    </div>
  );
}