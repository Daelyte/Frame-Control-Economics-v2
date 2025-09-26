"use client";

import React, { useEffect, useState, Suspense, lazy } from 'react';

// Lazy load dragon scene - NOT bundled in initial JS
const DragonScene = lazy(() => import('./DragonScene'));

interface DragonBootProps {
  enabled?: boolean;
  delayMs?: number;
  debug?: boolean;
}

/**
 * DragonBoot - LCP-Gated Dragon Mounting
 * 
 * Ensures dragon loads ONLY after LCP fires, protecting Lighthouse scores.
 * Uses PerformanceObserver + requestIdleCallback for maximum compatibility.
 */
export const DragonBoot: React.FC<DragonBootProps> = ({
  enabled = true,
  delayMs = 300,
  debug = false
}) => {
  const [ready, setReady] = useState(false);
  const [lcpTime, setLcpTime] = useState<number | null>(null);
  const [mountReason, setMountReason] = useState<string>('');

  useEffect(() => {
    if (!enabled) return;

    let started = false;
    let lcpObserver: PerformanceObserver | null = null;
    let idleTimeout: number | null = null;

    const mountDragon = (reason: string, delay: number = delayMs) => {
      if (started) return;
      started = true;
      
      setMountReason(reason);
      if (debug) {
        console.log(`🐉 DragonBoot: Mounting dragon (${reason}) in ${delay}ms`);
      }
      
      setTimeout(() => {
        setReady(true);
      }, delay);
    };

    // Strategy 1: Mount after Largest Contentful Paint (best for Lighthouse)
    try {
      lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcpEntry = entry as PerformanceEntry;
            setLcpTime(Math.round(lcpEntry.startTime));
            
            if (!started) {
              mountDragon(`LCP@${Math.round(lcpEntry.startTime)}ms`);
            }
          }
        }
      });
      
      lcpObserver.observe({ 
        type: 'largest-contentful-paint', 
        buffered: true 
      } as PerformanceObserverInit);
      
      if (debug) {
        console.log('🐉 DragonBoot: LCP observer active');
      }
    } catch (error) {
      if (debug) {
        console.warn('🐉 DragonBoot: LCP observer failed:', error);
      }
    }

    // Strategy 2: Fallback to idle time (in case LCP observer unavailable)
    if ('requestIdleCallback' in window) {
      idleTimeout = (window as any).requestIdleCallback(
        () => {
          if (!started) {
            mountDragon('idle-callback');
          }
        },
        { timeout: 2000 }
      );
    }

    // Strategy 3: Ultimate fallback - fixed delay
    const fallbackTimeout = setTimeout(() => {
      if (!started) {
        mountDragon('fallback-timeout', 0);
      }
    }, 3000);

    return () => {
      lcpObserver?.disconnect();
      if (idleTimeout) {
        (window as any).cancelIdleCallback(idleTimeout);
      }
      clearTimeout(fallbackTimeout);
    };
  }, [enabled, delayMs, debug]);

  // Don't render anything until we're ready
  if (!ready) {
    return debug ? (
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        borderRadius: '4px'
      }}>
        🐉 Dragon Boot: Waiting for LCP...
        {lcpTime && <div>LCP: {lcpTime}ms</div>}
      </div>
    ) : null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <DragonScene />
      </Suspense>
      {debug && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'rgba(0,100,0,0.8)',
          color: 'white',
          padding: '8px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          borderRadius: '4px'
        }}>
          🐉 Dragon Active: {mountReason}
          {lcpTime && <div>LCP: {lcpTime}ms</div>}
        </div>
      )}
    </>
  );
};

export default DragonBoot;