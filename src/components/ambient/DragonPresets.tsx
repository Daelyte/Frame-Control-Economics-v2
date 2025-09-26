// Dragon backdrop presets for different moods and contexts
import OminousDragonBackdrop from './OminousDragonBackdrop';

// Preset configurations for different contexts
export const dragonPresets = {
  // Subtle and professional - for main pages
  executive: {
    opacity: 0.08,
    smokeOpacity: 0.12,
    hue: 175, // cooler teal
  },
  
  // Default balanced look - great for most contexts  
  balanced: {
    opacity: 0.12,
    smokeOpacity: 0.18,
    hue: 170, // jade/teal
  },
  
  // More presence and mystique - for special sections
  mystic: {
    opacity: 0.15,
    smokeOpacity: 0.22,
    hue: 168, // slightly greener
  },
  
  // Warmer, more approachable - for educational content
  warm: {
    opacity: 0.10,
    smokeOpacity: 0.16,
    hue: 175, // warm teal with gold aurora accent
  },
  
  // Minimal for performance or subtle presence
  minimal: {
    opacity: 0.06,
    smokeOpacity: 0.08,
    hue: 172,
  },
  
  // High impact for landing/hero sections
  dramatic: {
    opacity: 0.18,
    smokeOpacity: 0.24,
    hue: 165, // more menacing green
  }
} as const;

export type DragonPreset = keyof typeof dragonPresets;

// Convenient preset component
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