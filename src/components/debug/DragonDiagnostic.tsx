// components/debug/DragonDiagnostic.tsx
// DIAGNOSTIC COMPONENT: Test stacking context, SVG rendering, and motion preferences
// Use this to verify the dragon backdrop works before deployment

import BulletproofStormBackdrop from '../ambient/BulletproofStormBackdrop';

export default function DragonDiagnostic() {
  return (
    <div className="min-h-screen relative">
      {/* The dragon backdrop with debug mode enabled */}
      <BulletproofStormBackdrop 
        debugMode={true}
        baseOpacity={0.25}  // Higher for testing visibility
        rainIntensity={2}   // Heavy storm for testing
        lightning={true}
        idPrefix="diagnostic"
      />
      
      {/* Test content to verify stacking */}
      <div className="relative z-10 p-8 space-y-6">
        <div className="bg-white/90 rounded-lg p-6 shadow-lg backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dragon Diagnostic Test</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <h2 className="font-semibold text-blue-900">✓ Stacking Context Test</h2>
              <p className="text-blue-700">This content should appear ABOVE the dragon backdrop.</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <h2 className="font-semibold text-green-900">✓ SVG Rendering Test</h2>
              <p className="text-green-700">You should see a subtle dragon silhouette behind this content.</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <h2 className="font-semibold text-purple-900">✓ Animation Test</h2>
              <p className="text-purple-700">Aurora should glow softly, rain should fall, lightning should flash occasionally.</p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded">
              <h2 className="font-semibold text-amber-900">⚠️ Reduced Motion Test</h2>
              <p className="text-amber-700">Check your debug overlay (top-right) for motion preference status.</p>
              <button 
                className="mt-2 px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-amber-900 text-sm"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    alert(`Reduced Motion: ${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'ACTIVE' : 'INACTIVE'}`);
                  }
                }}
              >
                Check Motion Preference
              </button>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <h2 className="font-semibold text-red-900">🐉 Dragon Visibility Test</h2>
              <p className="text-red-700">The dragon should be visible but subtle (baseOpacity: 0.25 for testing).</p>
              <p className="text-red-600 text-sm">Look for: head outline, teeth, glowing eye, storm breath effect.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 rounded-lg p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Expected Behavior</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Red debug outline</strong> around the backdrop container</li>
            <li>• <strong>Debug info panel</strong> in top-right corner</li>
            <li>• <strong>Subtle aurora glow</strong> with rotating colors</li>
            <li>• <strong>Three layers of rain</strong> falling diagonally</li>
            <li>• <strong>Lightning flashes</strong> every 25 seconds with bolts</li>
            <li>• <strong>Dragon silhouette</strong> with teeth, eye, and storm breath</li>
            <li>• <strong>OKLCH colors</strong> with hex fallbacks for older browsers</li>
          </ul>
        </div>
        
        <div className="bg-gray-900/90 text-white rounded-lg p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
          <div className="space-y-3 text-gray-300">
            <div>
              <strong className="text-red-400">Dragon not visible:</strong>
              <p>Check z-index stacking, ensure no parent has 'isolate' or transform.</p>
            </div>
            <div>
              <strong className="text-yellow-400">No animations:</strong>
              <p>Verify dragon-motion.css is imported and prefers-reduced-motion is not active.</p>
            </div>
            <div>
              <strong className="text-blue-400">Hydration errors:</strong>
              <p>Ensure idPrefix is consistent between server and client renders.</p>
            </div>
            <div>
              <strong className="text-green-400">Tailwind classes purged:</strong>
              <p>Add dragonBackdropSafelist to your tailwind.config.js safelist.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}