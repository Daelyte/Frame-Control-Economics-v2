// components/ambient/DragonMWD.tsx
// Minimal, always-visible dragon backdrop (server component, zero JS).
// No filters, no masks, no dependencies. It will render even if animations are off.

type Props = {
  hue?: number;      // 160–175 for jade/teal
  opacity?: number;  // 0.08–0.18 works well
};

export default function DragonMWD({ hue = 170, opacity = 0.14 }: Props) {
  const rimA = `oklch(65% 0.11 ${hue})`;
  const rimB = `oklch(50% 0.12 ${hue})`;

  // Known-working inline path (outline-only). Replace with your own later if you want.
  const DRAGON_PATH = `M250 320C360 210 540 160 720 200 820 220 890 260 950 320 1020 380 1080 440 1060 530 960 590 860 645 720 660 610 640 540 630 480 600 430 560 400 500 380 460 350 420 315 395 285 370 250 320Z`;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Fallback aura (works even if OKLCH unsupported) */}
      <div className="absolute -inset-[2%] opacity-60 [filter:blur(70px)] motion-reduce:animate-none aurora-fallback" />
      {/* Dragon outline (no animation, guaranteed visible) */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="dragon-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rimA} />
            <stop offset="100%" stopColor={rimB} />
          </linearGradient>
        </defs>
        <g transform="translate(180,60) scale(1.08)" opacity={opacity}>
          <path
            d={DRAGON_PATH}
            fill="none"
            stroke="url(#dragon-rim)"
            strokeWidth="2"
            strokeOpacity=".65"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* Keyframes + OKLCH progressive enhancement */}
      <style jsx global>{`
        /* Safe fallback background */
        .aurora-fallback{
          background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0), rgba(255,255,255,0));
        }
        /* If OKLCH is supported, enhance the aura + add gentle motion */
        @supports (color: oklch(50% 0.1 180)){
          .aurora-fallback{
            background: conic-gradient(from 180deg at 50% 50%,
              oklch(58% 0.12 ${hue}) 0deg,
              oklch(70% 0.15 95) 120deg,
              oklch(50% 0.12 ${hue}) 240deg,
              oklch(58% 0.12 ${hue}) 360deg);
            animation: aurora 14s ease-in-out infinite;
          }
        }
        @keyframes aurora{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-1.5%) scale(1.015)}}
        @media (prefers-reduced-motion: reduce){ .aurora-fallback{animation:none!important} }
      `}</style>
    </div>
  );
}