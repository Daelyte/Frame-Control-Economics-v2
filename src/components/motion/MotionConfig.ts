// Motion Design System Configuration
// Goals: cool/controlled, premium feel
// Durations: 120–220ms micro; 320–600ms macro; 6–12s ambient loops
// Easings: cubic-bezier(.2,.8,.2,1) for UI; ease-in-out for ambience

export const motion = {
  duration: { 
    micro: 0.16, 
    small: 0.22, 
    medium: 0.38, 
    macro: 0.6, 
    ambient: 8 
  },
  ease: {
    ui: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
    soft: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
  amplitude: {
    parallax: 12, // max translate in px
    scale: 0.015, // max scale variation (1.5%)
    rotate: 3, // max rotation in degrees
    magnetic: 0.25, // cursor influence multiplier
  },
  opacity: {
    ambient: 0.6, // max ambient layer opacity
    hover: 0.35, // bloom effect alpha
    parallax: { min: 0.75, max: 1 }, // scroll fade range
  }
};