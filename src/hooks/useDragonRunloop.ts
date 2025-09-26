"use client";

import { useEffect, useCallback, useRef } from 'react';

interface RunloopCallbacks {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

interface RunloopOptions {
  respectReducedMotion?: boolean;
  respectTabVisibility?: boolean;
  respectBatteryLevel?: boolean;
  respectDeviceMemory?: boolean;
  maxFrameTime?: number; // ms - if frames take longer, auto-pause
  debug?: boolean;
}

/**
 * useDragonRunloop - Performance Guardrails Hook
 * 
 * Automatically manages dragon animation lifecycle based on:
 * - Tab visibility (pause when hidden)
 * - Reduced motion preference
 * - Battery level (experimental)
 * - Device memory constraints
 * - Frame time performance
 */
export function useDragonRunloop(
  callbacks: RunloopCallbacks,
  options: RunloopOptions = {}
) {
  const {
    respectReducedMotion = true,
    respectTabVisibility = true,
    respectBatteryLevel = true,
    respectDeviceMemory = true,
    maxFrameTime = 33.33, // 30fps threshold
    debug = false
  } = options;

  const isRunningRef = useRef(true);
  const frameTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const batteryLevelRef = useRef<number | null>(null);
  const performanceWarningCount = useRef(0);

  // Get current running state
  const isRunning = useCallback(() => isRunningRef.current, []);

  // Safe start/stop with logging
  const safeStart = useCallback((reason: string) => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      callbacks.start();
      if (debug) {
        console.log(`🐉 Dragon started: ${reason}`);
      }
    }
  }, [callbacks, debug]);

  const safeStop = useCallback((reason: string) => {
    if (isRunningRef.current) {
      isRunningRef.current = false;
      callbacks.stop();
      if (debug) {
        console.log(`🐉 Dragon stopped: ${reason}`);
      }
    }
  }, [callbacks, debug]);

  const safePause = useCallback((reason: string) => {
    callbacks.pause();
    if (debug) {
      console.log(`🐉 Dragon paused: ${reason}`);
    }
  }, [callbacks, debug]);

  const safeResume = useCallback((reason: string) => {
    callbacks.resume();
    if (debug) {
      console.log(`🐉 Dragon resumed: ${reason}`);
    }
  }, [callbacks, debug]);

  // Performance monitoring
  const recordFrameTime = useCallback(() => {
    const now = performance.now();
    if (lastFrameTimeRef.current > 0) {
      frameTimeRef.current = now - lastFrameTimeRef.current;
      
      // Check for performance issues
      if (frameTimeRef.current > maxFrameTime) {
        performanceWarningCount.current++;
        
        if (performanceWarningCount.current >= 5) {
          safePause('performance degradation');
          performanceWarningCount.current = 0;
          
          // Resume after 5 seconds
          setTimeout(() => {
            safeResume('performance recovery attempt');
          }, 5000);
        }
      } else {
        performanceWarningCount.current = Math.max(0, performanceWarningCount.current - 1);
      }
    }
    lastFrameTimeRef.current = now;
  }, [maxFrameTime, safePause, safeResume]);

  // Tab visibility handling
  useEffect(() => {
    if (!respectTabVisibility) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        safeStop('tab hidden');
      } else {
        safeStart('tab visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial check
    if (document.hidden) {
      safeStop('tab initially hidden');
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [respectTabVisibility, safeStart, safeStop]);

  // Reduced motion handling
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        safeStop('reduced motion enabled');
      } else {
        safeStart('reduced motion disabled');
      }
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    
    // Initial check
    if (mediaQuery.matches) {
      safeStop('reduced motion initially enabled');
    }

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [respectReducedMotion, safeStart, safeStop]);

  // Battery level monitoring (experimental)
  useEffect(() => {
    if (!respectBatteryLevel) return;

    let batteryRef: any = null;

    const handleBatteryChange = () => {
      if (batteryRef) {
        const level = batteryRef.level;
        const charging = batteryRef.charging;
        
        batteryLevelRef.current = level;
        
        // Stop dragon if battery is critically low and not charging
        if (level < 0.15 && !charging) {
          safeStop('low battery');
        } else if (level > 0.25 || charging) {
          safeStart('battery sufficient');
        }
      }
    };

    // Try to get battery API (Chrome only)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryRef = battery;
        handleBatteryChange();
        
        battery.addEventListener('levelchange', handleBatteryChange);
        battery.addEventListener('chargingchange', handleBatteryChange);
      }).catch(() => {
        // Battery API not available
        if (debug) {
          console.log('🐉 Battery API not available');
        }
      });
    }

    return () => {
      if (batteryRef) {
        batteryRef.removeEventListener('levelchange', handleBatteryChange);
        batteryRef.removeEventListener('chargingchange', handleBatteryChange);
      }
    };
  }, [respectBatteryLevel, safeStart, safeStop, debug]);

  // Device memory constraints
  useEffect(() => {
    if (!respectDeviceMemory) return;

    const deviceMemory = (navigator as any).deviceMemory || 4;
    
    if (deviceMemory <= 2) {
      // Low memory device - run at reduced quality
      safePause('low device memory');
      
      // Resume with degraded quality after 2 seconds
      setTimeout(() => {
        safeResume('low memory mode');
      }, 2000);
    }
  }, [respectDeviceMemory, safePause, safeResume]);

  // Provide frame recording function
  const recordFrame = useCallback(() => {
    recordFrameTime();
  }, [recordFrameTime]);

  // Return control interface
  return {
    isRunning,
    start: safeStart,
    stop: safeStop,
    pause: safePause,
    resume: safeResume,
    recordFrame,
    
    // Status information
    status: {
      frameTime: frameTimeRef.current,
      batteryLevel: batteryLevelRef.current,
      performanceWarnings: performanceWarningCount.current,
      isTabVisible: !document.hidden,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  };
}

export default useDragonRunloop;