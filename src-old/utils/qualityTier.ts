/**
 * Adaptive Quality System
 * Automatically detects device capabilities and scales dragon effects accordingly
 */

export type QualityTier = 'low' | 'medium' | 'high';

export interface DeviceCapabilities {
  memory: number;         // GB
  cores: number;          // CPU cores
  connection: string;     // '2g', '3g', '4g', 'unknown'
  isMobile: boolean;
  isLowEnd: boolean;
  batteryLevel?: number;  // 0-1
  powerMode?: 'high-performance' | 'balanced' | 'power-saver';
}

export interface QualitySettings {
  tier: QualityTier;
  
  // Animation settings
  dragonLayers: number;         // 1-3 atmospheric layers
  rainLayers: number;           // 1-3 rain layers
  lightningEnabled: boolean;    // Lightning bolts
  particlesEnabled: boolean;    // Smoke particles
  glowEnabled: boolean;         // Eye glow effects
  
  // Performance settings
  targetFPS: number;            // 30 or 60
  updateInterval: number;       // ms between updates
  eyeBlinkInterval: number;     // ms between blinks
  breathingAmplitude: number;   // 0-1 scale factor
  
  // Visual settings
  opacity: number;              // 0-1 overall opacity
  blur: number;                 // px blur amount
  animationDuration: {
    breathing: number;          // seconds
    lightning: number;          // seconds
    eyeBlink: number;          // seconds
  };
}

/**
 * Detect device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  // Memory detection
  const memory = (navigator as any).deviceMemory || 4; // Default 4GB
  
  // CPU cores detection
  const cores = navigator.hardwareConcurrency || 4;
  
  // Connection detection
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';
  
  // Mobile detection
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Low-end device detection
  const isLowEnd = memory <= 4 || cores <= 2 || /2g|slow-2g/.test(effectiveType) || isMobile;
  
  // Battery API (experimental)
  let batteryLevel: number | undefined;
  let powerMode: DeviceCapabilities['powerMode'] | undefined;
  
  try {
    // @ts-ignore - Battery API is experimental
    if ('getBattery' in navigator) {
      // @ts-ignore
      navigator.getBattery().then((battery: any) => {
        batteryLevel = battery.level;
        powerMode = battery.level < 0.2 ? 'power-saver' : 'balanced';
      });
    }
  } catch (error) {
    // Battery API not supported
  }
  
  return {
    memory,
    cores,
    connection: effectiveType,
    isMobile,
    isLowEnd,
    batteryLevel,
    powerMode
  };
}

/**
 * Determine quality tier based on device capabilities
 */
export function getQualityTier(capabilities?: DeviceCapabilities): QualityTier {
  const caps = capabilities || getDeviceCapabilities();
  
  // Force low quality for power saving
  if (caps.powerMode === 'power-saver' || (caps.batteryLevel && caps.batteryLevel < 0.15)) {
    return 'low';
  }
  
  // Low-end devices
  if (caps.isLowEnd || caps.memory <= 4 || /2g|slow-2g/.test(caps.connection)) {
    return 'low';
  }
  
  // High-end devices
  if (caps.memory >= 8 && caps.cores >= 8 && caps.connection === '4g' && !caps.isMobile) {
    return 'high';
  }
  
  // Everything else is medium
  return 'medium';
}

/**
 * Get quality settings for a given tier
 */
export function getQualitySettings(tier: QualityTier, customOverrides?: Partial<QualitySettings>): QualitySettings {
  const baseSettings: Record<QualityTier, QualitySettings> = {
    low: {
      tier: 'low',
      dragonLayers: 1,
      rainLayers: 1,
      lightningEnabled: false,
      particlesEnabled: false,
      glowEnabled: false,
      targetFPS: 30,
      updateInterval: 66, // ~15fps update rate
      eyeBlinkInterval: 4000,
      breathingAmplitude: 0.02,
      opacity: 0.08,
      blur: 40,
      animationDuration: {
        breathing: 22,
        lightning: 0,
        eyeBlink: 1.5
      }
    },
    
    medium: {
      tier: 'medium',
      dragonLayers: 2,
      rainLayers: 2,
      lightningEnabled: true,
      particlesEnabled: false,
      glowEnabled: true,
      targetFPS: 60,
      updateInterval: 33, // ~30fps update rate
      eyeBlinkInterval: 3000,
      breathingAmplitude: 0.03,
      opacity: 0.12,
      blur: 60,
      animationDuration: {
        breathing: 18,
        lightning: 24,
        eyeBlink: 2.0
      }
    },
    
    high: {
      tier: 'high',
      dragonLayers: 3,
      rainLayers: 3,
      lightningEnabled: true,
      particlesEnabled: true,
      glowEnabled: true,
      targetFPS: 60,
      updateInterval: 16, // ~60fps update rate
      eyeBlinkInterval: 2500,
      breathingAmplitude: 0.04,
      opacity: 0.16,
      blur: 80,
      animationDuration: {
        breathing: 14,
        lightning: 18,
        eyeBlink: 2.5
      }
    }
  };
  
  const settings = baseSettings[tier];
  return customOverrides ? { ...settings, ...customOverrides } : settings;
}

