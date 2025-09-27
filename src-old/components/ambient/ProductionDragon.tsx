import React, { useEffect, useRef, useState } from 'react';

interface ProductionDragonProps {
  hue?: number;        // 0-360
  opacity?: number;    // 0.0-1.0
  intensity?: number;  // 0.0-2.0
  debug?: boolean;
  className?: string;
}

export const ProductionDragon: React.FC<ProductionDragonProps> = ({
  hue = 170,
  opacity = 0.14,
  intensity = 1.0,
  debug = false,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderStatus, setRenderStatus] = useState<{
    mounted: boolean;
    visible: boolean;
    cssLoaded: boolean;
    reducedMotion: boolean;
  }>({
    mounted: false,
    visible: false,
    cssLoaded: false,
    reducedMotion: false
  });

  // Check if element is actually visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setRenderStatus(prev => ({
          ...prev,
          visible: entry.isIntersecting,
          mounted: true
        }));
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Check if CSS is loaded by testing a known class
    const testElement = document.createElement('div');
    testElement.className = 'fixed';
    document.body.appendChild(testElement);
    const computed = getComputedStyle(testElement);
    const cssLoaded = computed.position === 'fixed';
    document.body.removeChild(testElement);

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setRenderStatus(prev => ({
      ...prev,
      cssLoaded,
      reducedMotion: prefersReducedMotion
    }));

    return () => observer.disconnect();
  }, []);

  // Color calculations with fallbacks
  const primaryColor = `oklch(${65}% ${0.11} ${hue})`;
  const secondaryColor = `oklch(${50}% ${0.12} ${hue})`;
  const fallbackColor = `hsl(${hue}, 45%, 60%)`;

  if (debug) {
    console.log('🐉 ProductionDragon render status:', renderStatus);
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`dragon-backdrop-container ${className || ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -10,
          pointerEvents: 'none',
          // Debug mode - make super visible
          ...(debug && {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '2px solid red',
            zIndex: 9999
          })
        }}
        aria-hidden="true"
        data-testid="dragon-backdrop"
      >
        {/* Aurora Layer */}
        <div
          className="dragon-aurora"
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            width: '110%',
            height: '110%',
            background: `conic-gradient(from 180deg at 50% 50%, ${primaryColor} 0deg, oklch(70% 0.15 95) 120deg, ${secondaryColor} 240deg, ${primaryColor} 360deg)`,
            // CSS fallback
            backgroundImage: renderStatus.cssLoaded 
              ? undefined 
              : `radial-gradient(60% 60% at 50% 40%, ${fallbackColor}33, transparent)`,
            opacity: opacity * 0.6,
            filter: 'blur(70px)',
            animation: renderStatus.reducedMotion ? 'none' : 'dragon-aurora-pulse 14s ease-in-out infinite'
          }}
        />

        {/* Storm Layer */}
        {intensity > 0 && (
          <>
            <div
              className="storm-rain-1"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `repeating-linear-gradient(12deg, transparent 0px, transparent 38px, rgba(64, 224, 208, ${0.12 * intensity}) 38px, rgba(64, 224, 208, ${0.12 * intensity}) 40px)`,
                animation: renderStatus.reducedMotion ? 'none' : 'dragon-rain-1 3.6s linear infinite'
              }}
            />
            <div
              className="storm-rain-2"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `repeating-linear-gradient(12deg, transparent 0px, transparent 46px, rgba(64, 224, 208, ${0.10 * intensity}) 46px, rgba(64, 224, 208, ${0.10 * intensity}) 48px)`,
                animation: renderStatus.reducedMotion ? 'none' : 'dragon-rain-2 4.6s linear infinite'
              }}
            />
          </>
        )}

        {/* Dragon Silhouette */}
        <div
          className="dragon-silhouette"
          style={{
            position: 'absolute',
            top: '25%',
            left: '20%',
            width: '300px',
            height: '150px',
            border: `2px solid ${primaryColor}`,
            borderRadius: '60% 40% 80% 20%',
            background: `radial-gradient(ellipse, ${primaryColor}33, transparent)`,
            // Fallback for older browsers
            backgroundColor: renderStatus.cssLoaded ? undefined : `${fallbackColor}22`,
            opacity: opacity + 0.3,
            animation: renderStatus.reducedMotion ? 'none' : 'dragon-float 4s ease-in-out infinite',
            // Debug mode override
            ...(debug && {
              border: '5px solid red',
              backgroundColor: 'rgba(255, 0, 0, 0.3)',
              opacity: 1
            })
          }}
        >
          {/* Dragon Eye */}
          <div
            style={{
              position: 'absolute',
              top: '35%',
              right: '30%',
              width: '8px',
              height: '8px',
              background: primaryColor,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${primaryColor}`,
              animation: renderStatus.reducedMotion ? 'none' : 'dragon-blink 2.5s infinite',
              // Debug mode override
              ...(debug && {
                background: 'red',
                width: '16px',
                height: '16px'
              })
            }}
          />
        </div>

        {/* Lightning Layer */}
        {intensity > 0.5 && (
          <div
            className="lightning-flash"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0)',
              mixBlendMode: 'screen',
              animation: renderStatus.reducedMotion ? 'none' : 'dragon-lightning 22s ease-in-out infinite'
            }}
          />
        )}
      </div>

      {/* CSS Keyframes - Inline to prevent purging */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dragon-aurora-pulse {
            0%, 100% { transform: translateY(0) scale(1); opacity: ${opacity * 0.6}; }
            50% { transform: translateY(-1.5%) scale(1.015); opacity: ${opacity * 0.8}; }
          }
          @keyframes dragon-rain-1 {
            0% { background-position: 0 0; }
            100% { background-position: -140px 260px; }
          }
          @keyframes dragon-rain-2 {
            0% { background-position: 0 0; }
            100% { background-position: -190px 360px; }
          }
          @keyframes dragon-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-15px) scale(1.02); }
          }
          @keyframes dragon-blink {
            0%, 85%, 100% { opacity: 1; }
            90%, 95% { opacity: 0.1; }
          }
          @keyframes dragon-lightning {
            0%, 7%, 100% { background: rgba(255, 255, 255, 0); }
            8% { background: rgba(255, 255, 255, 0.1); }
            9% { background: rgba(255, 255, 255, 0); }
            10% { background: rgba(255, 255, 255, 0.08); }
            11% { background: rgba(255, 255, 255, 0); }
            38%, 39% { background: rgba(255, 255, 255, 0.06); }
            40% { background: rgba(255, 255, 255, 0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .dragon-aurora,
            .storm-rain-1,
            .storm-rain-2,
            .dragon-silhouette,
            .lightning-flash {
              animation: none !important;
            }
          }
        `
      }} />

      {/* Debug Panel */}
      {debug && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 10000,
            border: '1px solid #40e0d0'
          }}
        >
          <div>🐉 Dragon Debug Status</div>
          <div>Mounted: {renderStatus.mounted ? '✅' : '❌'}</div>
          <div>Visible: {renderStatus.visible ? '✅' : '❌'}</div>
          <div>CSS Loaded: {renderStatus.cssLoaded ? '✅' : '❌'}</div>
          <div>Reduced Motion: {renderStatus.reducedMotion ? '✅' : '❌'}</div>
          <div>Hue: {hue}</div>
          <div>Opacity: {opacity}</div>
          <div>Intensity: {intensity}</div>
          <div>Container Z-Index: -10 {debug ? '(DEBUG: 9999)' : ''}</div>
        </div>
      )}
    </>
  );
};

export default ProductionDragon;