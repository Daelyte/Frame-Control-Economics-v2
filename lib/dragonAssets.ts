// Dragon Asset Management System
// Handles loading, caching, and optimization of dragon 3D models

export interface DragonAsset {
  name: string;
  url: string;
  format: 'glb' | 'gltf' | 'fbx';
  size: number; // KB
  complexity: 'low' | 'medium' | 'high';
  animations: string[];
  license: string;
  attribution?: string;
}

// Curated dragon assets optimized for web performance
export const DRAGON_ASSETS: DragonAsset[] = [
  {
    name: 'Low Poly Dragon Head',
    url: '/models/dragon-head-lowpoly.glb',
    format: 'glb',
    size: 125, // 125KB compressed
    complexity: 'low',
    animations: ['idle', 'breathe', 'roar'],
    license: 'CC0',
    attribution: 'Optimized for Frame Economics'
  },
  {
    name: 'Mystical Dragon Bust',
    url: '/models/dragon-bust-mystical.glb', 
    format: 'glb',
    size: 280, // 280KB compressed
    complexity: 'medium',
    animations: ['float', 'eye_glow', 'particle_breath'],
    license: 'CC0'
  },
  {
    name: 'Fallback Dragon SVG',
    url: '/dragons/dragon-silhouette.svg',
    format: 'glb', // Using format field for type
    size: 8, // 8KB SVG
    complexity: 'low',
    animations: ['css_float', 'css_glow'],
    license: 'MIT'
  }
];

// Quality tiers based on device capabilities
export const getOptimalDragonAsset = (deviceTier: 'low' | 'medium' | 'high'): DragonAsset => {
  switch (deviceTier) {
    case 'low':
      return DRAGON_ASSETS[2]; // Fallback SVG
    case 'medium':
      return DRAGON_ASSETS[0]; // Low poly 3D
    case 'high':
      return DRAGON_ASSETS[1]; // Full quality 3D
    default:
      return DRAGON_ASSETS[0];
  }
};

// Device detection utility
export const detectDeviceTier = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'low';
  }
  
  // Basic performance indicators
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) return 'low';
  
  // Check WebGL capabilities
  const renderer = gl.getParameter(gl.RENDERER);
  
  // Modern GPU indicators
  const hasModernGPU = renderer.includes('RTX') || 
                      renderer.includes('RX ') ||
                      renderer.includes('Intel Iris') ||
                      renderer.includes('Apple M') ||
                      renderer.includes('Mali-G');
  
  // Memory and connection checks
  const hasGoodConnection = 'connection' in navigator && 
    (navigator as any).connection?.effectiveType === '4g';
  
  const hasEnoughMemory = 'deviceMemory' in navigator && 
    (navigator as any).deviceMemory >= 4;
    
  if (hasModernGPU && hasGoodConnection && hasEnoughMemory) {
    return 'high';
  }
  
  if (gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096) {
    return 'medium';
  }
  
  return 'low';
};

// Preload dragon assets based on device tier
export const preloadDragonAssets = async (tier: 'low' | 'medium' | 'high') => {
  const asset = getOptimalDragonAsset(tier);
  
  if (asset.url.endsWith('.glb') || asset.url.endsWith('.gltf')) {
    // Preload 3D model
    try {
      const response = await fetch(asset.url);
      if (response.ok) {
        // Cache in browser
        console.log(`✅ Preloaded dragon asset: ${asset.name}`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to preload dragon asset:`, error);
    }
  }
};