/**
 * Performance monitoring for automatic quality degradation
 */
export class QualityController {
  private currentTier: QualityTier;
  private frameTimes: number[] = [];
  private lastFrameTime = 0;
  private degradationCount = 0;
  private upgradeTimer = 0;
  
  constructor(initialTier?: QualityTier) {
    this.currentTier = initialTier || getQualityTier();
  }
  
  recordFrame(): void {
    const now = performance.now();
    if (this.lastFrameTime > 0) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimes.push(frameTime);
      
      // Keep only last 60 frames
      if (this.frameTimes.length > 60) {
        this.frameTimes.shift();
      }
      
      // Check for performance issues every 60 frames
      if (this.frameTimes.length === 60) {
        this.checkPerformance();
      }
    }
    this.lastFrameTime = now;
  }
  
  private checkPerformance(): void {
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const targetFrameTime = this.currentTier === 'low' ? 33.33 : 16.67; // 30fps or 60fps
    
    // Degrade quality if performance is poor
    if (avgFrameTime > targetFrameTime * 1.5) {
      this.degradationCount++;
      if (this.degradationCount >= 3) {
        this.degradeQuality();
        this.degradationCount = 0;
      }
    } else {
      this.degradationCount = Math.max(0, this.degradationCount - 1);
      this.upgradeTimer++;
      
      // Try to upgrade quality after good performance
      if (this.upgradeTimer >= 300) { // 5 minutes of good performance
        this.upgradeQuality();
        this.upgradeTimer = 0;
      }
    }
  }
  
  private degradeQuality(): void {
    const newTier: QualityTier = 
      this.currentTier === 'high' ? 'medium' :
      this.currentTier === 'medium' ? 'low' : 'low';
    
    if (newTier !== this.currentTier) {
      console.log(`🐉 Quality degraded: ${this.currentTier} → ${newTier}`);
      this.currentTier = newTier;
    }
  }
  
  private upgradeQuality(): void {
    const deviceTier = getQualityTier();
    const newTier: QualityTier = 
      this.currentTier === 'low' && deviceTier !== 'low' ? 'medium' :
      this.currentTier === 'medium' && deviceTier === 'high' ? 'high' : this.currentTier;
    
    if (newTier !== this.currentTier) {
      console.log(`🐉 Quality upgraded: ${this.currentTier} → ${newTier}`);
      this.currentTier = newTier;
    }
  }
  
  getCurrentTier(): QualityTier {
    return this.currentTier;
  }
  
  getCurrentSettings(overrides?: Partial<QualitySettings>): QualitySettings {
    return getQualitySettings(this.currentTier, overrides);
  }
  
  // Force quality tier (for testing)
  setTier(tier: QualityTier): void {
    this.currentTier = tier;
    console.log(`🐉 Quality forced: ${tier}`);
  }
  
  reset(): void {
    this.frameTimes = [];
    this.degradationCount = 0;
    this.upgradeTimer = 0;
    this.currentTier = getQualityTier();
  }
}

import React from 'react';

/**
 * React hook for quality management
 */
export function useAdaptiveQuality(initialTier?: QualityTier) {
  const [controller] = React.useState(() => new QualityController(initialTier));
  const [currentTier, setCurrentTier] = React.useState(controller.getCurrentTier());
  const [settings, setSettings] = React.useState(controller.getCurrentSettings());
  
  React.useEffect(() => {
    let animationId: number;
    
    const updateQuality = () => {
      controller.recordFrame();
      const newTier = controller.getCurrentTier();
      
      if (newTier !== currentTier) {
        setCurrentTier(newTier);
        setSettings(controller.getCurrentSettings());
      }
      
      animationId = requestAnimationFrame(updateQuality);
    };
    
    animationId = requestAnimationFrame(updateQuality);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [controller, currentTier]);
  
  return {
    tier: currentTier,
    settings,
    controller
  };
}
