// tailwind-dragon-safelist.config.js
// Add this to your main tailwind.config.js safelist array to prevent purging

const dragonBackdropSafelist = [
  // Positioning and layout
  'fixed', 'inset-0', 'absolute', 'isolate', 'overflow-hidden',
  
  // Z-index variants (Tailwind arbitrary values)
  'z-[-1]', 'z-10',
  
  // Opacity variants
  'opacity-70', 'opacity-0', 
  
  // Inset variants (negative spacing)
  '-inset-[2%]',
  
  // Animation control
  'motion-reduce:animate-none', 'motion-reduce:hidden',
  
  // Width and height variants (viewport units)
  'w-full', 'h-full',
  'w-[28vmin]', 'h-[28vmin]',
  'w-[22vmin]', 'h-[22vmin]',
  
  // Positioning variants (percentage)
  'left-[8%]', 'top-[8%]',
  'right-[10%]', 'top-[18%]',
  'top-4', 'right-4',
  
  // Background and color
  'bg-black/80',
  
  // Text styling
  'text-white', 'text-xs', 'font-mono',
  
  // Pointer events
  'pointer-events-none',
  
  // Transform utilities
  'will-change-transform',
  
  // Padding
  'p-2',
  
  // Custom classes used in the component
  'aurora-backdrop',
  'rain-heavy-layer',
  'rain-medium-layer', 
  'rain-light-layer',
  'lightning-flash-overlay',
  'rain-heavy-fast',
  'rain-medium-fast',
  'rain-light-fast',
];

// For use in your main tailwind.config.js:
// module.exports = {
//   content: [...],
//   safelist: [
//     ...dragonBackdropSafelist,
//     // ...other safelist items
//   ],
//   theme: {...},
//   plugins: [...],
// }

module.exports = { dragonBackdropSafelist };