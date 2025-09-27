// components/ambient/StormLite.tsx
import React from "react";

export default function StormLite({ intensity = 1, lightning = true }:{ intensity?:0|1|2; lightning?:boolean }) {
  return (
    <div aria-hidden style={{position:"fixed",inset:0,zIndex:-2,pointerEvents:"none"}}>
      {intensity>0 && (
        <>
          <div style={{
            position:"absolute",inset:0,opacity:0.12,
            background:"repeating-linear-gradient(12deg, transparent 0 38px, color-mix(in oklab, black 25%, transparent) 38px 40px)",
            animation: intensity===2 ? "rainA 2.8s linear infinite" : "rainA 3.6s linear infinite",
            willChange:"background-position"
          }}/>
          <div style={{
            position:"absolute",inset:0,opacity:0.10,
            background:"repeating-linear-gradient(12deg, transparent 0 46px, color-mix(in oklab, black 22%, transparent) 46px 48px)",
            animation: intensity===2 ? "rainB 3.6s linear infinite" : "rainB 4.6s linear infinite",
            willChange:"background-position"
          }}/>
          <div style={{
            position:"absolute",inset:0,opacity:0.08,
            background:"repeating-linear-gradient(12deg, transparent 0 52px, color-mix(in oklab, black 18%, transparent) 52px 54px)",
            animation: intensity===2 ? "rainC 4.2s linear infinite" : "rainC 5.2s linear infinite",
            willChange:"background-position"
          }}/>
        </>
      )}
      {lightning && <div className="lc-flash" style={{position:"absolute",inset:0,mixBlendMode:"screen",pointerEvents:"none"}}/>}
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes rainA{0%{background-position:0 0}100%{background-position:-140px 260px}}
        @keyframes rainB{0%{background-position:0 0}100%{background-position:-190px 360px}}
        @keyframes rainC{0%{background-position:0 0}100%{background-position:-230px 420px}}
        .lc-flash{ background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0), rgba(255,255,255,0)); animation: flash-seq 22000ms ease-in-out infinite; opacity:0; }
        @keyframes flash-seq{ 0%,7%,100%{opacity:0} 8%{opacity:.45}9%{opacity:0} 10%{opacity:.35}11%{opacity:0} 38%{opacity:.28}39%{opacity:0} 63%{opacity:.32}64%{opacity:0} }
        @media (prefers-reduced-motion: reduce){ .lc-flash, .lc-bolt, .lc-bolt path { animation: none !important; } }
      `}} />
    </div>
  );
}
