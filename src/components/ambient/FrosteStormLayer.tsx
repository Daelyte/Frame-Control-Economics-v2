// components/ambient/FrosteStormLayer.tsx  
// CSS-only rain + timed flashes (no new libs)

export default function FrosteStormLayer({
  intensity = 1, 
  lightning = true,
}: { 
  intensity?: 0|1|2; 
  lightning?: boolean; 
}) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      {/* Multi-layer rain system */}
      {intensity > 0 && (
        <>
          {/* Heavy rain layer */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none"
            style={{
              opacity: 0.12,
              background: 'repeating-linear-gradient(12deg, transparent 0 38px, color-mix(in oklab, oklch(22% 0 0) 25%, transparent) 38px 40px)',
              animation: intensity === 2 ? 'rainA 2.8s linear infinite' : 'rainA 3.6s linear infinite'
            }}
          />
          
          {/* Medium rain layer */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none"
            style={{
              opacity: 0.10,
              background: 'repeating-linear-gradient(12deg, transparent 0 46px, color-mix(in oklab, oklch(22% 0 0) 22%, transparent) 46px 48px)',
              animation: intensity === 2 ? 'rainB 3.6s linear infinite' : 'rainB 4.6s linear infinite'
            }}
          />
          
          {/* Light rain layer */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none"
            style={{
              opacity: 0.08,
              background: 'repeating-linear-gradient(12deg, transparent 0 52px, color-mix(in oklab, oklch(22% 0 0) 18%, transparent) 52px 54px)',
              animation: intensity === 2 ? 'rainC 4.2s linear infinite' : 'rainC 5.2s linear infinite'
            }}
          />
        </>
      )}
      
      {/* Lightning flash system */}
      {lightning && (
        <>
          {/* Global screen flash */}
          <div 
            className="absolute inset-0 motion-reduce:animate-none"
            style={{
              background: 'radial-gradient(70% 70% at 50% 30%, oklch(72% 0.10 170) 0%, transparent 60%)',
              mixBlendMode: 'screen',
              animation: 'flash 22s ease-in-out infinite'
            }}
          />
          
          {/* Lightning bolt shapes */}
          <svg viewBox="0 0 1600 900" className="absolute inset-0 w-full h-full">
            <g opacity="0" style={{ animation: 'boltFlash 22s ease-in-out infinite' }}>
              <path 
                d="M200 100 L180 200 L220 200 L200 350 L320 220 L280 220 L300 100 Z"
                fill="oklch(99% 0 0)"
                opacity="0.8"
                filter="blur(1px)"
              />
              <path 
                d="M1200 80 L1180 180 L1220 180 L1200 300 L1350 200 L1300 200 L1320 80 Z"
                fill="oklch(99% 0 0)"
                opacity="0.6"
                filter="blur(1px)"
              />
            </g>
          </svg>
        </>
      )}
      
      <style jsx global>{`
        @keyframes rainA {
          0% { background-position: 0 0; }
          100% { background-position: -140px 260px; }
        }
        @keyframes rainB {
          0% { background-position: 0 0; }
          100% { background-position: -190px 360px; }
        }
        @keyframes rainC {
          0% { background-position: 0 0; }
          100% { background-position: -230px 420px; }
        }
        @keyframes flash {
          0%, 7%, 100% { opacity: 0; }
          8% { opacity: 0.45; }
          9% { opacity: 0; }
          10% { opacity: 0.35; }
          11% { opacity: 0; }
          38%, 39% { opacity: 0.25; }
          40% { opacity: 0; }
          63% { opacity: 0.32; }
          64% { opacity: 0; }
        }
        @keyframes boltFlash {
          0%, 7%, 100% { opacity: 0; }
          8% { opacity: 1; }
          9% { opacity: 0; }
          10% { opacity: 0.8; }
          11% { opacity: 0; }
          38% { opacity: 0.9; }
          39% { opacity: 0; }
          63% { opacity: 0.7; }
          64% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { 
          [style*="rainA"], [style*="rainB"], [style*="rainC"], [style*="flash"], [style*="boltFlash"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}