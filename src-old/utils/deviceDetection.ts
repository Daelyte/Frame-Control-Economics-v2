/**
 * Device detection utilities for enhanced responsive design
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  userAgent: string;
}

/**
 * Get comprehensive device information
 */
export const getDeviceInfo = (): DeviceInfo => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Screen size detection based on Tailwind breakpoints
  let screenSize: DeviceInfo['screenSize'] = 'xs';
  if (width >= 1920) screenSize = '3xl';
  else if (width >= 1536) screenSize = '2xl';
  else if (width >= 1280) screenSize = 'xl';
  else if (width >= 1024) screenSize = 'lg';
  else if (width >= 768) screenSize = 'md';
  else if (width >= 640) screenSize = 'sm';
  
  // Device type detection
  const isMobile = width < 768 || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = width >= 768 && width < 1024 && (height / width > 1.2 || width / height > 1.2);
  const isDesktop = width >= 1024;
  
  // Touch detection
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    screenSize,
    orientation: width > height ? 'landscape' : 'portrait',
    pixelRatio: window.devicePixelRatio || 1,
    userAgent
  };
};

/**
 * Add device-specific CSS classes to body
 */
export const addDeviceClasses = (): void => {
  const device = getDeviceInfo();
  const body = document.body;
  
  // Remove existing device classes
  body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'touch-device', 'no-touch');
  body.classList.remove('screen-xs', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl', 'screen-2xl', 'screen-3xl');
  body.classList.remove('orientation-portrait', 'orientation-landscape');
  
  // Add new device classes
  if (device.isMobile) body.classList.add('device-mobile');
  if (device.isTablet) body.classList.add('device-tablet');
  if (device.isDesktop) body.classList.add('device-desktop');
  
  body.classList.add(device.isTouch ? 'touch-device' : 'no-touch');
  body.classList.add(`screen-${device.screenSize}`);
  body.classList.add(`orientation-${device.orientation}`);
  
  // Add high DPI class
  if (device.pixelRatio > 1.5) {
    body.classList.add('high-dpi');
  }
};

/**
 * Debounced resize handler for performance
 */
export const createResizeHandler = (callback: () => void, delay: number = 150) => {
  let timeoutId: number;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, delay);
  };
};

/**
 * Initialize device detection
 */
export const initDeviceDetection = (): void => {
  // Initial setup
  addDeviceClasses();
  
  // Update on resize
  const handleResize = createResizeHandler(addDeviceClasses);
  window.addEventListener('resize', handleResize);
  
  // Update on orientation change
  window.addEventListener('orientationchange', () => {
    // Small delay to ensure dimensions are updated
    setTimeout(addDeviceClasses, 100);
  });
};

/**
 * Get optimal image size based on device
 */
export const getOptimalImageSize = (baseWidth: number): { width: number; height: number } => {
  const device = getDeviceInfo();
  let multiplier = 1;
  
  if (device.screenSize === 'xs') multiplier = 0.5;
  else if (device.screenSize === 'sm') multiplier = 0.7;
  else if (device.screenSize === 'md') multiplier = 0.8;
  else if (device.screenSize === 'lg') multiplier = 1;
  else if (device.screenSize === 'xl') multiplier = 1.2;
  else if (device.screenSize === '2xl') multiplier = 1.4;
  else if (device.screenSize === '3xl') multiplier = 1.6;
  
  // Account for pixel ratio
  multiplier *= device.pixelRatio;
  
  const width = Math.round(baseWidth * multiplier);
  const height = Math.round((baseWidth * 0.6) * multiplier); // 16:10 aspect ratio
  
  return { width, height };
};

/**
 * Check if device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if device supports hover
 */
export const supportsHover = (): boolean => {
  return window.matchMedia('(hover: hover)').matches;
};