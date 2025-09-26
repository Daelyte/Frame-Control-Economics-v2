import React, { useState } from 'react';

const EarthDragonBanner: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-purple-200/50 dark:border-purple-700/50 mx-2 sm:mx-0">
      <div className="aspect-[1200/630] max-h-[50vh] sm:max-h-[70vh] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="text-center text-cyan-300">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300 mx-auto mb-4"></div>
                <p className="text-sm">Loading Earth Dragon Banner...</p>
              </div>
            )}
            <img 
              src="/og-earth-dragon.png" 
              alt="Frame Economics - Earth Dragon Edition - Master Behavioral Psychology & Influence" 
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => {
                console.log('✅ Earth Dragon banner loaded successfully');
                setImageLoaded(true);
              }}
              onError={(e) => {
                console.error('❌ Failed to load Earth Dragon banner:', e);
                console.log('Image src was:', e.currentTarget.src);
                setImageError(true);
              }}
            />
          </>
        ) : (
          <div className="text-center text-cyan-300 py-12">
            <div className="text-8xl mb-6 animate-pulse">🐉</div>
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
              FRAME ECONOMICS
            </h2>
            <p className="text-lg mt-3 opacity-90 text-cyan-100">Master Behavioral Psychology & Influence</p>
            <div className="mt-6 px-6 py-2 border border-cyan-400 rounded-full text-cyan-300 text-sm inline-block">
              Rules • Science • Case Studies
            </div>
            <p className="text-xs mt-6 text-yellow-400 bg-red-900/20 px-3 py-1 rounded">Banner image failed to load - showing fallback</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthDragonBanner;