// components/ambient/FrosteDragonBackdrop.tsx
// Low-vis jade OKLCH outline (no client JS)

export default function FrosteDragonBackdrop({
  hue = 170, 
  opacity = 0.15,  // Increased for visibility
}: { 
  hue?: number; 
  opacity?: number; 
}) {
  const rimA = `oklch(65% 0.11 ${hue})`;
  const rimB = `oklch(50% 0.12 ${hue})`;
  const goldAccent = `oklch(70% 0.15 95)`;
  
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Subtle aurora wash */}
      <div className="absolute -inset-[2%] opacity-60 motion-reduce:animate-none"
           style={{
             filter: 'blur(70px)',
             background: `conic-gradient(from 180deg at 50% 50%, oklch(58% 0.12 ${hue}) 0deg, oklch(70% 0.15 95) 120deg, oklch(50% 0.12 ${hue}) 240deg, oklch(58% 0.12 ${hue}) 360deg)`,
             animation: 'aurora 14s ease-in-out infinite'
           }} />
           
      {/* Dragon silhouette */}
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="f-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rimA} />
            <stop offset="50%" stopColor={goldAccent} />
            <stop offset="100%" stopColor={rimB} />
          </linearGradient>
          
          {/* Eye glow */}
          <radialGradient id="f-eye">
            <stop offset="0%" stopColor={rimA} />
            <stop offset="100%" stopColor={rimB} />
          </radialGradient>
        </defs>
        
        <g transform="translate(180,60) scale(1.2)" opacity={opacity}>
          {/* Main dragon head outline */}
          <path
            d="M 250 320 C 360 210, 540 160, 720 200 C 820 220, 950 280, 1080 360 C 1160 440, 1140 560, 1020 630 C 900 705, 720 725, 580 700 C 490 690, 420 650, 370 600 C 330 530, 300 480, 270 430 C 240 400, 215 360, 250 320 Z"
            fill="none" 
            stroke="url(#f-rim)" 
            strokeWidth="3" 
            strokeOpacity="0.8" 
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Open jaw */}
          <path
            d="M 370 600 C 480 625, 630 645, 740 635 C 850 620, 930 580, 990 535 C 970 590, 920 670, 820 710 C 680 765, 470 730, 400 690 C 380 670, 375 640, 370 600 Z"
            fill="none" 
            stroke="url(#f-rim)" 
            strokeWidth="2" 
            strokeOpacity="0.6" 
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Sharp teeth */}
          <g opacity="0.8">
            <path d="M490 650 l16 42 l18 -38 Z" fill="oklch(99% 0 0)" opacity="0.7" />
            <path d="M530 665 l14 40 l16 -36 Z" fill="oklch(99% 0 0)" opacity="0.7" />
            <path d="M570 675 l17 36 l19 -34 Z" fill="oklch(99% 0 0)" opacity="0.7" />
            <path d="M615 678 l15 32 l17 -30 Z" fill="oklch(99% 0 0)" opacity="0.7" />
            <path d="M660 675 l16 34 l18 -32 Z" fill="oklch(99% 0 0)" opacity="0.7" />
            <path d="M705 668 l14 36 l16 -34 Z" fill="oklch(99% 0 0)" opacity="0.7" />
            <path d="M750 655 l17 38 l19 -36 Z" fill="oklch(99% 0 0)" opacity="0.7" />
          </g>
          
          {/* Dragon eye with subtle pulse */}
          <g transform="translate(875,380)">
            <circle r="18" fill="url(#f-eye)" opacity="0.9">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r="8" fill="oklch(22% 0 0)" opacity="0.8" />
            <circle cx="-3" cy="-3" r="3" fill="oklch(99% 0 0)" opacity="0.6" />
          </g>
        </g>
      </svg>
      
      <style jsx global>{`
        @keyframes aurora {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1.5%) scale(1.015); }
        }
        @media (prefers-reduced-motion: reduce) { 
          [style*="animate"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}