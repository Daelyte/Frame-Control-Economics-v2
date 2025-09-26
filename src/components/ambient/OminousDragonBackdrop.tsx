// components/ambient/OminousDragonBackdrop.tsx
// Server component: zero client JS. SVG/CSS handle animation.
// Drop at the top level of your page (fixed, -z-10). Low-visibility by default.

export default function OminousDragonBackdrop({
  opacity = 0.12,        // overall visibility (0.08–0.18 recommended)
  smokeOpacity = 0.18,   // density of the smoke (0.12–0.28)
  hue = 170,             // jade/teal hue; try 160–175
}: {
  opacity?: number;
  smokeOpacity?: number;
  hue?: number;
}) {
  // OKLCH helpers (kept inline so you don't need extra tooling)
  const brand600 = `oklch(58% 0.12 ${hue})`;
  const brand500 = `oklch(65% 0.11 ${hue})`;
  const brand700 = `oklch(50% 0.12 ${hue})`;
  const neutralInk = `oklch(22% 0 0)`;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Aurora wash (very subtle) */}
      <div
        className="absolute -inset-[2%] opacity-60 [filter:blur(70px)] motion-reduce:animate-none"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, ${brand600} 0deg, oklch(70% 0.15 95) 120deg, ${brand700} 240deg, ${brand600} 360deg)`,
          animation: "orbital 14s ease-in-out infinite",
        }}
      />

      {/* Main SVG layer: dragon head silhouette + teeth + eye + smoke */}
      <svg viewBox="0 0 1600 900" className="absolute inset-0 w-full h-full" role="img" aria-label="Ominous dragon backdrop">
        <defs>
          {/* Soft noise for smoke */}
          <filter id="smoke">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.006" numOctaves="3" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="18s" values="0.004 0.006; 0.006 0.004; 0.004 0.006" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="28" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" dur="14s" values="22;30;22" repeatCount="indefinite" />
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* Gentle shimmer along edges */}
          <filter id="rim">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="lighter" />
          </filter>

          {/* Mask so smoke mainly hugs the head outline */}
          <mask id="headMask">
            <rect width="1600" height="900" fill="black" />
            <g transform="translate(200,80) scale(1.05)">
              {/* Head silhouette (white = visible area in mask) */}
              <path fill="white" d="
                M 250 320
                C 360 210, 540 160, 720 200
                C 820 220, 950 270, 1020 360
                C 1080 440, 1060 530, 960 590
                C 860 645, 720 660, 610 640
                C 540 630, 480 600, 430 560
                C 400 500, 380 460, 350 420
                C 315 395, 285 370, 250 320 Z
              " />
              {/* Open jaw region */}
              <path fill="white" d="
                M 430 560
                C 520 580, 650 595, 740 585
                C 835 572, 900 540, 955 505
                C 940 550, 900 610, 820 640
                C 700 682, 520 655, 460 620
                C 445 605, 438 590, 430 560 Z
              " />
            </g>
          </mask>

          {/* Teeth gradient */}
          <linearGradient id="tooth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(98% 0 0)" />
            <stop offset="100%" stopColor="oklch(80% 0.03 120)" />
          </linearGradient>

          {/* Head stroke gradient (rim light) */}
          <linearGradient id="rimLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={brand500} />
            <stop offset="100%" stopColor={brand700} />
          </linearGradient>
        </defs>

        {/* Smoke layer (masked to head) */}
        <g mask="url(#headMask)" opacity={smokeOpacity}>
          <rect width="1600" height="900" fill={neutralInk} filter="url(#smoke)">
            <animate attributeName="x" dur="22s" values="0;-40;0" repeatCount="indefinite" />
            <animate attributeName="y" dur="26s" values="0;-30;0" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Head outline (thin, subtle) */}
        <g transform="translate(200,80) scale(1.05)" opacity={opacity} filter="url(#rim)">
          <path
            d="
              M 250 320
              C 360 210, 540 160, 720 200
              C 820 220, 950 270, 1020 360
              C 1080 440, 1060 530, 960 590
              C 860 645, 720 660, 610 640
              C 540 630, 480 600, 430 560
              C 400 500, 380 460, 350 420
              C 315 395, 285 370, 250 320 Z
            "
            fill="none"
            stroke="url(#rimLight)"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Teeth (triangles along jaw) */}
          <g opacity="0.75">
            <path d="M520 600 l10 28 l12 -26 Z" fill="url(#tooth)" />
            <path d="M560 610 l10 28 l12 -24 Z" fill="url(#tooth)" />
            <path d="M600 618 l10 26 l12 -24 Z" fill="url(#tooth)" />
            <path d="M640 620 l10 24 l12 -22 Z" fill="url(#tooth)" />
            <path d="M680 618 l10 24 l12 -22 Z" fill="url(#tooth)" />
            <path d="M720 612 l10 24 l12 -22 Z" fill="url(#tooth)" />
            <path d="M760 600 l10 26 l12 -24 Z" fill="url(#tooth)" />
            <path d="M800 586 l10 24 l12 -22 Z" fill="url(#tooth)" />
          </g>

          {/* Intelligent eye (pupil + faint glint) */}
          <g transform="translate(865,420)">
            <circle r="9" fill={neutralInk} opacity="0.9" />
            <circle r="5" fill={brand600}>
              <animate attributeName="r" values="5;6.5;5" dur="8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.55;0.85;0.55" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="-2" cy="-2" r="1.5" fill="white">
              <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </svg>

      {/* Global keyframes are defined in CSS file */}
    </div>
  );
}