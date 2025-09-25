import React, { useCallback, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

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
        no-print inline-flex items-center gap-2 rounded-xl px-3 py-2 
        bg-white/10 hover:bg-white/15 text-purple-900 dark:text-white 
        transition-all duration-200 focus:outline-none focus:ring-2 
        focus:ring-purple-400/60 disabled:opacity-50
        ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className={`transition-transform duration-200 ${isTransitioning ? 'rotate-180' : ''}`}>
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </div>
      <span className="text-sm font-medium">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;