"use client";
import { useRef } from "react";
import { motion as m, useMotionValue, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useTransform(mx, (v) => v * 0.25);
  const ty = useTransform(my, (v) => v * 0.25);

  return (
    <m.button
      ref={ref}
      onClick={onClick}
      onPointerMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      className={`
        relative inline-flex items-center justify-center rounded-2xl px-6 py-3 
        text-white shadow-md will-change-transform transition-all duration-150 
        hover:shadow-lg group overflow-hidden min-h-[44px]
        ${className}
      `}
      style={{ 
        transform: "translateZ(0)",
        background: 'var(--brand-600)'
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <m.span 
        style={{ x: tx, y: ty }} 
        className="font-medium tracking-wide relative z-10"
      >
        {children}
      </m.span>
      
      {/* Bloom effect */}
      <span 
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ 
          boxShadow: "0 0 40px 8px color-mix(in oklab, var(--brand-500) 35%, transparent) inset" 
        }} 
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: 'linear-gradient(135deg, var(--brand-500) 0%, var(--accent-500) 100%)'
        }}
      />
    </m.button>
  );
}