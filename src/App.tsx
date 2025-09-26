import React, { useState } from "react";
import FrameEconomicsWebsite from "./FrameEconomicsWebsite";
import ThemeToggle from "./ThemeToggle";
import { AuthProvider } from "./contexts/AuthContext";
import { Menu, X } from "lucide-react";

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <AuthProvider>
      <main className="min-h-screen page-light dark:page-gradient transition-colors duration-300">
        {/* Professional top navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/20 dark:border-slate-700/20">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">FE</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  <span className="hidden xs:inline">Frame Economics</span>
                  <span className="xs:hidden">Frame Econ</span>
                </span>
              </div>
              
              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#introduction" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Home
                </a>
                <a href="#about" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  About
                </a>
                <a href="#rules" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Rules
                </a>
                <a href="#community" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Community
                </a>
                <a href="#connect" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Connect
                </a>
              </div>
              
              {/* Mobile menu button and theme toggle */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  aria-label="Toggle mobile menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200/20 dark:border-slate-700/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  <a 
                    href="#introduction" 
                    onClick={closeMobileMenu}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors py-2 border-b border-slate-200/30 dark:border-slate-700/30"
                  >
                    Home
                  </a>
                  <a 
                    href="#about" 
                    onClick={closeMobileMenu}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors py-2 border-b border-slate-200/30 dark:border-slate-700/30"
                  >
                    About
                  </a>
                  <a 
                    href="#rules" 
                    onClick={closeMobileMenu}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors py-2 border-b border-slate-200/30 dark:border-slate-700/30"
                  >
                    Rules
                  </a>
                  <a 
                    href="#community" 
                    onClick={closeMobileMenu}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors py-2 border-b border-slate-200/30 dark:border-slate-700/30"
                  >
                    Community
                  </a>
                  <a 
                    href="#connect" 
                    onClick={closeMobileMenu}
                    className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors py-2"
                  >
                    Connect
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
        
        {/* Main content */}
        <div className="animate-fade-in">
          <FrameEconomicsWebsite />
        </div>
      </main>
    </AuthProvider>
  );
};

export default App;