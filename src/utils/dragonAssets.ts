/**
 * Dragon Asset Management System
 * Handles responsive dragon imagery throughout the site
 */

export interface DragonAsset {
  path: string;
  opacity: number;
  description: string;
  bestUseCase: string;
}

export const dragonAssets: Record<string, DragonAsset> = {
  translucent70: {
    path: '/dragons/og-dragon-translucent-70.png',
    opacity: 70,
    description: 'High visibility translucent dragon',
    bestUseCase: 'Hero sections, main branding elements'
  },
  translucent40: {
    path: '/dragons/og-dragon-translucent-40.png',
    opacity: 40,
    description: 'Balanced visibility translucent dragon',
    bestUseCase: 'Section backgrounds, content overlays'
  },
  translucent20: {
    path: '/dragons/og-dragon-translucent-20.png',
    opacity: 20,
    description: 'Subtle watermark dragon',
    bestUseCase: 'Page watermarks, footer elements'
  },
  translucentFade: {
    path: '/dragons/og-dragon-translucent-fade.png',
    opacity: 0, // Variable opacity via fade
    description: 'Soft edge fade to transparent',
    bestUseCase: 'Floating overlays, dynamic backgrounds'
  },
  socialReady: {
    path: '/dragons/og-dragon-1200x630-translucent-40.png',
    opacity: 40,
    description: 'Social media optimized dragon',
    bestUseCase: 'OG images, social sharing previews'
  }
};

/**
 * Get optimal dragon asset based on context
 */
export const getDragonAsset = (context: 'hero' | 'section' | 'watermark' | 'overlay' | 'social'): DragonAsset => {
  switch (context) {
    case 'hero':
      return dragonAssets.translucent70;
    case 'section':
      return dragonAssets.translucent40;
    case 'watermark':
      return dragonAssets.translucent20;
    case 'overlay':
      return dragonAssets.translucentFade;
    case 'social':
      return dragonAssets.socialReady;
    default:
      return dragonAssets.translucent40;
  }
};

/**
 * Generate responsive dragon background CSS
 */
export const getDragonBackgroundCSS = (
  context: 'hero' | 'section' | 'watermark' | 'overlay',
  position: string = 'top right',
  size: string = 'contain'
): React.CSSProperties => {
  const asset = getDragonAsset(context);
  
  return {
    backgroundImage: `url('${asset.path}')`,
    backgroundPosition: position,
    backgroundSize: size,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll'
  };
};

/**
 * Dragon positioning presets for different sections
 */
export const dragonPositions = {
  heroRight: 'top right',
  heroCenter: 'center center',
  sectionCorner: 'top right -100px',
  watermarkCenter: 'center center',
  overlayFloat: 'bottom left',
  footerSubtle: 'bottom right'
};

/**
 * Device-aware dragon sizing
 */
export const getDragonSize = (screenSize: string): string => {
  switch (screenSize) {
    case 'xs':
    case 'sm':
      return '200px 200px';
    case 'md':
      return '300px 300px';
    case 'lg':
      return '400px 400px';
    case 'xl':
      return '500px 500px';
    case '2xl':
    case '3xl':
      return '600px 600px';
    default:
      return '400px 400px';
  }
};

/**
 * Check if dragon assets are available
 */
export const checkDragonAssets = async (): Promise<boolean> => {
  try {
    const response = await fetch(dragonAssets.translucent40.path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Fallback dragon placeholder for development
 */
export const dragonPlaceholder = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#39d7c9;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.1" />
      </linearGradient>
    </defs>
    <path d="M200 50 Q250 100 300 150 Q350 200 300 250 Q250 300 200 350 Q150 300 100 250 Q50 200 100 150 Q150 100 200 50 Z" fill="url(#dragonGrad)" stroke="#39d7c9" stroke-width="2" opacity="0.4"/>
    <circle cx="180" cy="160" r="8" fill="#39d7c9" opacity="0.6"/>
    <circle cx="220" cy="160" r="8" fill="#39d7c9" opacity="0.6"/>
    <text x="200" y="280" text-anchor="middle" fill="#39d7c9" font-size="12" opacity="0.8">Dragon</text>
  </svg>
`)}`;