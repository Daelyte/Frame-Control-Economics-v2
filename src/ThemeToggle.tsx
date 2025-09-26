import React, { useCallback, useEffect, useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fe_theme');
      if (stored) {
        const dark = stored !== 'light';
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const next = !isDark;
    setIsDark(next);
    
    try {
      localStorage.setItem('fe_theme', next ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
    
    document.documentElement.classList.toggle('dark', next);
    
    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isDark, isTransitioning]);

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={toggle}
      disabled={isTransitioning}
      className={`
        no-print group relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5
        bg-gradient-to-r from-white/20 via-white/15 to-white/10 
        dark:from-slate-800/60 dark:via-slate-800/50 dark:to-slate-800/40 
        backdrop-blur-md shadow-lg hover:shadow-xl border border-white/20 dark:border-white/10
        hover:from-white/30 hover:via-white/25 hover:to-white/20 
        dark:hover:from-slate-800/80 dark:hover:via-slate-800/70 dark:hover:to-slate-800/60
        text-slate-900 dark:text-white transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-purple-400/60 
        hover:scale-105 transform disabled:opacity-50
        ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer hover-lift'}
      `}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100'
          : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100'
      }`} />
      
      {/* Icon container */}
      <div className="relative">
        <div className={`transition-all duration-500 ${isTransitioning ? 'rotate-180 scale-110' : ''}`}>
          {isDark ? (
            <Sun className={`w-4 h-4 text-amber-500 ${!isTransitioning && isDark ? '' : 'animate-glow'}`} />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </div>
        
        {/* Sparkle effect during transition */}
        {isTransitioning && (
          <Sparkles className="absolute inset-0 w-4 h-4 text-purple-400 animate-spin opacity-60" />
        )}
      </div>
      
      {/* Label with enhanced styling */}
      <span className="text-sm font-semibold relative z-10">
        {isDark ? 'Light' : 'Dark'}
      </span>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};

export default ThemeToggle;