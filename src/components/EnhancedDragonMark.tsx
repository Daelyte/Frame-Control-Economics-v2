"use client";
import { motion as m, useMotionValue, useTransform } from "framer-motion";

export function EnhancedDragonMark({ size = 220 }: { size?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform([x, y], ([vx, vy]) => (vx + vy) * 0.02);

  return (
    <m.div
      className="relative will-change-transform cursor-pointer"
      style={{ width: size, height: size }}
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        x.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
        y.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      <m.svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 0.8, scale: [0.985, 1.0, 0.985] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotate }}
      >
        {/* Enhanced dragon design with proper gradients */}
        <defs>
          <radialGradient id="enhancedJadeGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--accent-500)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="enhancedDragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-600)" />
            <stop offset="50%" stopColor="var(--brand-500)" />
            <stop offset="100%" stopColor="var(--accent-500)" />
          </linearGradient>
        </defs>
        
        <circle cx="100" cy="100" r="80" fill="url(#enhancedJadeGlow)" />
        
        {/* Dragon head - more detailed */}
        <g stroke="url(#enhancedDragonGradient)" strokeWidth="2.5" strokeLinecap="round" fill="none">
          {/* Main head shape */}
          <path d="M30,110 C50,60 120,40 145,80 C165,110 130,130 110,140 C90,150 65,155 55,135 C45,118 60,100 85,100" />
          
          {/* Dragon horns/antlers - flowing design */}
          <path d="M120,65 L140,45 M125,70 L145,55 M130,75 L150,65" />
          <path d="M135,60 L155,40 M140,65 L160,50" />
          
          {/* Eye with depth */}
          <circle cx="110" cy="85" r="3" fill="var(--accent-500)" />
          <circle cx="111" cy="83" r="1.5" fill="var(--surface-0)" />
          
          {/* Nostril */}
          <circle cx="85" cy="95" r="1.5" fill="none" stroke="var(--brand-600)" strokeWidth="1" />
          
          {/* Breathing effect - subtle pulse */}
          <circle 
            cx="100" 
            cy="100" 
            r="70" 
            fill="none" 
            stroke="var(--brand-400)" 
            strokeWidth="0.5" 
            opacity="0.3"
          >
            <animate 
              attributeName="r" 
              values="70;75;70" 
              dur="6s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0.3;0.1;0.3" 
              dur="6s" 
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </m.svg>
    </m.div>
  );
}