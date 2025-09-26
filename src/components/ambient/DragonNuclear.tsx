// components/ambient/DragonNuclear.tsx
// Fixed, behind-everything dragon using a CSS data-URL. Zero JS. Zero Tailwind.
// Mount once, at the top of <main>.

export default function DragonNuclear({ 
  opacity = 0.14, 
  hue = 170 
}: { 
  opacity?: number; 
  hue?: number 
}) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <linearGradient id='rim' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stop-color='oklch(65% 0.11 ${hue})'/>
          <stop offset='100%' stop-color='oklch(50% 0.12 ${hue})'/>
        </linearGradient>
      </defs>
      <g transform='translate(180,60) scale(1.08)' opacity='${opacity}'>
        <path d='M250 320C360 210 540 160 720 200 820 220 920 240 1000 280 1060 310 1100 360 1080 440 1060 530 960 590 860 645 720 660 610 640 540 630 480 600 430 560 400 500 380 460 350 420 315 395 285 370 250 320Z'
              fill='none' stroke='url(#rim)' stroke-width='2' stroke-opacity='.7' vector-effect='non-scaling-stroke'/>
      </g>
    </svg>`
  );

  const style: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: -1,
    pointerEvents: "none",
    background:
      `radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0), rgba(255,255,255,0)),` +
      `url("data:image/svg+xml;utf8,${svg}") center / cover no-repeat,` +
      `oklch(98% 0 0)`,
  };

  return <div aria-hidden style={style} />;
}