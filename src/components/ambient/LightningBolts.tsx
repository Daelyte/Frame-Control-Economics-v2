// components/ambient/LightningBolts.tsx
"use client";
import { useEffect, useMemo, useRef } from "react";

function qualityTier(): "low" | "high" {
  const mem = (navigator as any).deviceMemory || 4;
  const conn = (navigator as any).connection?.effectiveType || "4g";
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  if (mobile || mem <= 4 || /2g|3g/.test(conn)) return "low";
  return "high";
}

export default function LightningBolts({ period = 22000 }: { period?: number }) {
  const tier = useMemo(qualityTier, []);
  const paused = useRef(false);

  useEffect(() => {
    const onVis = () => {
      paused.current = document.hidden;
      toggle(paused.current);
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onRM = () => { paused.current = mq.matches; toggle(paused.current); };
    document.addEventListener("visibilitychange", onVis);
    mq.addEventListener?.("change", onRM);
    onVis(); onRM();
    return () => { document.removeEventListener("visibilitychange", onVis); mq.removeEventListener?.("change", onRM); };
  }, []);

  function toggle(pause: boolean) {
    document.querySelectorAll<SVGSVGElement>(".lc-bolt").forEach(svg => {
      svg.style.animationPlayState = pause ? "paused" : "running";
    });
    const flash = document.querySelector<HTMLElement>(".lc-flash");
    if (flash) flash.style.animationPlayState = pause ? "paused" : "running";
  }

  const bolts = tier === "high"
    ? [
        { className: "left", d: "M 320 40 L 260 220 L 340 220 L 280 420 L 440 200 L 360 200 L 420 40 Z", left: "8vw", top: "8vh", size: "28vmin" },
        { className: "right", d: "M 420 60 L 360 210 L 430 210 L 370 370 L 520 180 L 450 180 L 500 60 Z", right: "10vw", top: "16vh", size: "22vmin" },
      ]
    : [
        { className: "right", d: "M 420 60 L 360 210 L 430 210 L 370 370 L 520 180 L 450 180 L 500 60 Z", right: "10vw", top: "16vh", size: "22vmin" },
      ];

  return (
    <>
      {bolts.map((b, i) => (
        <svg key={i} className="lc-bolt" viewBox="0 0 800 800" aria-hidden
             style={{ position:"fixed", zIndex:-1, pointerEvents:"none", opacity:0, left: b.left, right: b.right, top: b.top, width: b.size, height: b.size }}>
          <defs>
            <filter id={`glow${i}`}><feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path d={b.d} fill="none" stroke="white" strokeWidth="3.5" filter={`url(#glow${i})`}
                strokeLinejoin="round" strokeLinecap="round" style={{ strokeDasharray: 560, strokeDashoffset: 560 }}/>
        </svg>
      ))}

      <style dangerouslySetInnerHTML={{__html:`
        .lc-bolt{ animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .lc-bolt path{ animation: bolt-stroke 22000ms ease-in-out infinite; }
        @keyframes bolt-stroke {
          0%,7% { stroke-dashoffset:560; opacity:0 }
          8% { stroke-dashoffset:40; opacity:1 }
          9% { stroke-dashoffset:560; opacity:0 }
          38% { stroke-dashoffset:60; opacity:.95 }
          39% { stroke-dashoffset:560; opacity:0 }
          63% { stroke-dashoffset:80; opacity:.9 }
          64% { stroke-dashoffset:560; opacity:0 }
          100% { stroke-dashoffset:560; opacity:0 }
        }
        @media (prefers-reduced-motion: reduce){ .lc-bolt, .lc-bolt path { animation: none !important } }
      `}} />
    </>
  );
}