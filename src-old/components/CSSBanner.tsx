import React from 'react';

interface CSSBannerProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const CSSBanner: React.FC<CSSBannerProps> = ({ 
  className = '', 
  variant = 'dark' 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-700/50 ${className}`}>
      <div className="aspect-[1200/630] max-h-[50vh] sm:max-h-[70vh] relative">
        {/* Background matching your design */}
        <div 
          className={`absolute inset-0 ${
            variant === 'dark' 
              ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
              : 'bg-gradient-to-br from-slate-100 via-white to-slate-200'
          }`}
        >
          {/* Radial overlay - matching your teal accent */}
          <div 
            className="absolute inset-0"
            style={{
              background: variant === 'dark' 
                ? 'radial-gradient(ellipse at 78% 46%, rgba(76, 170, 135, 0.4), transparent 70%)'
                : 'radial-gradient(ellipse at 78% 46%, rgba(39, 215, 201, 0.2), transparent 70%)'
            }}
          ></div>
          
          {/* Topographical lines - matching your design */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 43px,
                ${variant === 'dark' ? 'rgba(22, 65, 58, 0.3)' : 'rgba(40, 120, 100, 0.2)'} 44px
              )`
            }}
          ></div>
        </div>

        {/* Dragon silhouette - recreated to match your beautiful design */}
        <div className="absolute top-[8%] right-[5%] w-[60%] h-[85%] opacity-50">
          <svg 
            viewBox="0 0 500 400" 
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 25px rgba(57, 215, 201, 0.3))' }}
          >
            <defs>
              <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(57, 215, 201, 0.8)" />
                <stop offset="50%" stopColor="rgba(74, 222, 213, 0.6)" />
                <stop offset="100%" stopColor="rgba(89, 229, 220, 0.4)" />
              </linearGradient>
              <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(57, 215, 201, 0.6)" />
                <stop offset="50%" stopColor="rgba(74, 222, 213, 0.3)" />
                <stop offset="100%" stopColor="rgba(89, 229, 220, 0)" />
              </linearGradient>
            </defs>

            {/* Dragon head - elegant and curved */}
            <path 
              d="M280 180 C270 160, 260 140, 275 120 C290 100, 315 105, 330 125 C345 145, 340 165, 325 180 C310 195, 295 200, 280 180 Z"
              fill="url(#dragonGradient)"
              stroke="rgba(45, 181, 165, 0.8)"
              strokeWidth="1.5"
            />
            
            {/* Dragon snout/nose */}
            <path 
              d="M280 180 C270 185, 255 188, 245 185 C240 183, 238 180, 242 178 C250 175, 265 175, 280 180"
              fill="url(#dragonGradient)"
              stroke="rgba(45, 181, 165, 0.6)"
              strokeWidth="1"
            />
            
            {/* Majestic horns/antlers - flowing like your design */}
            <g stroke="url(#dragonGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round">
              {/* Main horn branches */}
              <path d="M315 125 C320 105, 325 90, 335 80 C340 75, 345 72, 350 68" />
              <path d="M325 120 C335 100, 345 85, 360 75 C368 70, 375 65, 382 60" />
              <path d="M335 130 C350 110, 365 95, 385 85 C395 80, 405 75, 415 70" />
              
              {/* Secondary horn details */}
              <path d="M340 78 C345 70, 350 65, 355 60" />
              <path d="M365 80 C372 72, 378 67, 385 62" />
              <path d="M390 88 C398 80, 405 75, 412 70" />
              
              {/* Horn tips */}
              <path d="M350 68 C352 65, 354 62, 356 58" />
              <path d="M382 60 C385 57, 388 54, 391 50" />
              <path d="M415 70 C418 67, 421 64, 424 60" />
            </g>
            
            {/* Dragon eye - piercing */}
            <ellipse 
              cx="305" 
              cy="155" 
              rx="6" 
              ry="8" 
              fill="rgba(120, 255, 200, 0.9)" 
            />
            <ellipse 
              cx="307" 
              cy="153" 
              rx="2" 
              ry="3" 
              fill="rgba(20, 100, 80, 0.8)" 
            />
            
            {/* Dragon neck - graceful S-curve */}
            <path 
              d="M280 190 C270 210, 265 235, 275 260 C285 285, 305 305, 330 310 C355 315, 380 305, 390 285 C395 275, 392 265, 385 258"
              fill="none"
              stroke="url(#dragonGradient)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Dragon body continuation */}
            <path 
              d="M385 258 C395 245, 405 230, 415 220 C425 210, 435 205, 445 208"
              fill="none"
              stroke="url(#dragonGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Dragon spines/ridges - elegant details */}
            <g stroke="rgba(57, 215, 201, 0.7)" strokeWidth="2" strokeLinecap="round">
              <path d="M290 205 L298 195" />
              <path d="M300 225 L308 215" />
              <path d="M315 245 L323 235" />
              <path d="M335 265 L343 255" />
              <path d="M360 280 L368 270" />
              <path d="M380 270 L388 260" />
            </g>
            
            {/* Flowing breath/flame effect */}
            <g className="dragon-breath-flow">
              <path 
                d="M245 185 C220 180, 195 175, 170 170 C145 165, 120 160, 95 155"
                stroke="url(#breathGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M250 190 C225 188, 200 186, 175 184 C150 182, 125 180, 100 178"
                stroke="url(#breathGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M248 195 C223 195, 198 195, 173 195 C148 195, 123 195, 98 195"
                stroke="url(#breathGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M252 200 C227 202, 202 204, 177 206 C152 208, 127 210, 102 212"
                stroke="url(#breathGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Flame wisps */}
              <path 
                d="M240 180 C215 178, 190 176, 165 174"
                stroke="rgba(57, 215, 201, 0.4)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M245 205 C220 208, 195 211, 170 214"
                stroke="rgba(57, 215, 201, 0.3)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Text content - matching your banner layout */}
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
          <div className="max-w-2xl">
            {/* Main title */}
            <h1 
              className={`text-4xl md:text-6xl font-bold leading-none mb-3 ${
                variant === 'dark' 
                  ? 'text-teal-100' 
                  : 'text-slate-900'
              }`}
              style={{ 
                textShadow: variant === 'dark' ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'
              }}
            >
              FRAME ECONOMICS
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-lg md:text-2xl mb-4 ${
                variant === 'dark' 
                  ? 'text-teal-200' 
                  : 'text-slate-700'
              }`}
            >
              Master Behavioral Psychology & Influence
            </p>
            
            {/* Features */}
            <p 
              className={`text-base md:text-lg mb-6 ${
                variant === 'dark' 
                  ? 'text-teal-300 opacity-90' 
                  : 'text-slate-600'
              }`}
            >
              Rules · Science · Case Studies
            </p>
            
            {/* URL pill - matching your design */}
            <div 
              className={`inline-block px-6 py-3 rounded-full border-2 text-sm font-semibold ${
                variant === 'dark'
                  ? 'bg-teal-500/80 border-teal-400 text-slate-900'
                  : 'bg-teal-600 border-teal-500 text-white'
              }`}
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: variant === 'dark' 
                  ? '0 0 20px rgba(57, 215, 201, 0.3)' 
                  : '0 4px 14px rgba(0, 0, 0, 0.1)'
              }}
            >
              icecoldfroste.com
            </div>
          </div>
        </div>

        {/* Subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: variant === 'dark'
              ? 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)'
              : 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.1) 100%)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default CSSBanner;