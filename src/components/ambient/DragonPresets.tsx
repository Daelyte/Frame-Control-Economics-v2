// Dragon backdrop presets for different moods and contexts
import OminousDragonBackdrop from './OminousDragonBackdrop';

// Enhanced preset configurations for behavioral psychology education
export const dragonPresets = {
  // Professional yet present - for main pages
  executive: {
    opacity: 0.12,        // Increased from 0.08 for better visibility
    smokeOpacity: 0.18,   // Enhanced mystical presence
    hue: 175, // cooler teal
    enableGazeTracking: true,
    enableBreathReaction: false, // Calmer for professional contexts
  },
  
  // Default educational look - optimal for learning
  balanced: {
    opacity: 0.15,        // Enhanced for education
    smokeOpacity: 0.22,   // More atmospheric
    hue: 170, // jade/teal
    enableGazeTracking: true,
    enableBreathReaction: true,
  },
  
  // Enhanced mystique - for advanced psychological concepts
  mystic: {
    opacity: 0.18,        // More prominent
    smokeOpacity: 0.28,   // Dense mystical atmosphere
    hue: 168, // slightly greener
    enableGazeTracking: true,
    enableBreathReaction: true,
  },
  
  // Warm and intelligent - for educational content
  warm: {
    opacity: 0.14,        // Approachable yet authoritative
    smokeOpacity: 0.20,   // Comfortable atmosphere
    hue: 175, // warm teal
    enableGazeTracking: true,
    enableBreathReaction: true,
  },
  
  // Minimal but still intelligent - for performance contexts
  minimal: {
    opacity: 0.08,        // Subtle but visible
    smokeOpacity: 0.12,   // Light atmospheric effect
    hue: 172,
    enableGazeTracking: false, // Reduce interactions for performance
    enableBreathReaction: false,
  },
  
  // High impact with full intelligence - for hero sections
  dramatic: {
    opacity: 0.22,        // Maximum educational presence
    smokeOpacity: 0.32,   // Heavy mystical atmosphere
    hue: 165, // menacing green with danger undertones
    enableGazeTracking: true,
    enableBreathReaction: true,
  }
} as const;

export type DragonPreset = keyof typeof dragonPresets;

// Convenient preset component with full intelligence features
export default function DragonBackdrop({ 
  preset = 'balanced',
  customSettings 
}: {
  preset?: DragonPreset;
  customSettings?: Partial<typeof dragonPresets.balanced>;
}) {
  const settings = {
    ...dragonPresets[preset],
    ...customSettings
  };

  return (
    <OminousDragonBackdrop
      opacity={settings.opacity}
      smokeOpacity={settings.smokeOpacity}
      hue={settings.hue}
      enableGazeTracking={settings.enableGazeTracking}
      enableBreathReaction={settings.enableBreathReaction}
    />
  );
}

// Individual preset components for easy import
export const ExecutiveDragon = () => <DragonBackdrop preset="executive" />;
export const BalancedDragon = () => <DragonBackdrop preset="balanced" />;
export const MysticDragon = () => <DragonBackdrop preset="mystic" />;
export const WarmDragon = () => <DragonBackdrop preset="warm" />;
export const MinimalDragon = () => <DragonBackdrop preset="minimal" />;
export const DramaticDragon = () => <DragonBackdrop preset="dramatic" />;