// Zero-JS server element that animates with CSS
// Gracefully stops when users prefer reduced motion

export default function TechBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" 
           style={{ background: 'var(--surface-0)' }}>
        {/* Aurora gradient bloom */}
        <div 
          className="absolute -inset-1 opacity-60 animate-[aurora_10s_ease-in-out_infinite] motion-reduce:animate-none"
          style={{ 
            filter: 'blur(60px)',
            background: `conic-gradient(
              from 180deg at 50% 50%,
              var(--brand-500) 0deg,
              var(--accent-500) 120deg,
              var(--brand-600) 240deg,
              var(--brand-500) 360deg
            )`
          }}
        />

        {/* Diagonal topographic lines */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-25 motion-reduce:opacity-15" 
          aria-hidden="true"
        >
          <defs>
            <pattern 
              id="topo" 
              width="220" 
              height="220" 
              patternUnits="userSpaceOnUse" 
              patternTransform="rotate(25)"
            >
              <path 
                d="M0 110 H220" 
                stroke="var(--neutral-500)" 
                strokeWidth="1" 
                fill="none" 
              />
              <path 
                d="M0 80 H220" 
                stroke="var(--neutral-400)" 
                strokeWidth="0.8" 
                fill="none" 
              />
              <path 
                d="M0 140 H220" 
                stroke="var(--neutral-400)" 
                strokeWidth="0.8" 
                fill="none" 
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)">
            <animate 
              attributeName="x" 
              from="0" 
              to="-220" 
              dur="18s" 
              repeatCount="indefinite" 
              begin="0s"
              className="motion-reduce:animate-none"
            />
          </rect>
        </svg>
      </div>

      {/* Global styles for aurora animation */}
      <style jsx global>{`
        @keyframes aurora {
          0%, 100% { 
            transform: translateY(0) scale(1); 
          }
          50% { 
            transform: translateY(-2%) scale(1.02); 
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce\\:animate-none { 
            animation: none !important; 
          }
          .motion-reduce\\:opacity-15 { 
            opacity: 0.15 !important; 
          }
        }
      `}</style>
    </>
  );
}