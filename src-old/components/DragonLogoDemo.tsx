import React from 'react';

interface DragonLogoDemoProps {
  className?: string;
}

const DragonLogoDemo: React.FC<DragonLogoDemoProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8 rounded-2xl ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-teal-200 mb-2">Dragon Logo Component</h2>
        <p className="text-slate-300">CSS-only animated logo with breathing glow and rotating glint</p>
      </div>
      
      <div className="flex flex-col items-center space-y-6">
        {/* Default size */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <a className="dragon-logo" href="/" aria-label="Frame Economics dragon mark"></a>
            <span className="text-lg font-semibold text-teal-100">Frame Economics</span>
          </div>
          <p className="text-sm text-slate-400">Default size (48px)</p>
        </div>
        
        {/* Large size */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <a 
              className="dragon-logo" 
              href="/" 
              aria-label="Frame Economics dragon mark"
              style={{ '--dragon-size': '72px' } as React.CSSProperties}
            ></a>
            <span className="text-xl font-semibold text-teal-100">Frame Economics</span>
          </div>
          <p className="text-sm text-slate-400">Large size (72px)</p>
        </div>
        
        {/* Extra large size */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-6 mb-2">
            <a 
              className="dragon-logo" 
              href="/" 
              aria-label="Frame Economics dragon mark"
              style={{ '--dragon-size': '96px' } as React.CSSProperties}
            ></a>
            <span className="text-2xl font-bold text-teal-100">Frame Economics</span>
          </div>
          <p className="text-sm text-slate-400">Extra large size (96px)</p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-teal-200 mb-3">Usage:</h3>
        <div className="space-y-2 text-sm">
          <div className="text-slate-300">
            <span className="text-teal-400">Basic:</span> 
            <code className="ml-2 px-2 py-1 bg-slate-700 rounded text-xs">&lt;a className="dragon-logo" href="/" /&gt;</code>
          </div>
          <div className="text-slate-300">
            <span className="text-teal-400">Custom size:</span> 
            <code className="ml-2 px-2 py-1 bg-slate-700 rounded text-xs">{"style={{'--dragon-size': '72px'}}"}</code>
          </div>
          <div className="text-slate-300">
            <span className="text-teal-400">Features:</span> 
            <span className="ml-2">Breathing glow, rotating glint, hover effects, reduced motion support</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Replace <code>/dragon-mark.png</code> with your actual dragon logo image
        </p>
      </div>
    </div>
  );
};

export default DragonLogoDemo;